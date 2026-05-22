<template>
  <Codemirror
    v-model="value"
    class="formula-editor-codemirror"
    :style="{ height: `${height}px`, minHeight: '200px' }"
    :autofocus="true"
    :indent-with-tab="true"
    :tab-size="2"
    :extensions="extensions"
    :disabled="disabled"
    :placeholder="placeholder || '请输入...'"
    @ready="handleReady"
  />
</template>

<script setup lang="ts">
import { EditorState } from "@codemirror/state";
import { EditorView } from "@codemirror/view";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";

import {
  autocompletion,
  closeBrackets,
  type Completion,
  pickedCompletion,
} from "@codemirror/autocomplete";

import { Codemirror } from "vue-codemirror";

import { shallowRef, computed, watch, type PropType } from "vue";

import { createMathPlaceholder } from "../utils/placeholder";
import { VARIABLE_REG } from "../utils/formula";
import type { MathItem, VariableItem } from "../interfaces";

const props = defineProps({
  isDark: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  height: {
    type: Number,
    default: 200,
  },
  placeholder: {
    type: String,
    default: "",
  },
  // 变量列表
  variables: {
    type: Array as PropType<VariableItem[]>,
    default: () => [],
  },
  oldVariables: {
    type: Array as () => VariableItem[],
    default: () => [],
  },
  // 支持的math方法
  mathList: {
    type: Array as PropType<MathItem[]>,
    default: () => [],
  },
});

const value = defineModel({ default: "" });
const editor = shallowRef<EditorView>();

const variablesVals = computed(() => {
  return props.variables.map((item) => item.model);
});

const mathNames = computed(() => {
  return props.mathList.map((item) => item.functionName);
});

const MATH_REG = computed(() => {
  return new RegExp(`\\b(${mathNames.value.join("|")})\\b`, "g");
});

// 变量高亮
const variablePlaceholder = createMathPlaceholder(
  VARIABLE_REG,
  (match) => {
    const val = match[1];
    const variable = props.variables.find((item) => item.model === val);
    if (variable) {
      return variable.label;
    } else {
      const oldVariable = props.oldVariables.find((item) => item.model === val);
      if (oldVariable) {
        return `不可用字段(${oldVariable.label})`;
      }
      return "不可用字段";
    }
  },
  "variable"
);

const mathsPlaceholder = createMathPlaceholder(
  MATH_REG.value,
  (match) => {
    return match[0];
  },
  "mathfunc"
);

const mathsCompletions: Completion[] = props.mathList.map((item) => {
  return {
    label: item.functionName,
    type: "keyword",
    apply: (
      view: EditorView,
      completion: Completion,
      from: number,
      to: number
    ) => {
      view.dispatch({
        changes: {
          from,
          to,
          insert: `${completion.label}()`,
        },
      });
      let cursor = editor.value?.state.selection.main.head || 0;
      view.dispatch({
        selection: { anchor: cursor - 1 },
        annotations: pickedCompletion.of(completion),
      });
    },
  };
});

const autoCompletions = (context: any) => {
  let before = context.matchBefore(/\w+/);
  if (!context.explicit && !before) return null;

  return {
    from: before ? before.from : context.pos,
    options: [...mathsCompletions],
    validFor: /^\w*$/,
  };
};

const extensions = computed(() => {
  const list = [
    javascript(),
    closeBrackets(),
    autocompletion({ override: [autoCompletions] }),
    variablePlaceholder,
    mathsPlaceholder,
    EditorView.lineWrapping,
  ];
  if (props.isDark) {
    list.push(oneDark);
  }
  console.log(variablePlaceholder);

  return list;
});

const handleReady = (payload: {
  view: EditorView;
  state: EditorState;
  container: HTMLDivElement;
}) => {
  editor.value = payload.view;
};

const insertText = (
  text: string,
  template: (text: string) => string,
  isFunc = false
) => {
  if (!editor.value) {
    return;
  }
  console.log(editor.value.state.selection.main);

  const { from, to } = editor.value.state.selection.main;
  const insert = template(text);
  const len = insert.length;
  editor.value.dispatch({
    changes: {
      from,
      to,
      insert,
    },
    selection: {
      anchor: from + (isFunc ? len - 1 : len),
    },
  });
  editor.value.focus();
};

const insertVariables = (varName: string) => {
  insertText(varName, (text) => "${" + text + "}");
};

const insertMaths = (mathName: string) => {
  insertText(mathName, (name) => `${name}()`, true);
};

const insertValue = (str: string) => {
  insertText(str, (text) => text);
};
defineExpose({
  insertMaths,
  insertVariables,
  insertValue,
});

defineOptions({
  name: "FormulaCodeMirror",
});
</script>
<style lang="scss"  scoped>
</style>