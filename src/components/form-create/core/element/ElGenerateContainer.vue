<template>
  <template
    v-if="
      ['rootGrid', 'grid'].includes(element.type) && element.options.showModel
    "
  >
    <el-row
      v-if="element.key"
      :key="element.key"
      type="flex"
      :class="{
        'generate-col generate-view': type == 'select',
        active: selectGenerate?.key === element.key && type == 'select',
      }"
      :gutter="element.options.gutter ?? 0"
      :justify="element.options.justify"
      :align="element.options.align"
    >
      <el-col
        v-for="(col, colIndex) of element.list"
        :key="colIndex"
        :span="col.span ?? 0"
      >
        <div
          v-if="multiSelectMode"
          class="widget-checkbox-wrapper select-all-wrapper"
        >
          <el-checkbox
            :modelValue="getSelectionStatus(col.list) === true"
            :indeterminate="getSelectionStatus(col.list) === 'indeterminate'"
            @change="handleSelectAll(col.list, $event)"
          />
          选择全部
        </div>
        <ElGenerateContainer
          v-for="colItem of col.list"
          :key="colItem.key"
          :element="colItem"
          :type="type"
          :model="model"
          :config="config"
          :widgetForm="widgetForm"
          :selectGenerate="selectGenerate"
          :multiSelectMode="multiSelectMode"
          :selectedGenerates="selectedGenerates"
          :disabled="disabled"
          :readonly="readonly"
          :variables="variables"
          :selectFields="selectFields"
          @item-click="handleItemClick"
          @dialog="handleDialog"
          @toggle-selection="handleToggleSelection"
        />
      </el-col>
    </el-row>
  </template>
  <template v-else-if="element.type === 'tabs' && element.options.showModel">
    <el-tabs
      v-if="element.key"
      :key="element.key"
      :type="element.options.type"
      :tab-position="element.options.tabPosition"
      :modelValue="element.options.defaultValue"
      :class="{
        'generate-col generate-view': type == 'select',
        active: selectGenerate?.key === element.key && type == 'select',
      }"
    >
      <el-tab-pane
        v-for="(tab, tabIndex) of element.list"
        :key="tabIndex"
        :label="tab.label"
        :name="tab.name"
        lazy
      >
        <div
          v-if="multiSelectMode"
          class="widget-checkbox-wrapper select-all-wrapper"
        >
          <el-checkbox
            :modelValue="getSelectionStatus(tab.list) === true"
            :indeterminate="getSelectionStatus(tab.list) === 'indeterminate'"
            @change="handleSelectAll(tab.list, $event)"
          />
          选择全部
        </div>
        <ElGenerateContainer
          v-for="tabItem of tab.list"
          :key="tabItem.key"
          :element="tabItem"
          :type="type"
          :model="model"
          :config="config"
          :widgetForm="widgetForm"
          :selectGenerate="selectGenerate"
          :multiSelectMode="multiSelectMode"
          :selectedGenerates="selectedGenerates"
          :disabled="disabled"
          :readonly="readonly"
          :variables="variables"
          :selectFields="selectFields"
          @item-click="handleItemClick"
          @dialog="handleDialog"
          @toggle-selection="handleToggleSelection"
        />
      </el-tab-pane>
    </el-tabs>
  </template>
  <ElGenerateFormItem
    v-else-if="element.options.showModel"
    :key="element.key"
    :type="type"
    :model="model"
    :element="element"
    :config="config"
    :widgetForm="widgetForm"
    :selectGenerate="selectGenerate"
    :multiSelectMode="multiSelectMode"
    :selectedGenerates="selectedGenerates"
    :disabled="disabled"
    :readonly="readonly"
    :variables="variables"
    :selectFields="selectFields"
    @click.stop="handleItemClick(element)"
    @toggle-selection="handleToggleSelection"
    @dialog="handleDialog"
  />
</template>

<script setup lang="ts">
import { defineComponent, PropType } from "vue";
import ElGenerateFormItem from "./ElGenerateFormItem.vue";
import { WidgetForm } from "@/components/form-create/config/element";

const props = defineProps({
  element: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    default: "view",
  },
  model: {
    type: Object,
    required: true,
  },
  config: {
    type: Object as PropType<WidgetForm["config"]>,
  },
  widgetForm: {
    type: Object as PropType<WidgetForm>,
    required: true,
  },
  selectGenerate: {
    type: Object,
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  readonly: {
    type: Boolean,
    default: false,
  },
  variables: {
    type: Array,
    default: () => [],
  },
  multiSelectMode: {
    type: Boolean,
    default: false,
  },
  selectedGenerates: {
    type: Set as PropType<Set<string>>,
    default: () => new Set(),
  },
  selectFields: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits<{
  (e: "item-click", row: any): void;
  (e: "dialog", data: any): void;
  (e: "toggle-selection", row: any): void;
}>();

const handleItemClick = (row: any) => {
  emit("item-click", row);
};

const handleDialog = (data: any) => {
  emit("dialog", data);
};

// 处理多选切换事件
const handleToggleSelection = (row: any) => {
  emit("toggle-selection", row);
};

// 递归获取列表中所有组件的key
const getAllKeys = (list: any[]): string[] => {
  const keys: string[] = [];
  list.forEach((item) => {
    if (item.list) {
      keys.push(...getAllKeys(item.list));
    } else {
      keys.push(item.model);
    }
  });
  return keys;
};

// 判断当前列表下的所有组件的选中状态
const getSelectionStatus = (list: any[]): boolean | "indeterminate" => {
  if (!list || list.length === 0) {
    return false;
  }
  const allKeys = getAllKeys(list);
  if (allKeys.length === 0) {
    return false;
  }
  const selectedCount = allKeys.filter((model) =>
    props.selectedGenerates.has(model)
  ).length;
  if (selectedCount === 0) {
    return false;
  } else if (selectedCount === allKeys.length) {
    return true;
  } else {
    return "indeterminate";
  }
};

// 递归选择当前列表下的所有组件
const selectAllInList = (list: any[]) => {
  list.forEach((item) => {
    if (item.list) {
      selectAllInList(item.list);
    } else {
      if (!props.selectedGenerates.has(item.model)) {
        emit("toggle-selection", item);
      }
    }
  });
};

// 递归取消选择当前列表下的所有组件
const deselectAllInList = (list: any[]) => {
  list.forEach((item) => {
    if (item.list) {
      deselectAllInList(item.list);
    } else {
      if (props.selectedGenerates.has(item.model)) {
        emit("toggle-selection", item);
      }
    }
  });
};

// 处理选择全部事件
const handleSelectAll = (list: any[], checked: boolean) => {
  console.log(list, checked, "-checked");
  if (checked) {
    selectAllInList(list);
  } else {
    deselectAllInList(list);
  }
};
</script>

<style scoped>
.select-all-wrapper {
  margin-bottom: 10px;
  background: #f5f7fa;
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>