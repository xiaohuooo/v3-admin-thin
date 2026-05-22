<template>
  <div class="formula-list">
    <el-scrollbar class="scrollbar">
      <el-tree
        ref="treeRef"
        :data="props.nodes"
        :props="defaultProps"
        :current-node-key="currentKeyNode.enCode"
        :filter-node-method="filterNode"
        @node-click="nodeClick"
        highlight-current
      >
        <template #default="{ node, data }">
          <span class="info-container" @mouseenter="enterInfo(data)">
            <span>{{ data.functionName }}</span>
            <span v-if="data.desc" class="tip">
              {{ data.desc }}
            </span>
          </span>
        </template>
      </el-tree>
    </el-scrollbar>
  </div>
</template>
<script setup lang="ts">
import { onMounted, ref, computed, watch, defineProps } from "vue";

const props = defineProps({
  nodes: {
    type: Array,
    default: () => [],
  },
  searchTreeVariable: {
    type: String,
    default: "",
  },
  defaultProps: {
    type: Object,
    default: () => ({
      children: "children",
      label: "functionName",
    }),
  },
});

const currentKeyNode = ref({});
const treeRef = ref(null);
const emit = defineEmits("formulaClick", "enterInfo");
const filterTreeData = (nodes) => {
  // 找到nodes树中包含searchTreeVariable的节点但只有一层的结果
  return nodes.reduce((pre, cur) => {
    if (cur.functionName.toLowerCase().includes(props.searchTreeVariable)) {
      pre.push({ ...cur });
    }
    if (cur.children) {
      pre.push(...filterTreeData(cur.children));
    }
    return pre;
  }, []);
};

const nodeClick = (o) => {
  // 目录情况
  if (o.children) {
    if (currentKeyNode.value && currentKeyNode.value.enCode) {
      currentKeyNode.value = {};
    }
    return;
  }
  currentKeyNode.value = o;
  emit("formulaClick", o);
};
const enterInfo = (data) => {
  if (data.children) return;
  emit("enterInfo", data);
};
const filterNode = (value, data) => {
  if (!value) return true;
  return data.functionName.toLowerCase().includes(value.toLowerCase());
};

watch(
  () => props.searchTreeVariable,
  (newVal) => {
    if (treeRef.value) {
      treeRef.value.filter(newVal);
    }
  }
);
</script>
<style scoped lang="scss">
.formula-list {
  overflow: auto;
  height: 100%;
  .info-container {
    width: 100%;
    display: flex;
    flex-direction: column;
  }
  ::v-deep(.el-tree-node__content) {
    height: 100%;
    // margin-top: 6px;
    padding: 6px 0;
    user-select: none;
  }
  .tip {
    font-size: 12px;
    color: #999;
    margin-top: 1px;
    line-height: 1.2;
  }
  .scrollbar {
    height: 100%;
  }
}
</style>