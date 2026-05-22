<template>
  <div ref="aceRef" style="width: 100%; height: 350px" />
</template>

<script setup lang="ts">
import { onMounted, ref, watch, defineExpose } from "vue";
import modeJson from "ace-builds/src-noconflict/mode-json?url";
import ace, { Ace, config } from "ace-builds";
import githubTheme from "ace-builds/src-noconflict/theme-github?url";

config.setModuleUrl("ace/theme/github", githubTheme);
config.setModuleUrl("ace/mode/json", modeJson);

const props = defineProps<{
  value: string;
  language?: string;
  theme?: string;
  readonly?: boolean;
}>();

const emit = defineEmits<{
  "update:value": [value: string];
}>();

const aceRef = ref<HTMLElement | null>(null);
const codeEditor = ref<Ace.Editor | undefined>(undefined);

onMounted(() => {
  if (!aceRef.value) return;

  codeEditor.value = ace.edit(aceRef.value, {
    mode: `ace/mode/${props.language || "javascript"}`,
    theme: `ace/theme/${props.theme || "github"}`,
    value: props.value,
    readOnly: props.readonly || false,
    fontSize: 12,
    tabSize: 2,
  });

  codeEditor.value.on("change", () => {
    if (codeEditor.value) {
      emit("update:value", codeEditor.value.getValue());
    }
  });
});

watch(
  () => props.value,
  (val) => {
    if (codeEditor.value) {
      const currentPosition = codeEditor.value.selection.getCursor();
      codeEditor.value.setValue(val);
      codeEditor.value.clearSelection();
      codeEditor.value.gotoLine(
        currentPosition.row + 1,
        currentPosition.column,
        true
      );
    }
  }
);

// 暴露给外部使用的方法
defineExpose({
  codeEditor,
});
</script>
