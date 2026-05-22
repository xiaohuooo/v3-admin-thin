<template>
  <div v-if="['rootGrid', 'grid'].includes(element.type)">
    <div
      v-show="element.options.showModel"
      class="widget-col widget-view"
      :key="element.key"
    >
      <el-row
        v-if="element.key"
        type="flex"
        :class="{ active: selectWidget?.key === element.key }"
        :gutter="element.options.gutter ?? 0"
        :justify="element.options.justify"
        :align="element.options.align"
        @click.stop="handleItemClick(element)"
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
          <Draggable
            class="widget-col-list"
            :class="{ rootList: 'rootGrid' == element.type }"
            item-key="key"
            ghostClass="ghost"
            handle=".drag-widget"
            :animation="200"
            :group="{ name: 'people' }"
            :no-transition-on-drag="true"
            :list="col.list"
            @add="handleColMoveAdd($event, element, colIndex)"
          >
            <template #item="{ element: childElement, index }">
              <transition-group name="fade" tag="div">
                <ElWidgetContainer
                  v-if="childElement.key"
                  :key="childElement.key"
                  :element="childElement"
                  :config="config"
                  :widgetForm="widgetForm"
                  :selectWidget="selectWidget"
                  :parentList="col.list"
                  :parentIndex="index"
                  :multiSelectMode="multiSelectMode"
                  :selectedWidgets="selectedWidgets"
                  @item-click="handleItemClick"
                  @copy="handleCopyClick"
                  @delete="handleDeleteClick"
                  @col-move-add="handleColMoveAdd"
                  @tabs-move-add="handleTabsMoveAdd"
                  @dialog="handleDialog"
                  @toggle-selection="handleToggleSelection"
                />
              </transition-group>
            </template>
          </Draggable>
        </el-col>
      </el-row>
      <div
        v-if="selectWidget?.key === element.key && element.type != 'rootGrid'"
        class="widget-view-action widget-col-action"
      >
        <SvgIcon
          iconClass="delete"
          @click.stop="handleDeleteClick(parentIndex, parentList)"
        />
      </div>

      <div
        v-if="selectWidget?.key === element.key && element.type != 'rootGrid'"
        class="widget-view-drag widget-col-drag"
      >
        <SvgIcon iconClass="move" className="drag-widget" />
      </div>
    </div>
  </div>
  <div v-else-if="element.type === 'tabs'">
    <div v-show="element.options.showModel" class="widget-col widget-view">
      <el-tabs
        v-if="element.key"
        :key="element.key"
        :type="element.options.type"
        :modelValue="element.options.defaultValue"
        :tab-position="element.options.tabPosition"
        :class="{ active: selectWidget?.key === element.key }"
        @click.stop="handleItemClick(element)"
      >
        <el-tab-pane
          v-for="(tab, tabIndex) of element.list"
          :key="tabIndex"
          :label="tab.label"
          :name="tab.name"
          lazy
        >
          <div v-if="!tab.list.length" class="widget-tab-empty">
            从左侧拖拽来添加字段
          </div>
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
          <Draggable
            class="widget-tab-list"
            item-key="key"
            ghostClass="ghost"
            handle=".drag-widget"
            :animation="200"
            :group="{ name: 'people' }"
            :no-transition-on-drag="true"
            :list="tab.list"
            @add="handleTabsMoveAdd($event, element, tabIndex)"
          >
            <template #item="{ element: childElement, index }">
              <transition-group name="fade" tag="div">
                <ElWidgetContainer
                  v-if="childElement.key"
                  :key="childElement.key"
                  :element="childElement"
                  :config="config"
                  :widgetForm="widgetForm"
                  :selectWidget="selectWidget"
                  :parentList="tab.list"
                  :parentIndex="index"
                  :multiSelectMode="multiSelectMode"
                  :selectedWidgets="selectedWidgets"
                  @item-click="handleItemClick"
                  @copy="handleCopyClick"
                  @delete="handleDeleteClick"
                  @col-move-add="handleColMoveAdd"
                  @tabs-move-add="handleTabsMoveAdd"
                  @dialog="handleDialog"
                  @toggle-selection="handleToggleSelection"
                />
              </transition-group>
            </template>
          </Draggable>
        </el-tab-pane>
      </el-tabs>
      <div
        v-if="selectWidget?.key === element.key"
        class="widget-view-action widget-col-action"
      >
        <SvgIcon
          iconClass="delete"
          @click.stop="handleDeleteClick(parentIndex, parentList)"
        />
      </div>

      <div
        v-if="selectWidget?.key === element.key"
        class="widget-view-drag widget-col-drag"
      >
        <SvgIcon iconClass="move" className="drag-widget" />
      </div>
    </div>
  </div>
  <!-- <div v-else-if="element.type === 'drawdown'">
    <div v-show="element.options.showModel" class="widget-col widget-view">
      <el-collapse
        :modelValue="element.options.defaultValue"
        :expand-icon-position="expandIconPosition"
      >
        <el-collapse-item
          v-for="(drawdown, drawdownIndex) of element.list"
          :key="drawdownIndex"
          :name="drawdown.name"
          :title="drawdown.label"
        >
          <Draggable
            class="widget-tab-list"
            item-key="key"
            ghostClass="ghost"
            handle=".drag-widget"
            :animation="200"
            :group="{ name: 'people' }"
            :no-transition-on-drag="true"
            :list="drawdown.list"
            @add="handleTabsMoveAdd($event, element, tabIndex)"
          >
            <template #item="{ element: childElement, index }">
              <transition-group name="fade" tag="div">
                <ElWidgetContainer
                  v-if="childElement.key"
                  :key="childElement.key"
                  :element="childElement"
                  :config="config"
                  :widgetForm="widgetForm"
                  :selectWidget="selectWidget"
                  :parentList="tab.list"
                  :parentIndex="index"
                  @item-click="handleItemClick"
                  @copy="handleCopyClick"
                  @delete="handleDeleteClick"
                  @col-move-add="handleColMoveAdd"
                  @tabs-move-add="handleTabsMoveAdd"
                />
              </transition-group>
            </template>
          </Draggable>
        </el-collapse-item>
      </el-collapse>
      <div
        v-if="selectWidget?.key === element.key"
        class="widget-view-action widget-col-action"
      >
        <SvgIcon
          iconClass="delete"
          @click.stop="handleDeleteClick(parentIndex, parentList)"
        />
      </div>

      <div
        v-if="selectWidget?.key === element.key"
        class="widget-view-drag widget-col-drag"
      >
        <SvgIcon iconClass="move" className="drag-widget" />
      </div>
    </div>
  </div> -->
  <ElWidgetFormItem
    v-else-if="element.key"
    :element="element"
    :config="config"
    :widgetForm="widgetForm"
    :selectWidget="selectWidget"
    :multiSelectMode="multiSelectMode"
    :selectedWidgets="selectedWidgets"
    @dialog="handleDialog"
    @click.stop="handleItemClick(element)"
    @copy="handleCopyClick(parentIndex, parentList)"
    @delete="handleDeleteClick(parentIndex, parentList)"
    @toggle-selection="handleToggleSelection"
  />
</template>

<script setup lang="ts">
import { PropType } from "vue";
import Draggable from "vuedraggable";
import ElWidgetFormItem from "./ElWidgetFormItem.vue";
import SvgIcon from "@/components/form-create/components/SvgIcon.vue";
import { WidgetForm } from "@/components/form-create/config/element";

// 定义 props
const props = defineProps({
  element: {
    type: Object,
    required: true,
  },
  config: {
    type: Object as PropType<WidgetForm["config"]>,
    required: true,
  },
  widgetForm: {
    type: Object as PropType<WidgetForm>,
    required: true,
  },
  selectWidget: {
    type: Object,
  },
  parentList: {
    type: Array,
    default: () => [],
  },
  parentIndex: {
    type: Number,
    default: -1,
  },
  multiSelectMode: {
    type: Boolean,
    default: false,
  },
  selectedWidgets: {
    type: Set as PropType<Set<string>>,
    default: () => new Set(),
  },
});

// 定义 emits
const emit = defineEmits<{
  (e: "item-click", row: any): void;
  (e: "copy", index: number, list: any[]): void;
  (e: "delete", index: number, list: any[]): void;
  (
    e: "col-move-add",
    event: any,
    row: any,
    index: string | number | symbol
  ): void;
  (
    e: "tabs-move-add",
    event: any,
    row: any,
    index: string | number | symbol
  ): void;
  (e: "toggle-selection", row: any): void;
  (e: "dialog", event: any): void;
}>();

// 处理点击事件
const handleItemClick = (row: any) => {
  if (row.type == "rootGrid") {
    return false;
  }
  if (props.multiSelectMode) {
    return false;
  }
  emit("item-click", row);
};

// 处理不可用字段点击事件
const handleDialog = (event: any) => {
  emit("dialog", event);
};

// 处理复制事件
const handleCopyClick = (index: number, list: any[]) => {
  emit("copy", index, list);
};

// 处理删除事件
const handleDeleteClick = (index: number, list: any[]) => {
  emit("delete", index, list);
};

// 处理列移动添加事件
const handleColMoveAdd = (
  event: any,
  row: any,
  index: string | number | symbol
) => {
  emit("col-move-add", event, row, index);
};

// 处理标签页移动添加事件
const handleTabsMoveAdd = (
  event: any,
  row: any,
  index: string | number | symbol
) => {
  emit("tabs-move-add", event, row, index);
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
    props.selectedWidgets.has(model)
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
      if (!props.selectedWidgets.has(item.model)) {
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
      if (props.selectedWidgets.has(item.model)) {
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
