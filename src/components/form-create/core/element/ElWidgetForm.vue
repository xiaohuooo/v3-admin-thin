<template>
  <div class="widget-form-container">
    <div v-if="!widgetForm.list.length" class="form-empty">
      从左侧拖拽来添加字段
    </div>
    <el-form
      ref="widgetFormRef"
      label-suffix=":"
      :size="widgetForm.config.size"
      :label-position="widgetForm.config.labelPosition"
      :label-width="`${widgetForm.config.labelWidth}px`"
      :hide-required-asterisk="widgetForm.config.hideRequiredAsterisk"
    >
      <Draggable
        class="widget-form-list"
        :class="{ '!min-h-[calc(100vh-167px)]': multiSelectMode }"
        item-key="key"
        ghostClass="ghost"
        handle=".drag-widget"
        :animation="200"
        :group="{ name: 'people' }"
        :list="widgetForm.list"
        @add="handleMoveAdd"
      >
        <template #item="{ element, index }">
          <transition-group name="fade" tag="div">
            <ElWidgetContainer
              v-if="element.key"
              :key="element.key"
              :element="element"
              :config="widgetForm.config"
              :widgetForm="widgetForm"
              :selectWidget="widgetFormSelect"
              :parentList="widgetForm.list"
              :parentIndex="index"
              :multiSelectMode="multiSelectMode"
              :selectedWidgets="selectedWidgets"
              @item-click="handleItemClick"
              @copy="handleCopyClick"
              @delete="handleDeleteClick"
              @col-move-add="handleColMoveAdd"
              @tabs-move-add="handleTabsMoveAdd"
              @dialog="openDialog"
              @toggle-selection="handleToggleSelection"
            />
          </transition-group>
        </template>
      </Draggable>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { nextTick, ref, onMounted } from "vue";
import Draggable from "vuedraggable";
import { uuid } from "@/components/form-create/utils";
import ElWidgetContainer from "./ElWidgetContainer.vue";
import type { WidgetForm } from "@/components/form-create/config/element";
import { cloneDeep } from "@pureadmin/utils";
interface Props {
  widgetForm: WidgetForm;
  widgetFormSelect?: any;
  multiSelectMode?: boolean;
  selectedWidgets?: Set<string>;
}

const props = withDefaults(defineProps<Props>(), {
  multiSelectMode: false,
  selectedWidgets: () => new Set(),
});

const emit = defineEmits<{
  "update:widgetForm": [value: WidgetForm];
  "update:widgetFormSelect": [value: any];
  "toggle-selection": [row: any];
  dialog: [data: any];
}>();

const widgetFormRef = ref<any>(null);

const handleListInsert = (key: string, list: any[], obj: any) => {
  const newList: any[] = [];
  list.forEach((item) => {
    if (item.key === key) {
      newList.push(item);
      newList.push(obj);
    } else {
      if (item.list) {
        item.list = item.list.map((col: any) => ({
          ...col,
          list: handleListInsert(key, col.list, obj),
        }));
      } else if (item.list) {
        item.list = item.list.map((tab: any) => ({
          ...tab,
          list: handleListInsert(key, tab.list, obj),
        }));
      }
      newList.push(item);
    }
  });
  return newList;
};

const handleListDelete = (key: string, list: any[]) => {
  const newList: any[] = [];
  list.forEach((item) => {
    if (item.key !== key) {
      if (item.list) {
        item.list = item.list.map((col: any) => ({
          ...col,
          list: handleListDelete(key, col.list),
        }));
      } else if (item.list) {
        item.list = item.list.map((tab: any) => ({
          ...tab,
          list: handleListDelete(key, tab.list),
        }));
      }
      newList.push(item);
    }
  });
  return newList;
};

// Methods
const handleItemClick = (row: any) => {
  emit("update:widgetFormSelect", row);
};

const handleToggleSelection = (row: any) => {
  emit("toggle-selection", row);
};

const handleCopyClick = (index: number, list: any[]) => {
  const key = uuid().replaceAll("-", "");
  const oldList = JSON.parse(JSON.stringify(props.widgetForm.list));

  let copyData = {
    ...list[index],
    key,
    model: `${list[index].type}_${key}`,
    rules: list[index].rules ?? [],
  };

  if (
    list[index].type === "radio" ||
    list[index].type === "checkbox" ||
    list[index].type === "select"
  ) {
    copyData = {
      ...copyData,
      options: {
        ...copyData.options,
        options: copyData.options.options.map((item: any) => ({ ...item })),
      },
    };
  }

  emit("update:widgetForm", {
    ...props.widgetForm,
    list: handleListInsert(list[index].key, oldList, copyData),
  });

  emit("update:widgetFormSelect", copyData);
};

const handleDeleteClick = (index: number, list: any[]) => {
  const oldList = JSON.parse(JSON.stringify(props.widgetForm.list));

  if (list.length - 1 === index) {
    if (index === 0) {
      nextTick(() => emit("update:widgetFormSelect", null));
    } else {
      emit("update:widgetFormSelect", list[index - 1]);
    }
  } else {
    emit("update:widgetFormSelect", list[index + 1]);
  }

  emit("update:widgetForm", {
    ...props.widgetForm,
    list: handleListDelete(list[index].key, oldList),
  });
};

const handleMoveAdd = (event: any) => {
  const { newIndex } = event;

  const list = JSON.parse(JSON.stringify(props.widgetForm.list));
  const key = list[newIndex].key || uuid().replaceAll("-", "");
  list[newIndex] = {
    ...list[newIndex],
    key,
    model: `${list[newIndex].type}_${key}`,
    rules: [],
  };

  if (
    list[newIndex].type === "radio" ||
    list[newIndex].type === "checkbox" ||
    list[newIndex].type === "select"
  ) {
    list[newIndex] = {
      ...list[newIndex],
      options: {
        ...list[newIndex].options,
        options: list[newIndex].options.options.map((item: any) => ({
          ...item,
        })),
      },
    };
  }

  if (list[newIndex].type === "grid") {
    list[newIndex] = {
      ...list[newIndex],
      list: list[newIndex].list.map((item: any) => ({ ...item })),
    };
  } else if (list[newIndex].type === "tabs") {
    list[newIndex] = {
      ...list[newIndex],
      list: list[newIndex].list.map((item: any) => ({
        ...item,
      })),
    };
  }
  emit("update:widgetForm", { ...props.widgetForm, list });
  if (!props.multiSelectMode) {
    emit("update:widgetFormSelect", list[newIndex]);
  }
};

const handleColMoveAdd = (
  event: any,
  row: any,
  index: string | number | symbol
) => {
  const { newIndex, oldIndex, item } = event;
  const list = JSON.parse(JSON.stringify(props.widgetForm.list));

  if (item.className.includes("data-grid")) {
    item.tagName === "DIV" &&
      list.splice(oldIndex, 0, row.list[index].list[newIndex]);
    row.list[index].list.splice(newIndex, 1);
    return false;
  }

  const key = row.list[index].list[newIndex].key || uuid().replaceAll("-", "");

  row.list[index].list[newIndex] = {
    ...cloneDeep(row.list[index].list[newIndex]),
    key,
    model: `${row.list[index].list[newIndex].type}_${key}`,
    rules: [],
  };

  if (
    row.list[index].list[newIndex].type === "radio" ||
    row.list[index].list[newIndex].type === "checkbox" ||
    row.list[index].list[newIndex].type === "select"
  ) {
    row.list[index].list[newIndex] = {
      ...row.list[index].list[newIndex],
      options: {
        ...row.list[index].list[newIndex].options,
        options: row.list[index].list[newIndex].options.options.map(
          (item: any) => ({ ...item })
        ),
      },
    };
  }
  if (!props.multiSelectMode) {
    emit("update:widgetFormSelect", row.list[index].list[newIndex]);
  }
};

const handleTabsMoveAdd = (
  event: any,
  row: any,
  index: string | number | symbol
) => {
  const { newIndex } = event;

  const key = row.list[index].list[newIndex].key || uuid().replaceAll("-", "");

  row.list[index].list[newIndex] = {
    ...cloneDeep(row.list[index].list[newIndex]),
    key,
    model: `${row.list[index].list[newIndex].type}_${key}`,
    rules: [],
  };

  if (
    row.list[index].list[newIndex].type === "radio" ||
    row.list[index].list[newIndex].type === "checkbox" ||
    row.list[index].list[newIndex].type === "select"
  ) {
    row.list[index].list[newIndex] = {
      ...row.list[index].list[newIndex],
      options: {
        ...row.list[index].list[newIndex].options,
        options: row.list[index].list[newIndex].options.options.map(
          (item: any) => ({ ...item })
        ),
      },
    };
  }
  if (!props.multiSelectMode) {
    emit("update:widgetFormSelect", row.list[index].list[newIndex]);
  }
};
// 根据id跳转到指定元素位置
const scrollToField = (element: any) => {
  console.log(element.model, "--model");
  widgetFormRef.value?.scrollToField(element.model);
};

const openDialog = (data: any) => {
  emit("dialog", data);
};

defineExpose({
  scrollToField,
});
</script>