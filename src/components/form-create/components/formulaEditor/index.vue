<template>
  <div class="formula">
    <div class="formula-editor">
      <div class="formula-editor-title" v-if="title">{{ title }} =</div>
      <div
        class="formula-editor-container"
        :class="{ hasTitle: title }"
        :key="`${refreshKey}_${refreshNum}`"
      >
        <FormulaCodeMirror
          v-model="codeValue"
          :is-dark="isDark"
          :disabled="disabled"
          :height="height"
          :placeholder="placeholder"
          :variables="variables"
          :math-list="flatMathList"
          :old-variables="oldVariables"
          ref="codeMirrorRef"
        />
        <div class="formula-info-error" :data-error="`${validInfo != ''}`">
          <div class="info" v-if="validInfo">公式错误：{{ validInfo }}</div>
        </div>
      </div>
    </div>
    <div class="formula-params">
      <!--变量 variables -->
      <!-- <slot name="variable" :insert="insertVariables">
        <ul class="formula-params-variable formula-params-list">
          <li
            class="variable-item formula-params-item"
            v-for="item in variables"
            :key="item.model"
            @click="insertVariables(item.model)"
          >
            <span class="variable-item-label">{{ item.label }}</span>
            <span class="variable-item-desc" v-if="item.desc">{{
              item.desc
            }}</span>
          </li>
        </ul>
      </slot> -->
      <!--keywords variables -->
      <slot name="value" :insert="insertValue">
        <calculator
          class="formula-params-value"
          @calculatorClick="insertValue"
        ></calculator>
      </slot>
      <!--数学方法 maths-->
      <slot name="maths" :insert="insertMaths">
        <div class="formula-params-maths-container">
          <el-input
            v-model="searchTreeVariable"
            placeholder="搜索函数"
            clearable
          >
            <template #suffix>
              <el-icon class="el-input__icon">
                <IconifyIconOffline
                  v-show="searchTreeVariable.length === 0"
                  icon="ri/search-line"
                />
              </el-icon>
            </template>
          </el-input>
          <div class="formula-params-maths">
            <FormulaList
              :nodes="mathList"
              :searchTreeVariable="searchTreeVariable"
              @formulaClick="
                (item) => {
                  insertMaths(item.functionName);
                }
              "
              @enterInfo="onEnterInfo"
            ></FormulaList>
            <div
              class="formula-maths-desc formula-params-list"
              v-if="activeMath"
            >
              <p class="math-desc">功能说明：</p>
              <p class="math-usage">
                {{ activeMath.functionDescription }}
              </p>
              <p class="math-desc">参数说明：</p>
              <p class="math-example">
                {{ activeMath.parameterDescription }}
              </p>
            </div>
          </div>
        </div>
      </slot>
    </div>
  </div>
  <!-- <el-button @click="getResult" style="margin-left: 10px" class="result-btn">
    设置变量
  </el-button> -->
  <div class="footer">
    <el-button
      @click="setVariables"
      :disabled="disabled"
      class="result-btn"
      type="primary"
      text
      bg
    >
      选择指标
    </el-button>
    <div>
      <el-button @click="closeDialog" style="margin-left: 10px" text bg>
        取消
      </el-button>
      <el-button
        @click="onSure"
        style="margin-left: 10px"
        type="primary"
        text
        bg
      >
        确定
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, type PropType } from "vue";

import { uuid, flatTree, generateRandomData } from "./utils/index";
import { FORMULA_MATHS } from "./utils/math";
import { useFormCreateStoreHook } from "@/store/modules/formCreate";
import { evalFormula, validateFormula, VARIABLE_REG } from "./utils/formula";
import FormulaCodeMirror from "./codemirror/index.vue";
import FormulaList from "./FormulaList.vue";
import calculator from "./calculator.vue";

import type { MathItem, VariableItem } from "./interfaces";

const props = defineProps({
  title: {
    type: String,
    default: "公式",
  },
  isDark: {
    type: Boolean,
    default: false,
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  height: {
    type: Number,
    default: 200,
  },
  placeholder: {
    type: String,
    default: "",
  },
  // 变量列表
  variables: {
    type: Array as PropType<VariableItem[]>,
    default: () => [],
  },
  oldVariables: {
    type: Array as () => VariableItem[],
    default: () => [],
  },
  // 支持的math方法
  // mathList: {
  //   type: Array as PropType<MathItem[]>,
  //   default: () => FORMULA_MATHS,
  // },
});

const formCreateStore = useFormCreateStoreHook();
const mathList = computed(() => {
  return formCreateStore.formulaMaths.length > 0
    ? formCreateStore.formulaMaths
    : FORMULA_MATHS;
});

defineSlots<{
  math(props: { insert: (mathName: string) => void }): any;
  variable(props: { insert: (varName: string) => void }): any;
}>();
const emit = defineEmits(["open", "close", "sure"]);

const refreshKey = uuid();
const refreshNum = ref(0);
const validInfo = ref("");
const searchTreeVariable = ref("");

const variablesVals = computed(() => {
  return props.variables.map((item) => item.model);
});

// 树形mathList展平
const flatMathList = computed(() => {
  return flatTree(mathList.value);
});
console.log(flatMathList, "--flatMathList");

const codeValue = defineModel({
  default: "",
});
const codeMirrorRef = ref<InstanceType<typeof FormulaCodeMirror>>();
const activeMath = ref<MathItem>(flatMathList.value[0]);

const insertVariables = (varName: string) => {
  console.log(varName, "--varName");
  codeMirrorRef.value?.insertVariables(varName);
};

const insertMaths = (mathName: string) => {
  if (!props.disabled) {
    codeMirrorRef.value?.insertMaths(mathName);
  }
};

const insertValue = (str) => {
  if (!props.disabled) {
    codeMirrorRef.value?.insertValue(str);
  }
};

const getResult = () => {
  const data = {};
  let type = 2;
  let marks = [];
  const text = codeValue.value.replace(VARIABLE_REG, (match, p1) => {
    let item = props.variables.find((item) => item.model === p1);
    if (item) {
      type = 1;
      marks.push({
        label: item.label,
        model: item.model,
      });
      data[item.model] = generateRandomData(item.type);
      return item.label;
    }
  });
  try {
    const result = evalFormula(
      codeValue.value,
      (text) => {
        return `['${text}']`;
      },
      data,
      flatMathList.value
    );
    console.log(result, "--result");
    validInfo.value = "";
    return { error: false, text, marks, type };
  } catch (error) {
    validInfo.value = error;
    return { error: true, text, marks, type, message: error };
  }
};

const setVariables = () => {
  if (!props.disabled) {
    emit("open");
  }
};

const closeDialog = () => {
  emit("close");
};

const onSure = () => {
  emit("sure");
};

// 鼠标移入公式
const onEnterInfo = (fumulaInfo) => {
  activeMath.value = fumulaInfo;
};
// 监听变量变化就行刷新
watch(
  () => variablesVals.value,
  () => {
    refreshNum.value++;
  },
  {
    deep: true,
    immediate: true,
  }
);

// 监听变量变化就行刷新
watch(
  () => codeValue.value,
  (val) => {
    if (val) {
      getResult();
    }
  },
  {
    immediate: true,
  }
);

defineExpose({
  insertMaths,
  insertVariables,
  insertValue,
  codeValue,
  getResult,
});

defineOptions({
  name: "FormulaEditor",
});
</script>
<style lang="scss" scoped>
@import url("./index.scss");
</style>