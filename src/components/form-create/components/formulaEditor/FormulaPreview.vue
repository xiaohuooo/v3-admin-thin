<template>
  <div class="formula-preview">
    <div
      class="cm-widget-placeholder"
      v-html="highlightedFormula"
      v-unvailable-click
    ></div>
    <div class="unit" v-if="$slots.append"><slot name="append"></slot></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { VARIABLE_REG } from "./utils/formula";
import type { MathItem, VariableItem } from "./interfaces";
import { FORMULA_MATHS } from "./utils/math";
import { useFormCreateStoreHook } from "@/store/modules/formCreate";
import { uuid, flatTree, generateRandomData } from "./utils/index";

const props = defineProps({
  formula: {
    type: String,
    default: "",
  },
  variables: {
    type: Array as () => VariableItem[],
    default: () => [],
  },
  oldVariables: {
    type: Array as () => VariableItem[],
    default: () => [],
  },
  // mathList: {
  //   type: Array as PropType<MathItem[]>,
  //   default: () => FORMULA_MATHS,
  // },
});

const emit = defineEmits(["unvailableclick"]);

const formCreateStore = useFormCreateStoreHook();
const mathList = computed(() => {
  return formCreateStore.formulaMaths.length > 0
    ? formCreateStore.formulaMaths
    : FORMULA_MATHS;
});

// 树形mathList展平
const mathNames = computed(() => {
  const flatMathList = flatTree(mathList.value);
  return flatMathList.map((item) => item.functionName);
});

const MATH_REG = computed(() => {
  return new RegExp(`\\b(${mathNames.value.join("|")})\\b`, "g");
});

const highlightedFormula = computed(() => {
  let result = props.formula;

  // 高亮函数名
  if (MATH_REG.value.test(result)) {
    result = result.replace(MATH_REG.value, (match) => {
      return `<span class="cm-widget-placeholder cm-widget-placeholder__mathfunc">${match}</span>`;
    });
  }

  // 重置正则表达式的lastIndex
  MATH_REG.value.lastIndex = 0;

  // 高亮变量
  result = result.replace(VARIABLE_REG, (match, p1) => {
    const variable = props.variables.find((item) => item.model === p1);
    let label = "";
    if (variable && variable.label) {
      label = variable.label;
    } else {
      let v = props.oldVariables.find((item) => item.model === p1);
      if (v && v.label) {
        label = `不可用字段(${v?.label})`;
      } else {
        label = "不可用字段";
      }
    }

    const isUnavailable = !variable;
    return `<span class="cm-widget-placeholder cm-widget-placeholder__variable" ${
      isUnavailable ? 'data-unavailable="true"' : ""
    }>${label}</span>`;
  });

  // 高亮数字常量
  result = result.replace(/\b\d+(\.\d+)?\b/g, (match) => {
    return `<span class="ͼd">${match}</span>`;
  });

  return result;
});

// 自定义指令：处理不可用字段的点击事件
const vUnvailableClick = {
  mounted(el) {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (target.dataset.unavailable === "true") {
        emit("unvailableclick", event);
        // 这里可以添加具体的处理逻辑
      }
    };

    el.addEventListener("click", handleClick);

    // 保存处理函数到元素上，以便在unmounted时移除
    (el as any).__unavailableClickHandler = handleClick;
  },
  unmounted(el) {
    const handleClick = (el as any).__unavailableClickHandler;
    if (handleClick) {
      el.removeEventListener("click", handleClick);
    }
  },
};
</script>

<style lang="scss">
.formula-preview {
  width: 100%;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  background-color: #f5f7fa;
  line-height: 1.5;
  display: inline-flex;
  gap: 10px;
}
.cm-widget-placeholder {
  padding: 8px 12px;
  // 滚动条隐藏
  overflow: auto;
  scrollbar-width: none;
  white-space: nowrap;
  flex: 1;
}
.unit {
  min-width: 13ch !important;
  display: flex;
  align-items: center;
  box-shadow: 0 1px 0 0 var(--el-input-border-color) inset,
    0 -1px 0 0 var(--el-input-border-color) inset,
    -1px 0 0 0 var(--el-input-border-color) inset;
  background-color: var(--el-fill-color-light);
  border-radius: var(--el-input-border-radius);
  color: var(--el-color-info);
}
</style>
