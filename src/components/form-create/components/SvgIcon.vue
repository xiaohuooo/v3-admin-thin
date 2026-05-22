<template>
  <div
    v-if="isExternal"
    :style="styleExternalIcon"
    class="svg-external-icon svg-icon"
    v-on="$attrs"
  />
  <component
    :is="getSvgIcon(iconClass)"
    v-else
    :class="svgClass"
    v-on="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from "vue";
import * as utils from "@/components/form-create/utils";

defineOptions({
  name: "SvgIcon"
});

const props = defineProps<{
  iconClass: string;
  className?: string;
}>();
const images = import.meta.glob("../icons/svg/*.svg", {
  eager: true
});

// 辅助函数获取图片
const getSvgIcon = (name: string) => {
  const path = `../icons/svg/${name}.svg`;
  return images[path]?.default || "";
};

const isExternal = computed(() => utils.isExternal(props.iconClass));
const svgClass = computed(() => {
  if (props.className) {
    return `svg-icon ${props.className}`;
  } else {
    return "svg-icon";
  }
});
const styleExternalIcon = computed(() => ({
  mask: `url(${props.iconClass}) no-repeat 50% 50%`,
  "-webkit-mask": `url(${props.iconClass}) no-repeat 50% 50%`
}));
</script>

<style lang="scss" scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
  display: inline-block;
}

.svg-external-icon {
  background-color: currentColor;
  mask-size: cover !important;
  display: inline-block;
}
</style>
