<template>
  <el-header class="btn-bar">
    <slot />
    <!-- <el-button
      v-if="$attrs.uploadJson"
      type="text"
      @click="$emit('uploadJson')"
    >
      <template #icon>
        <SvgIcon iconClass="upload" />
      </template>
      导入JSON
    </el-button> -->
    <!-- 批量复制 -->
    <el-button v-if="$attrs.copyable" type="text" @click="$emit('copyable')">
      <template #icon>
        <SvgIcon iconClass="copy" />
      </template>
      {{ multiSelectMode ? "取消" : "批量" }}
    </el-button>
    <el-button v-if="$attrs.clearable" type="text" @click="$emit('clearable')">
      <template #icon>
        <SvgIcon iconClass="clearable" />
      </template>
      清空
    </el-button>
    <el-button v-if="$attrs.preview" type="text" @click="$emit('preview')">
      <template #icon>
        <SvgIcon iconClass="preview" />
      </template>
      预览
    </el-button>
    <!-- <el-button
      v-if="$attrs.generateJson"
      type="text"
      @click="$emit('generateJson')"
    >
      <template #icon>
        <SvgIcon iconClass="generate-json" />
      </template>
      生成JSON
    </el-button> -->
    <!-- <el-button
      v-if="$attrs.generateCode"
      type="text"
      @click="$emit('generateCode')"
    >
      <template #icon>
        <SvgIcon iconClass="generate-code" />
      </template>
      生成代码
    </el-button> -->
  </el-header>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SvgIcon from "@/components/form-create/components/SvgIcon.vue";

export default defineComponent({
  name: "CustomHeader",
  components: {
    SvgIcon,
  },
  props: {
    multiSelectMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: [
    "uploadJson",
    "clearable",
    "preview",
    "copyable",
    "generateJson",
    "generateCode",
  ],
});
</script>
