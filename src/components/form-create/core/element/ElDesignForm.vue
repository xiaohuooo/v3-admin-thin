<template>
  <div class="fc-style">
    <el-container class="fc-container">
      <el-main class="fc-main">
        <el-container>
          <el-aside width="250px">
            <div class="components">
              <ComponentGroup
                title="基础组件"
                :fields="basicFields"
                :list="element.basicComponents"
                @componentClick="handleComponentClick"
              />
              <ComponentGroup
                title="高级组件"
                :fields="advanceFields"
                :list="element.advanceComponents"
                @componentClick="handleComponentClick"
              />
              <ComponentGroup
                title="布局组件"
                :fields="layoutFields"
                :list="element.layoutComponents"
                @componentClick="handleComponentClick"
              />
            </div>
          </el-aside>
          <el-main class="center-container">
            <ElCustomHeader
              v-bind="$props"
              :multiSelectMode="multiSelectMode"
              @preview="handlePreview"
              @uploadJson="() => (uploadJsonVisible = true)"
              @generateJson="handleGenerateJson"
              @generateCode="handleGenerateCode"
              @clearable="handleClearable"
              @copyable="handleCopyable"
            >
              <slot name="header" />
            </ElCustomHeader>
            <el-main
              :class="{
                'widget-empty': widgetForm.list,
                '!h-[calc(100%-97px)]': multiSelectMode,
              }"
            >
              <ElWidgetForm
                ref="widgetFormRef"
                v-model:widgetForm="widgetForm"
                v-model:widgetFormSelect="widgetFormSelect"
                :multiSelectMode="multiSelectMode"
                :selectedWidgets="selectedWidgets"
                @toggle-selection="toggleWidgetSelection"
                @dialog="openDialog"
              />
            </el-main>
            <div
              v-if="multiSelectMode"
              class="my-[10px] flex justify-end mr-[10px]"
            >
              <el-button
                @click="handleCopyable"
                style="margin-left: 10px"
                class="result-btn"
              >
                取消
              </el-button>
              <el-button
                type="primary"
                @click="handleBatchCopy"
                style="margin-left: 10px"
                class="result-btn"
              >
                复制
              </el-button>
              <el-button
                @click="handleBatchPublish"
                style="margin-left: 10px"
                class="result-btn"
              >
                发布
              </el-button>
            </div>
          </el-main>
          <el-aside class="widget-config-container" width="300px">
            <el-container>
              <el-header>
                <div
                  class="config-tab"
                  :class="{ active: configTab === 'widget' }"
                  @click="configTab = 'widget'"
                >
                  字段属性
                </div>
                <div
                  class="config-tab"
                  :class="{ active: configTab === 'form' }"
                  @click="configTab = 'form'"
                >
                  表单属性
                </div>
              </el-header>
              <el-main class="config-content">
                <ElWidgetConfig
                  v-show="configTab === 'widget'"
                  v-model:select="widgetFormSelect"
                  @dialog="openDialog"
                  @selectDialog="selectDialog"
                  @businessDialog="businessSelectDialog"
                />
                <ElFormConfig
                  v-show="configTab === 'form'"
                  v-model:config="widgetForm.config"
                />
              </el-main>
            </el-container>
          </el-aside>
        </el-container>
      </el-main>

      <el-dialog v-model="uploadJsonVisible" title="导入JSON" :width="800">
        <el-alert
          type="info"
          title="JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可"
          style="margin-bottom: 10px"
        />
        <CodeEditor v-model:value="jsonEg" language="json" />
        <template #footer>
          <el-button @click="() => (uploadJsonVisible = false)">取消</el-button>
          <el-button type="primary" @click="handleUploadJson">导入</el-button>
        </template>
      </el-dialog>

      <el-dialog v-model="previewVisible" title="预览" :width="800">
        <div class="h-[500px] overflow-y-auto">
          <ElGenerateForm
            v-if="previewVisible"
            ref="generateFormRef"
            :data="widgetForm"
            :resetRules="true"
            @dialog="openDialog"
          />
        </div>

        <template #footer>
          <el-button @click="handleTarget('ModelMind')">导图</el-button>
          <el-button @click="handleTarget('modelGraph')">图谱</el-button>
          <el-button type="primary" @click="previewVisible = false"
            >关闭</el-button
          >
          <!-- <el-button  @click="handleReset">重置</el-button> -->
          <!-- <el-button type="primary" @click="handleGetData">获取数据</el-button> -->
        </template>

        <el-dialog v-model="dataJsonVisible" title="获取数据" :width="800">
          <CodeEditor :value="dataJsonTemplate" language="json" readonly />

          <template #footer>
            <el-button @click="() => (dataJsonVisible = false)">取消</el-button>
            <el-button type="primary" @click="handleCopyClick(dataJsonTemplate)"
              >Copy</el-button
            >
          </template>
        </el-dialog>
      </el-dialog>

      <el-dialog v-model="generateJsonVisible" title="生成JSON" :width="800">
        <CodeEditor :value="generateJsonTemplate" language="json" readonly />

        <template #footer>
          <el-button @click="() => (generateJsonVisible = false)"
            >取消</el-button
          >
          <el-button
            type="primary"
            @click="handleCopyClick(generateJsonTemplate)"
            >Copy</el-button
          >
        </template>
      </el-dialog>

      <el-dialog v-model="dataCodeVisible" title="生产代码" :width="800">
        <el-tabs
          v-model="codeLanguage"
          type="card"
          :tabBarStyle="{ margin: 0 }"
        >
          <el-tab-pane label="Vue Component" :name="codeType.Vue">
            <CodeEditor :value="dataCodeTemplate" language="html" readonly />
          </el-tab-pane>
          <el-tab-pane label="HTML" :name="codeType.Html">
            <CodeEditor :value="dataCodeTemplate" language="html" readonly />
          </el-tab-pane>
        </el-tabs>

        <template #footer>
          <el-button @click="() => (dataCodeVisible = false)">取消</el-button>
          <el-button type="primary" @click="handleCopyClick(dataCodeTemplate)"
            >Copy</el-button
          >
        </template>
      </el-dialog>

      <!-- 发布弹窗 -->
      <PublistModel
        v-model:visible="publishVisible"
        :selectedWidgets="selectedWidgets"
        :selectedWidgetForm="selectedWidgetForm"
        :widgetForm="widgetForm"
        @confirm="handlePublishConfirm"
      />
    </el-container>
  </div>
</template>

<script setup lang="ts">
import {
  reactive,
  PropType,
  toRefs,
  watchEffect,
  ref,
  watch,
  nextTick,
} from "vue";
import { ElMessage } from "element-plus";
import { defaultsDeep } from "lodash";
import CodeEditor from "@/components/form-create/components/CodeEditor.vue";
import ComponentGroup from "@/components/form-create/components/ComponentGroup.vue";
import ElCustomHeader from "./ElCustomHeader.vue";
import ElWidgetForm from "./ElWidgetForm.vue";
import ElGenerateForm from "./ElGenerateForm.vue";
import ElWidgetConfig from "./ElWidgetConfig.vue";
import ElFormConfig from "./ElFormConfig.vue";
import { element } from "@/components/form-create/config";
import { copy,uuid } from "@/components/form-create/utils";
import {
  CodeType,
  PlatformType,
  PreviewType,
} from "@/components/form-create/enums";
import generateCodeUtil from "@/components/form-create/utils/generateCode";
import { WidgetForm } from "@/components/form-create/config/element";
import { useModelConfig } from "@/components/form-create/components/formulaEditor/hook";
import { useElementConfig } from "./hook";
import { VARIABLE_REG } from "@/components/form-create/components/formulaEditor/utils/formula";
import { cloneDeep } from "@pureadmin/utils";
import PublistModel from "./PublistModel.vue";

const props = defineProps({
  preview: {
    type: Boolean,
    default: true,
  },
  generateCode: {
    type: Boolean,
    default: true,
  },
  generateJson: {
    type: Boolean,
    default: true,
  },
  uploadJson: {
    type: Boolean,
    default: true,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  copyable: {
    type: Boolean,
    default: true,
  },
  basicFields: {
    type: Array as PropType<Array<string>>,
    default: () => ["input", "digit", "textarea", "date", "select", "divider"],
  },
  advanceFields: {
    type: Array as PropType<Array<string>>,
    default: () => [
      "tabs",
      "mathComp",
      "tableTimeline",
      "drawdown",
      "businessComp",
    ],
  },
  layoutFields: {
    type: Array as PropType<Array<string>>,
    default: () => ["grid"],
  },
});

const { handleView } = useModelConfig();
const { handleSelectView, businessSelectView } = useElementConfig();

const generateFormRef = ref<any>(null);
const widgetFormRef = ref<any>(null);
const selectedWidgetForm = ref();

const state = reactive({
  codeType: CodeType,
  widgetForm: JSON.parse(JSON.stringify(element.widgetForm)),
  widgetFormSelect: undefined,
  generateFormSelect: undefined,
  configTab: "widget",
  previewVisible: false,
  uploadJsonVisible: false,
  dataJsonVisible: false,
  dataCodeVisible: false,
  generateJsonVisible: false,
  generateCodeVisible: false,
  generateJsonTemplate: JSON.stringify(element.widgetForm, null, 2),
  dataJsonTemplate: "",
  dataCodeTemplate: "",
  codeLanguage: CodeType.Vue,
  jsonEg: JSON.stringify(element.widgetForm, null, 2),
  multiSelectMode: false,
  selectedWidgets: new Set<string>(),
  publishVisible: false,
});

const emit = defineEmits(["target"]);

// 根据表单属性的列数处理表单根list数据
const transformListByColumns = (columns: number, currentList: any[]) => {
  // 提取所有数据项
  const extractItems = (list: any[]): any[] => {
    let items: any[] = [];
    list.forEach((item) => {
      if (item.type === "rootGrid") {
        // 按list的顺序排列
        const cols = item.list.filter((col) => col.list);
        if (cols.length > 0) {
          let maxLength = Math.max(...cols.map((col) => col.list.length));
          for (let i = 0; i < maxLength; i++) {
            cols.forEach((col) => {
              if (col.list && col.list[i]) {
                items.push(col.list[i]);
              }
            });
          }
        }
      } else {
        items.push(item);
      }
    });
    return items;
  };

  const allItems = extractItems(currentList);

  if (columns === 1) {
    return allItems;
  } else if (columns === 2) {
    const span = 24 / columns;
    const gridList = [];

    for (let i = 0; i < columns; i++) {
      gridList.push({
        span,
        list: [],
      });
    }

    allItems.forEach((item, index) => {
      const colIndex = index % columns;
      gridList[colIndex]?.list.push(item);
    });
    const key = uuid().replaceAll("-", "");
    return [
      {
        label: "root",
        type: "rootGrid",
        list: gridList,
        options: { showModel: true },
        key: key,
        model: `root_${key}`,
        rules: [],
      },
    ];
  } else {
    return allItems;
  }
};

// 监听表单列数变化
watch(
  () => state.widgetForm.config.cols,
  (newColumns, oldColumns) => {
    if (newColumns !== oldColumns) {
      const transformedList = transformListByColumns(
        newColumns,
        state.widgetForm.list
      );
      state.widgetForm.list = transformedList;
    }
  },
  { immediate: true }
);

// 监听组件标签变化，同步更新 mathData 中对应的 label 和 text
watch(
  () => state.widgetFormSelect,
  (newSelect, oldSelect) => {
    if (newSelect == oldSelect && state.widgetFormSelect?.model) {
      const updateMathDataLabel = (list: any[]) => {
        list.forEach((component) => {
          if (
            component.type === "mathComp" &&
            component.options?.mathData?.[0]
          ) {
            const mathData = component.options.mathData[0];
            // 更新 marks 中的 label
            if (mathData.textModel.includes(state.widgetFormSelect.model)) {
              mathData.marks.forEach((mark) => {
                if (mark.model === state.widgetFormSelect.model) {
                  if (mark.label !== state.widgetFormSelect.label) {
                    mathData.text = mathData.text.replace(
                      mark.label,
                      newSelect.label
                    );
                    mark.label = newSelect.label;
                  }
                }
              });
            }
          }
          if (component.list) {
            updateMathDataLabel(component.list);
          }
        });
      };
      updateMathDataLabel(state.widgetForm.list);
    }
  },
  { deep: true }
);

const handleUploadJson = () => {
  try {
    state.widgetForm.list = [];
    defaultsDeep(state.widgetForm, JSON.parse(state.jsonEg));

    if (state.widgetForm.list) {
      if (state.widgetForm.list[0].type == "rootGrid") {
        if (state.widgetForm.list[0].list[0].list.length) {
          state.widgetFormSelect = state.widgetForm.list[0].list[0].list[0];
        } else {
          state.widgetFormSelect = undefined;
        }
      } else {
        state.widgetFormSelect = state.widgetForm.list[0];
      }
    }

    state.uploadJsonVisible = false;
    ElMessage.success("上传成功");
  } catch (error) {
    ElMessage.error("上传失败");
  }
};

const handleCopyClick = (text: string) => {
  copy(text);
  ElMessage.success("Copy成功");
};

const handleGetData = () => {
  console.log(state.widgetForm);
  generateFormRef.value?.getData().then((res: any) => {
    state.dataJsonTemplate = JSON.stringify(res, null, 2);
    state.dataJsonVisible = true;
  });
};

const handleGenerateJson = () =>
  (state.generateJsonTemplate = JSON.stringify(state.widgetForm, null, 2)) &&
  (state.generateJsonVisible = true);

const handleGenerateCode = () => {
  state.codeLanguage = CodeType.Vue;
  state.dataCodeVisible = true;
};

watchEffect(() => {
  if (state.dataCodeVisible) {
    state.dataCodeTemplate = generateCodeUtil(
      state.widgetForm,
      state.codeLanguage,
      PlatformType.Element
    )!;
  }
});

// 递归查找所有组件
const findAllComponents = (list, variablesSet) => {
  let components = [];
  list.forEach((item) => {
    if (item.list) {
      components = [
        ...components,
        ...findAllComponents(item.list, variablesSet),
      ];
    } else {
      components.push(item);
      if (item.type === "mathComp") {
        item.options.mathData[0].marks.forEach((item) => {
          variablesSet.add(item.model);
        });
      }
    }
  });
  return components;
};

// 为依赖组件添加依赖必填校验，并移除不再被依赖组件的依赖必填校验
const addDependencyValidation = (newMathData, oldMathData) => {
  // 所有计算公司组件依赖的变量
  const variablesSet = new Set();
  const allComponents = findAllComponents(state.widgetForm.list, variablesSet);
  console.log(variablesSet, "--variablesSet");

  // 从新的mathData中提取所有依赖的变量
  const newVariables = new Set();
  newMathData.forEach((formulaComp) => {
    const formula = formulaComp.textModel;
    if (!formula) return;

    // 提取公式中的变量
    let match;
    while ((match = VARIABLE_REG.exec(formula)) !== null) {
      newVariables.add(match[1]);
    }

    // 为依赖的组件添加依赖必填校验属性
    newVariables.forEach((varName) => {
      const depComponent = allComponents.find((comp) => comp.model === varName);
      if (depComponent) {
        if (!depComponent.options) {
          depComponent.options = {};
        }
        if (!depComponent.options.rules) {
          depComponent.options.rules = {};
        }
        // 检查是否已存在依赖必填校验
        const hasDependencyRule =
          // depRequired
          depComponent.options.rules.required === true;
        if (!hasDependencyRule) {
          // depRequired
          depComponent.options.rules.required = true;
        }
      }
    });
  });

  // 从旧的mathData中提取所有依赖的变量
  const oldVariables = new Set();
  if (oldMathData) {
    oldMathData.forEach((formulaComp) => {
      const formula = formulaComp.textModel;
      if (!formula) return;

      // 提取公式中的变量
      let match;
      while ((match = VARIABLE_REG.exec(formula)) !== null) {
        oldVariables.add(match[1]);
      }
    });
  }
  // 找出不再被依赖的变量
  const removedVariables = [];
  oldVariables.forEach((varName) => {
    if (!newVariables.has(varName) && !variablesSet.has(varName)) {
      removedVariables.push(varName);
    }
  });

  // 为不再被依赖的组件移除依赖必填校验属性
  removedVariables.forEach((varName) => {
    const depComponent = allComponents.find((comp) => comp.model === varName);
    if (depComponent && depComponent.options && depComponent.options.rules) {
      // 移除依赖必填校验
      // depRequired
      depComponent.options.rules.required = false;
    }
  });
};

const openDialog = (element) => {
  const callBack = (data) => {
    let oldMathData = JSON.parse(
      JSON.stringify(state.widgetFormSelect.options.mathData)
    );
    state.widgetFormSelect.options.mathData = data;
    state.widgetFormSelect.options.defaultValue =
      data[0].textModel || "公式设置";

    // 为依赖组件添加依赖必填校验
    addDependencyValidation(data, oldMathData);
  };
  console.log(state.widgetFormSelect, "-state.widgetFormSelect.options");

  handleView({
    title: "公式设置",
    tip: "使用数学运算符编辑公式",
    widgetForm: state.widgetForm,
    widgetFormSelect: element ? element : state.widgetFormSelect,
    callBack,
  });
};
const selectDialog = (element) => {
  const callBack = (data) => {
    if (element.type == "start") {
      state.widgetFormSelect.options[element.params][0] = {
        label: data.label,
        type: data.type,
        model: data.model,
      };
    } else {
      state.widgetFormSelect.options[element.params][1] = {
        label: data.label,
        type: data.type,
        model: data.model,
      };
    }
    console.log(data, "-state.widgetFormSelect.options");
  };
  handleSelectView({
    title: "设置时间指标",
    widgetForm: state.widgetForm,
    widgetFormSelect: state.widgetFormSelect,
    callBack,
  });
};
const businessSelectDialog = () => {
  // 递归获取所有id
  const getAllIds = (list) => {
    let ids = [];
    list.forEach((item) => {
      if (item.list) {
        ids = [...ids, ...getAllIds(item.list)];
      } else {
        ids.push(item.model);
      }
    });
    return ids;
  };

  const callBack = (data) => {
    let modelConfig = JSON.parse(data.modelConfig);
    state.widgetForm.variables = modelConfig.variables;
    if (modelConfig.list[0].type == "rootGrid") {
      modelConfig.list[0].type = "grid";
    }
    // 找到 state.widgetFormSelect 在 state.widgetForm.list 的位置，替换成 filteredComponents
    const replaceComponent = (
      list: any[],
      targetModel: string,
      replacements: any[]
    ): boolean => {
      for (let i = 0; i < list.length; i++) {
        if (list[i].model === targetModel) {
          list.splice(i, 1, ...replacements);
          return true;
        }
        if (
          list[i].list &&
          replaceComponent(list[i].list, targetModel, replacements)
        ) {
          return true;
        }
      }
      return false;
    };
    // 暂时的逻辑，后续再优化
    // if (modelConfig.keepOriginalId) {
    //   if (state.widgetFormSelect && state.widgetFormSelect.model) {
    //     replaceComponent(
    //       state.widgetForm.list,
    //       state.widgetFormSelect.model,
    //       modelConfig.list
    //     );
    //   } else {
    //     // 如果没有选中组件，直接添加到列表末尾
    //     if (state.widgetForm.list[0]?.type === "rootGrid") {
    //       // 多列模式，添加到第一列
    //       state.widgetForm.list[0].list[0].list.push(...modelConfig.list);
    //     } else {
    //       // 单列模式，直接添加
    //       state.widgetForm.list.push(...modelConfig.list);
    //     }
    //     state.widgetFormSelect = modelConfig.list[0];
    //   }
    //   return;
    // }
    // -------------------------------------
    const selectedKeys = getAllIds(modelConfig.list);
    let keyMap = new Map();
    // 过滤并复制选中的组件，保持树形结构
    const filteredComponents = filterAndCopyComponents(
      modelConfig.list,
      selectedKeys,
      keyMap
    );
    // 处理计算公式
    processMathComponents(keyMap);
    // 将过滤后的组件添加到表单中
    if (filteredComponents.length > 0) {
      if (state.widgetFormSelect && state.widgetFormSelect.model) {
        replaceComponent(
          state.widgetForm.list,
          state.widgetFormSelect.model,
          filteredComponents
        );
        // 更新选中状态为新插入的第一个组件
        state.widgetFormSelect = filteredComponents[0];
      } else {
        // 如果没有选中组件，直接添加到列表末尾
        if (state.widgetForm.list[0]?.type === "rootGrid") {
          // 多列模式，添加到第一列
          state.widgetForm.list[0].list[0].list.push(...filteredComponents);
        } else {
          // 单列模式，直接添加
          state.widgetForm.list.push(...filteredComponents);
        }
        state.widgetFormSelect = filteredComponents[0];
      }
    }
  };
  businessSelectView({
    callBack,
  });
};
const handleClearable = () => {
  const columns = state.widgetForm.config.cols;
  if (state.widgetForm.config.cols === 1) {
    state.widgetForm.list = [];
  } else {
    const span = 24 / columns;
    const gridList = [];

    for (let i = 0; i < columns; i++) {
      gridList.push({
        span,
        list: [],
      });
    }
    const key = uuid().replaceAll("-", "");
    state.widgetForm.list = [
      {
        label: "root",
        type: "rootGrid",
        list: gridList,
        options: { showModel: true },
        key: key,
        model: `root_${key}`,
        rules: [],
      },
    ];
  }
  defaultsDeep(
    state.widgetForm,
    JSON.parse(JSON.stringify(element.widgetForm))
  );
  state.widgetFormSelect = undefined;
};

// 批量复制开关
const handleCopyable = () => {
  state.widgetFormSelect = undefined;
  state.multiSelectMode = !state.multiSelectMode;
  if (!state.multiSelectMode) {
    state.selectedWidgets.clear();
  }
};

// 递归复制函数
const filterAndCopyComponents = (list, selectedKeys, keyMap) => {
  let result = [];

  list.forEach((item) => {
    if (item.list) {
      // 如果是容器组件，递归过滤其子组件
      const filteredChildren = filterAndCopyComponents(
        item.list,
        selectedKeys,
        keyMap
      );
      if (filteredChildren.length > 0) {
        // 如果有选中的子组件，复制容器组件并保留过滤后的子组件
        const copiedContainer = cloneDeep(item);
        if (item.key) {
          const newKey = uuid().replaceAll("-", "");
          copiedContainer.key = newKey;
          copiedContainer.model = `${copiedContainer.type}_${newKey}`;
          keyMap.set(item.model, copiedContainer);
        }
        copiedContainer.list = filteredChildren;
        if (copiedContainer.type == "tabs") {
          console.log(filteredChildren[0].name);
          copiedContainer.options.defaultValue = filteredChildren[0].name;
        }
        result.push(copiedContainer);
      }
    } else if (selectedKeys.includes(item.model)) {
      // 如果是选中的普通组件，复制它
      const copiedComponent = cloneDeep(item);
      // 生成新的唯一id
      const newKey = uuid().replaceAll("-", "");
      copiedComponent.key = newKey;
      copiedComponent.model = `${copiedComponent.type}_${newKey}`;
      keyMap.set(item.model, copiedComponent);
      result.push(copiedComponent);
    }
  });

  return result;
};

// 处理计算公式函数
const processMathComponents = (keyMap) => {
  keyMap.forEach((component, key) => {
    if (component.type == "mathComp") {
      let bool = false;
      component.options.mathData[0].marks.forEach((item) => {
        let test = keyMap.get(item.model);
        if (test) {
          bool = true;
          item.model = test.model;
        }
      });
      if (!bool) {
        return;
      }
      let textModel = component.options.defaultValue.replace(
        VARIABLE_REG,
        (match, p1) => {
          let item = keyMap.get(p1);
          return "${" + (item?.model || p1) + "}";
        }
      );
      component.options.defaultValue = textModel;
      component.options.mathData[0].textModel = textModel;
    }
  });
};

const handleBatchCopy = () => {
  if (state.selectedWidgets.size === 0) {
    ElMessage.warning("请先选择要复制的组件");
    return;
  }

  const selectedKeys = Array.from(state.selectedWidgets);
  let keyMap = new Map();
  // 过滤并复制选中的组件，保持树形结构
  const filteredComponents = filterAndCopyComponents(
    state.widgetForm.list,
    selectedKeys,
    keyMap
  );
  // 处理计算公式
  processMathComponents(keyMap);
  // 将过滤后的组件添加到表单中
  if (filteredComponents.length > 0) {
    if (state.widgetForm.config.cols === 1) {
      // 单列布局，直接添加到根列表
      state.widgetForm.list.push(...filteredComponents);
    } else {
      // 多列布局，添加到第一个 rootGrid 的第一个列的列表中
      if (
        state.widgetForm.list.length === 0 ||
        state.widgetForm.list[0].type !== "rootGrid"
      ) {
        const key = uuid().replaceAll("-", "");
        // 如果没有 rootGrid，创建一个
        const rootGrid = {
          label: "root",
          type: "rootGrid",
          list: [],
          options: { showModel: true },
          key: key,
          model: `root_${key}`,
          rules: [],
        };

        // 根据列数创建列
        const span = 24 / state.widgetForm.config.cols;
        for (let i = 0; i < state.widgetForm.config.cols; i++) {
          rootGrid.list.push({
            span,
            list: [],
          });
        }

        state.widgetForm.list.push(rootGrid);
      }

      // 添加到第一个列的列表中
      filteredComponents.forEach((component) => {
        state.widgetForm.list[0].list[0].list.push(component);
      });
    }
  }

  state.selectedWidgets.clear();
  state.multiSelectMode = false;
  ElMessage.success(`成功复制 ${selectedKeys.length} 个组件`);
};

// 批量发布弹窗
const handleBatchPublish = () => {
  if (state.selectedWidgets.size === 0) {
    ElMessage.warning("请先选择要复制的组件");
    return;
  }
  state.publishVisible = true;
  const defaultProps = {
    children: "list",
    filterKey: "model",
  };
  function flatTree(
    arr,
    defaultProps = {
      children: "children",
      filterKey: "functionName",
    }
  ) {
    const res = [];
    // 过滤掉没有handler的
    function deep(arr) {
      arr.forEach((item) => {
        if (item[defaultProps["filterKey"]]) {
          res.push({
            label: item.label,
            model: item[defaultProps["filterKey"]],
          });
        }
        item[defaultProps["children"]] && deep(item[defaultProps["children"]]);
      });
    }
    deep(arr);
    return res;
  }
  const selectedKeys = Array.from(state.selectedWidgets);
  let keyMap = new Map();
  // 过滤并复制选中的组件，保持树形结构
  const filteredComponents = filterAndCopyComponents(
    state.widgetForm.list,
    selectedKeys,
    keyMap
  );
  console.log(keyMap, "keyMap");
  // 处理计算公式
  processMathComponents(keyMap);
  selectedWidgetForm.value = {
    list: filteredComponents,
    config: { ...state.widgetForm.config },
    variables: flatTree(state.widgetForm?.list || [], defaultProps),
  };
  console.log(selectedWidgetForm.value, "----货币资金");
};

// 处理发布确认回调
const handlePublishConfirm = () => {
  state.selectedWidgets.clear();
  state.multiSelectMode = false;
};

const toggleWidgetSelection = (row: any) => {
  if (state.selectedWidgets.has(row.model)) {
    state.selectedWidgets.delete(row.model);
  } else {
    state.selectedWidgets.add(row.model);
  }
};

const handleReset = () => generateFormRef.value?.reset();

const handleTarget = (name: string) => {
  emit("target", name);
};

const handleComponentClick = (element) => {
  const key = uuid().replaceAll("-", "");
  const newComponent = {
    ...cloneDeep(element),
    key,
    model: `${element.type}_${key}`,
    rules: [],
  };

  if (
    element.type === "radio" ||
    element.type === "checkbox" ||
    element.type === "select"
  ) {
    newComponent.options = {
      ...newComponent.options,
      options: newComponent.options.options.map((item: any) => ({ ...item })),
    };
  }

  if (element.type === "grid") {
    newComponent.list = newComponent.list.map((item: any) => ({ ...item }));
  } else if (element.type === "tabs") {
    newComponent.list = newComponent.list.map((item: any) => ({
      ...item,
      list: [],
    }));
  }

  // 根据当前表单列数，将组件添加到适当的位置
  if (state.widgetForm.config.cols === 1) {
    // 单列布局，直接添加到根列表
    state.widgetForm.list.push(newComponent);
  } else {
    // 多列布局，添加到第一个 rootGrid 的第一个列的列表中
    if (
      state.widgetForm.list.length === 0 ||
      state.widgetForm.list[0].type !== "rootGrid"
    ) {
      const key = uuid().replaceAll("-", "");
      // 如果没有 rootGrid，创建一个
      const rootGrid = {
        label: "root",
        type: "rootGrid",
        list: [],
        options: { showModel: true },
        key: key,
        model: `root_${key}`,
        rules: [],
      };

      // 根据列数创建列
      const span = 24 / state.widgetForm.config.cols;
      for (let i = 0; i < state.widgetForm.config.cols; i++) {
        rootGrid.list.push({
          span,
          list: [],
        });
      }

      state.widgetForm.list.push(rootGrid);
    }

    // 添加到第一个列的列表中
    state.widgetForm.list[0].list[0].list.push(newComponent);
  }

  // 更新选中的组件
  state.widgetFormSelect = newComponent;
};

const getJson = () => state.widgetForm;

const setJson = (json: WidgetForm) => {
  state.widgetForm.list = [];
  state.widgetForm.config = {};
  defaultsDeep(state.widgetForm, json);
  if (json.list?.length) {
    if (json.list[0].type == "rootGrid") {
      if (json.list[0]?.list?.[0]?.list?.length) {
        state.widgetFormSelect = json.list[0].list[0].list[0];
      } else {
        state.widgetFormSelect = undefined;
      }
    } else {
      state.widgetFormSelect = json.list[0];
    }
  }
};

const handlePreview = () => {
  previewVisible.value = true;
};

const getTemplate = (codeType: CodeType) =>
  generateCodeUtil(state.widgetForm, codeType, PlatformType.Element);

const clear = () => handleClearable();

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
const scrollToElementById = async (model: string) => {
  try {
    const elements = searchElements(state.widgetForm.list, "model", model);
    const targetElement = elements[0];
    if (!targetElement) {
      return;
    }
    // 处理多层tab页跳转，从外层到内层依次切换
    if (targetElement.tabPath?.length) {
      for (const tabInfo of targetElement.tabPath) {
        tabInfo.tabsElement.options.defaultValue = "";
        await nextTick(); // 等待视图更新后再切换下一个tab
        tabInfo.tabsElement.options.defaultValue = tabInfo.tabName;
      }
    }
    state.widgetFormSelect = targetElement;
    await nextTick();
    widgetFormRef.value?.scrollToField(targetElement);
  } catch (err) {
    console.error(err);
  }
};

// 暴露给外部使用的方法
defineExpose({
  getJson,
  setJson,
  getTemplate,
  clear,
  scrollToElementById,
});

// 解构响应式状态，使其在模板中可用
const {
  codeType,
  widgetForm,
  widgetFormSelect,
  generateFormSelect,
  configTab,
  previewVisible,
  uploadJsonVisible,
  dataJsonVisible,
  dataCodeVisible,
  generateJsonVisible,
  generateCodeVisible,
  publishVisible,
  generateJsonTemplate,
  dataJsonTemplate,
  dataCodeTemplate,
  codeLanguage,
  jsonEg,
  multiSelectMode,
  selectedWidgets,
} = toRefs(state);
</script>
