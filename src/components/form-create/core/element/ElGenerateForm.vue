<template>
  <div>
    <!-- 查找内容 -->
    <div v-if="search" class="generate-form-search p-[5px]">
      <!-- 查找输入框 -->
      <div class="flex items-center">
        <div class="el-form-item__label">查找：</div>
        <el-input
          v-model="searchValue"
          placeholder="请输入指标名称"
          clearable
          class=""
          @keyup.enter="handleSearch"
          @clear="handleClear"
        >
          <template #append>
            <el-button @click="handleSearch('prev')">搜索</el-button>
          </template>
        </el-input>
        <el-button class="!ml-[10px]" @click="handleSearch('prev')"
          >上一处</el-button
        >
        <el-button @click="handleSearch('next')">下一处</el-button>
      </div>
    </div>
    <div class="fc-style" :style="style">
      <el-form
        ref="generateForm"
        class="generate-form-container"
        label-suffix=":"
        :model="model"
        :rules="resetRules ? {} : rules"
        :size="widgetForm.config.size"
        :label-position="widgetForm.config.labelPosition"
        :label-width="`${widgetForm.config.labelWidth}px`"
        :hide-required-asterisk="widgetForm.config.hideRequiredAsterisk"
      >
        <ElGenerateContainer
          v-for="element of widgetForm.list"
          :key="element.key"
          :element="element"
          :type="type"
          :model="model"
          :config="data.config"
          :widgetForm="widgetForm"
          :multiSelectMode="multiSelectMode"
          :selectedGenerates="selectedGenerates"
          :selectGenerate="generateFormSelect"
          :disabled="disabled"
          :readonly="readonly"
          :variables="variablesList"
          :selectFields="selectFields"
          @item-click="handleItemClick"
          @dialog="openDialog"
          @toggle-selection="handleToggleSelection"
        />
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch, nextTick, onMounted, PropType } from "vue";
import { ElMessage } from "element-plus";
import ElGenerateContainer from "./ElGenerateContainer.vue";
import { element } from "@/components/form-create/config";

const props = defineProps({
  data: {
    type: Object,
    default: element.widgetForm,
  },
  value: {
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
  generateFormSelect: {
    type: Object,
  },
  multiSelectMode: {
    type: Boolean,
    default: false,
  },
  selectedGenerates: {
    type: Set,
    default: () => new Set(),
  },
  type: {
    type: String,
    default: "view",
  },
  resetRules: {
    type: Boolean,
    default: false,
  },
  selectFields: {
    type: Array as PropType<Array<string>>,
    default: () => [],
  },
  search: {
    type: Boolean,
    default: false,
  },
  style: {
    type: Object,
    default: () => {},
  },
  scrollTo: {
    type: Object,
    default: () => {},
  },
});

const emit = defineEmits([
  "update:widgetForm",
  "generateSelect",
  "dialog",
  "toggle-selection",
]);

const searchValue = ref<any>("");
const generateForm = ref<any>(null);
const model = reactive<any>({});
const rules = reactive<any>({});
const widgetForm = reactive<any>(
  (props.data && JSON.parse(JSON.stringify(props.data))) ?? element.widgetForm
);
let variablesList = reactive<any>([]);

const handleItemClick = (row: any) => {
  if (props.multiSelectMode) {
    return;
  }
  if (props.selectFields.length && props.selectFields.includes(row.type)) {
    emit("generateSelect", row);
  } else if (!props.selectFields.length) {
    emit("generateSelect", row);
  }
};

const generateModel = (list: any[]) => {
  for (let index = 0; index < list.length; index++) {
    const modelKey = list[index].model;
    if (list[index].type === "grid") {
      list[index].list.forEach((col: any) => generateModel(col.list));
    } else if (list[index].type === "tabs") {
      list[index].list.forEach((tab: any) => generateModel(tab.list));
    } else if (modelKey) {
      variablesList.push({
        label: list[index].label,
        model: list[index].model,
      });
      if (props.value && Object.keys(props.value).includes(modelKey)) {
        if (list[index].type == "mathComp" && props.type != "fillView") {
          model[modelKey] = list[index].options.defaultValue;
        } else {
          model[modelKey] = props.value[modelKey];
        }
      } else {
        model[modelKey] = list[index].options.defaultValue;
      }

      if (list[index].options.rules) {
        rules[modelKey] = JSON.parse(JSON.stringify(list[index].options.rules));
        if (rules[modelKey].required && rules[modelKey].type == "any") {
          rules[modelKey].type = "";
        }
        if (rules[modelKey].enum) {
          rules[modelKey].enum = eval(rules[modelKey].enum);
        }

        if (rules[modelKey].pattern) {
          rules[modelKey].pattern = eval(rules[modelKey].pattern);
          rules[modelKey].type = "string";
        }
      }
    }
  }
};

const generateOptions = (list: any[]) => {
  list.forEach((item) => {
    if (item.type === "grid") {
      item.list.forEach((col: any) => generateOptions(col.list));
    } else if (item.type === "tabs") {
      item.list.forEach((tab: any) => generateOptions(tab.list));
    } else {
      if (item.options.remote && item.options.remoteFunc) {
        fetch(item.options.remoteFunc)
          .then((resp) => resp.json())
          .then((json) => {
            if (json instanceof Array) {
              item.options.remoteOptions = json.map((data) => ({
                label: data[item.options.props.label],
                value: data[item.options.props.value],
                children: data[item.options.props.children],
              }));
            }
          });
      }
    }
  });
};

const reset = () => {
  nextTick(() => {
    generateForm.value?.resetFields();
  });
};

// 存储当前查找位置
const currentSearchIndex = ref(0);
// 存储所有匹配的元素
const matchedElements = ref<any[]>([]);

// 递归遍历查找匹配元素
const searchElements = (
  list: any[],
  type: "label" | "model",
  searchValue: string
) => {
  const result: any[] = [];

  const traverse = (items: any[], path: string = "", tabPath: any[] = []) => {
    items.forEach((item, index) => {
      // 检查当前元素是否匹配搜索值
      if (
        item[type] &&
        item[type].toLowerCase().includes(searchValue.toLowerCase())
      ) {
        result.push({
          ...item,
          path: `${path}[${index}]`,
          tabPath: [...tabPath], // 存储完整的tab路径
        });
      }

      // 递归处理嵌套元素
      if (item.type === "grid" && item.list) {
        item.list.forEach((col: any, colIndex: number) => {
          if (col.list) {
            traverse(
              col.list,
              `${path}[${index}].list[${colIndex}].list`,
              tabPath
            );
          }
        });
      } else if (item.type === "tabs" && item.list) {
        // 对于tab元素，记录tab信息到路径中
        item.list.forEach((tab: any, tabIndex: number) => {
          if (tab.list) {
            // 构建新的tab路径，包含当前tab信息
            const newTabPath = [
              ...tabPath,
              { tabsElement: item, tabName: tab.name },
            ];
            traverse(
              tab.list,
              `${path}[${index}].list[${tabIndex}].list`,
              newTabPath
            );
          }
        });
      }
    });
  };

  traverse(list);
  return result;
};

// 跳转到指定元素位置
const scrollToElement = (element: any, bool = true) => {
  // 处理多层tab页跳转
  if (element.tabPath && element.tabPath.length > 0) {
    // 从外层到内层依次切换tab
    element.tabPath.forEach((tabInfo: any) => {
      tabInfo.tabsElement.options.defaultValue = tabInfo.tabName;
    });
  }
  nextTick(() => {
    generateForm.value?.scrollToField(element.model);
  });
  // ElMessage.success(`找到匹配项: ${element.label}`);
  bool && emit("generateSelect", element);
};

// 根据id跳转到指定元素位置
const scrollToElementById = (model: string, bool = true) => {
  const element = searchElements(widgetForm.list, "model", model);
  scrollToElement(element[0], bool);
};

const handleClear = () => {
  emit("generateSelect", {});
};

const handleSearch = (type = "next") => {
  if (!searchValue.value) {
    ElMessage.warning("请输入搜索内容");
    return;
  }

  // 重新搜索所有匹配元素
  matchedElements.value = searchElements(
    widgetForm.list,
    "label",
    searchValue.value
  );
  if (matchedElements.value.length === 0) {
    ElMessage.info("未找到匹配项");
    emit("generateSelect", {});
    return;
  }

  // 根据类型更新当前索引
  if (type === "next") {
    currentSearchIndex.value =
      (currentSearchIndex.value + 1) % matchedElements.value.length;
  } else {
    currentSearchIndex.value =
      (currentSearchIndex.value - 1 + matchedElements.value.length) %
      matchedElements.value.length;
  }

  // 跳转到当前匹配元素
  const currentElement = matchedElements.value[currentSearchIndex.value];
  scrollToElement(currentElement);
  // 显示查找结果信息
  // ElMessage.info(
  //   `找到 ${matchedElements.value.length} 个匹配项，当前是第 ${
  //     currentSearchIndex.value + 1
  //   } 个`
  // );
};

watch(
  () => props.data,
  (val) => {
    Object.assign(
      widgetForm,
      (val && JSON.parse(JSON.stringify(val))) ?? element.widgetForm
    );
    Object.keys(model).forEach((key) => delete model[key]);
    Object.keys(rules).forEach((key) => delete rules[key]);
    variablesList = [];
    generateModel(widgetForm?.list ?? []);
    generateOptions(widgetForm?.list ?? []);
    reset();
  },
  { immediate: true }
);

onMounted(() => {
  if (props.scrollTo?.model) {
    scrollToElementById(props.scrollTo.model, false);
  }
  // variablesList = [];
  // generateModel(widgetForm?.list ?? []);
  // generateOptions(widgetForm?.list ?? []);
  // reset();
  // console.log(variablesList, "--variablesList");
});

const getData = () => {
  return new Promise((resolve, reject) => {
    generateForm.value
      .validate()
      .then((validate: boolean) => {
        if (validate) {
          resolve(model);
        } else {
          ElMessage.error("验证失败");
        }
      })
      .catch((error: Error) => {
        reject(error);
      });
  });
};

/** 获取当前表单模型，不触发表单校验 */
const getModel = () => {
  return { ...model };
};

const setData = (data: any) => {
  Object.keys(model).forEach((key) => delete model[key]);
  Object.assign(model, data);
};

const openDialog = (data: any) => {
  // emit("dialog", data);
};

const handleToggleSelection = (row: any) => {
  console.log(row, "--row");
  // 条件合并：要么没限制，要么当前行类型在允许列表中
  const isSelectable =
    !props.selectFields.length || props.selectFields.includes(row.type);
  if (isSelectable) {
    emit("toggle-selection", row);
  }
};

defineExpose({
  getData,
  getModel,
  setData,
  reset,
  handleItemClick,
  openDialog,
  scrollToElementById,
});
</script>
