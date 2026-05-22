<template>
  <div :class="{ flex: multiSelectMode }">
    <div
      v-if="multiSelectMode"
      class="widget-checkbox-wrapper"
      @click.stop="handleCheckboxClick"
    >
      <el-checkbox
        :disabled="!selectFields.includes(element.type)"
        :modelValue="selectedGenerates.has(element.model)"
        @change="handleCheckboxChange"
      />
    </div>
    <template v-if="element.type == 'divider'">
      <div
        :class="{
          'generate-view': type == 'select',
          active: selectGenerate?.key === element.key,
          'flex-1': multiSelectMode,
        }"
      >
        <el-divider
          :borderStyle="element.options.borderStyle"
          :contentPosition="element.options.contentPosition"
          >{{ element.options.defaultValue }}</el-divider
        >
      </div>
    </template>
    <el-form-item
      v-else-if="element"
      :key="element.key"
      :class="{
        'generate-view': type == 'select',
        active: selectGenerate?.key === element.key,
        'flex-1': multiSelectMode,
      }"
      :prop="element.model"
    >
      <template #label
        ><ReText
          :tippyProps="{
            theme: tooltipEffect,
          }"
          >{{ element.label }}</ReText
        ></template
      >
      <template v-if="element.type === 'input'">
        <el-input
          v-model="data"
          :style="{ width: element.options.width }"
          :placeholder="element.options.placeholder"
          :maxlength="parseInt(element.options.maxlength)"
          :clearable="element.options.clearable"
          :readonly="readonly || element.options.readonly"
          :disabled="disabled || element.options.disabled"
        >
          <template v-if="element.options.prefix" #prefix>{{
            element.options.prefix
          }}</template>
          <template v-if="element.options.suffix" #suffix>{{
            element.options.suffix
          }}</template>
          <template v-if="element.options.prepend" #prepend>{{
            element.options.prepend
          }}</template>
          <template v-if="element.options.append" #append>{{
            element.options.append
          }}</template>
        </el-input>
      </template>

      <template v-if="element.type === 'digit'">
        <el-input
          :modelValue="data ?? ''"
          :style="{ width: element.options.width }"
          :placeholder="element.options.placeholder"
          :maxlength="parseInt(element.options.maxlength)"
          :clearable="element.options.clearable"
          :readonly="readonly || element.options.readonly"
          :disabled="disabled || element.options.disabled"
          inputmode="decimal"
          @update:modelValue="handleDigitUpdate"
          @blur="handleDigitBlur"
        >
          <template v-if="digitAppendText" #append>
            <span class="digit-append-unit">{{ digitAppendText }} </span>
          </template>
        </el-input>
      </template>

      <template v-if="element.type === 'password'">
        <el-input
          v-model="data"
          :style="{ width: element.options.width }"
          :placeholder="element.options.placeholder"
          :maxlength="parseInt(element.options.maxlength)"
          :clearable="element.options.clearable"
          :disabled="disabled || element.options.disabled"
          :readonly="readonly || element.options.readonly"
          :show-password="element.options.showPassword"
        >
          <template v-if="element.options.prefix" #prefix>{{
            element.options.prefix
          }}</template>
          <template v-if="element.options.suffix" #suffix>{{
            element.options.suffix
          }}</template>
          <template v-if="element.options.prepend" #prepend>{{
            element.options.prepend
          }}</template>
          <template v-if="element.options.append" #append>{{
            element.options.append
          }}</template>
        </el-input>
      </template>

      <template v-if="element.type === 'textarea'">
        <el-input
          v-model="data"
          type="textarea"
          resize="none"
          :rows="element.options.rows"
          :style="{ width: element.options.width }"
          :placeholder="element.options.placeholder"
          :maxlength="parseInt(element.options.maxlength)"
          :show-word-limit="element.options.showWordLimit"
          :autosize="element.options.autosize"
          :clearable="element.options.clearable"
          :readonly="readonly || element.options.readonly"
          :disabled="disabled || element.options.disabled"
        />
      </template>

      <template v-if="element.type === 'number'">
        <el-input-number
          v-model="data"
          :style="{ width: element.options.width }"
          :max="element.options.max"
          :min="element.options.min"
          :disabled="disabled || element.options.disabled"
        />
      </template>

      <template v-if="element.type === 'radio'">
        <el-radio-group
          v-model="data"
          :style="{ width: element.options.width }"
          :disabled="disabled || element.options.disabled"
        >
          <el-radio
            v-for="item of element.options.remote
              ? element.options.remoteOptions
              : element.options.options"
            :key="item.value"
            :value="item.value"
            :style="{
              display: element.options.inline ? 'inline-block' : 'block',
            }"
            >{{ element.options.showLabel ? item.label : item.value }}</el-radio
          >
        </el-radio-group>
      </template>

      <template v-if="element.type === 'checkbox' && data">
        <el-checkbox-group
          v-model="data"
          :style="{ width: element.options.width }"
          :disabled="disabled || element.options.disabled"
        >
          <el-checkbox
            v-for="item of element.options.remote
              ? element.options.remoteOptions
              : element.options.options"
            :key="item.value"
            :value="item.value"
            :style="{
              display: element.options.inline ? 'inline-block' : 'block',
            }"
          >
            {{ element.options.showLabel ? item.label : item.value }}
          </el-checkbox>
        </el-checkbox-group>
      </template>

      <template v-if="element.type === 'time'">
        <el-time-picker
          v-model="data"
          :placeholder="element.options.placeholder"
          :readonly="readonly || element.options.readonly"
          :editable="element.options.editable"
          :clearable="element.options.clearable"
          :format="element.options.format"
          :disabled="disabled || element.options.disabled"
          :style="{ width: element.options.width }"
        />
      </template>

      <template v-if="element.type === 'date'">
        <el-date-picker
          v-model="data"
          :placeholder="element.options.placeholder"
          :readonly="readonly || element.options.readonly"
          :editable="element.options.editable"
          :clearable="element.options.clearable"
          :valueFormat="element.options.valueFormat"
          :type="element.options.selectType?.typeValue"
          :disabled="disabled || element.options.disabled"
          :style="{ width: element.options.width }"
        />
      </template>

      <template v-if="element.type === 'rate'">
        <el-rate
          v-model="data"
          :max="element.options.max"
          :allowHalf="element.options.allowHalf"
          :disabled="disabled || element.options.disabled"
        />
      </template>

      <template v-if="element.type === 'select'">
        <template v-if="!readonly">
          <el-select
            v-model="data"
            :multiple="element.options.multiple"
            :placeholder="element.options.placeholder"
            :clearable="element.options.clearable"
            :filterable="element.options.filterable"
            :disabled="disabled || element.options.disabled"
            :style="{ width: element.options.width }"
          >
            <el-option
              v-for="item of element.options.remote
                ? element.options.remoteOptions
                : element.options.options"
              :key="item.value"
              :value="item.value"
              :label="element.options.showLabel ? item.label : item.value"
            />
          </el-select>
        </template>
        <template v-else>
          <el-select
            :multiple="element.options.multiple"
            :placeholder="element.options.placeholder"
            :clearable="element.options.clearable"
            :filterable="element.options.filterable"
            :disabled="disabled || element.options.disabled"
            :style="{ width: element.options.width }"
          >
            <el-option
              v-for="item of element.options.remote
                ? element.options.remoteOptions
                : element.options.options"
              :key="item.value"
              :value="item.value"
              :label="element.options.showLabel ? item.label : item.value"
            />
          </el-select>
        </template>
      </template>

      <template v-if="element.type === 'switch'">
        <el-switch
          v-model="data"
          :active-text="element.options.activeText"
          :inactive-text="element.options.inactiveText"
          :disabled="disabled || element.options.disabled"
        />
      </template>

      <template v-if="element.type === 'slider'">
        <el-slider
          v-model="data"
          :min="element.options.min"
          :max="element.options.max"
          :step="element.options.step"
          :range="element.options.range"
          :disabled="disabled || element.options.disabled"
          :style="{ width: element.options.width }"
        />
      </template>

      <template v-if="element.type == 'text'">
        <span>{{ element.options.defaultValue }}</span>
      </template>

      <template v-if="element.type == 'button'">
        <el-button :type="element.options.type">{{
          element.options.defaultValue
        }}</el-button>
      </template>

      <template v-if="element.type == 'mathComp'">
        <FormulaPreview
          v-if="!Array.isArray(data)"
          :formula="mathCompResult() || '公式设置'"
          :disabled="disabled || element.options.disabled"
          :variables="variables"
          :oldVariables="widgetForm.variables"
          @click="formulaEditerDialog"
        >
          <template v-if="element.options.unit" #append>
            {{ element.options.unit }}
          </template>
        </FormulaPreview>
        <tableTimeline
          v-else
          type="fill"
          :value="data"
          :disabled="disabled || element.options.disabled"
          :options="{ ...element.options, columns }"
        />
      </template>

      <template v-if="element.type === 'img-upload'">
        <el-upload
          :name="element.options.file"
          :action="element.options.action"
          :accept="element.options.accept"
          :file-list="element.options.defaultValue"
          :listType="element.options.listType"
          :multiple="element.options.multiple"
          :limit="element.options.limit"
          :disabled="disabled || element.options.disabled"
          :on-success="handleUploadSuccess"
        >
          <SvgIcon
            v-if="element.options.listType === 'picture-card'"
            iconClass="insert"
          />
          <el-button v-else>
            <SvgIcon
              iconClass="img-upload"
              style="margin-right: 10px"
            />点击上传
          </el-button>
        </el-upload>
      </template>

      <template v-else-if="element.type === 'tableTimeline'">
        <tableTimeline
          v-model:value="data"
          :model="model"
          :disabled="disabled || element.options.disabled"
          :readonly="readonly || element.options.readonly"
          :update="true"
          :type="type"
          :options="element.options"
          :style="{ width: element.options.width }"
        />
      </template>
      <template v-if="element.type === 'businessComp'">
        <el-input
          :value="element.options.defaultValue"
          :disabled="disabled || element.options.disabled"
          readonly
        ></el-input>
      </template>

      <template v-if="element.type === 'richtext-editor'">
        <!-- <RichTextEditor
        v-model:value="data"
        :disable="disabled || element.options.disabled"
        :style="{ width: element.options.width }"
      /> -->
      </template>

      <template v-if="element.type === 'cascader'">
        <el-cascader
          v-model="data"
          :options="element.options.remoteOptions"
          :placeholder="element.options.placeholder"
          :filterable="element.options.filterable"
          :clearable="element.options.clearable"
          :disabled="disabled || element.options.disabled"
          :style="{ width: element.options.width }"
        />
      </template>
    </el-form-item>
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";
import SvgIcon from "@/components/form-create/components/SvgIcon.vue";
import { WidgetForm } from "@/components/form-create/config/element";
import tableTimeline from "@/components/form-create/components/tableTimeline/index.vue";
import { useNav } from "@/layout/hooks/useNav";
import { ReText } from "@/components/ReText";
import FormulaPreview from "@/components/form-create/components/formulaEditor/FormulaPreview.vue";
// import { flatTree } from "@/components/form-create/components/formulaEditor/utils/index";
import { ArrowDown } from "@element-plus/icons-vue";

const props = defineProps({
  config: {
    type: Object as PropType<WidgetForm["config"]>,
    required: true,
  },
  element: {
    type: Object,
    required: true,
  },
  model: {
    type: Object,
    required: true,
  },
  disabled: {
    type: Boolean,
    required: true,
  },
  readonly: {
    type: Boolean,
    required: false,
  },
  multiSelectMode: {
    type: Boolean,
    required: false,
  },
  selectedGenerates: {
    type: Set,
    required: false,
  },
  selectGenerate: {
    type: Object,
  },
  type: {
    type: String,
  },
  columns: {
    default: [
      {
        label: "时间",
        prop: "date",
        slot: "date",
      },
      {
        label: "数值",
        prop: "num",
        slot: "input",
      },
    ],
  },
  widgetForm: {
    type: Object as PropType<WidgetForm>,
    required: true,
  },
  variables: {
    type: Array,
    default: () => [],
  },
  selectFields: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits<{
  (e: "dialog", element: any): void;
  (e: "toggle-selection", element: any, checked: boolean): void;
}>();

const data = computed({
  get: () => props.model[props.element.model],
  set: (val) => {
    // eslint-disable-next-line vue/no-mutating-props
    props.model[props.element.model] = val;
  },
});

const defaultProps = {
  children: "list",
  filterKey: "model",
};

// const variables = computed(() => {
//   return flatTree(props.widgetForm?.list || [], defaultProps);
// });

const getDigitPrecision = () => {
  const p = Number(props.element?.options?.precision);
  if (!Number.isFinite(p) || p < 0) return 0;
  return Math.min(10, Math.floor(p));
};

const digitAppendText = computed(() => {
  const unit = props.element?.options?.unit;
  return String(unit || "").trim();
});

const normalizeDigitInput = (raw: string, precision: number) => {
  const str = String(raw ?? "").trim();
  const negative = str.startsWith("-");
  // 只保留数字和小数点
  let s = str.replace(/[^\d.]/g, "");

  // 只保留第一个小数点
  const firstDot = s.indexOf(".");
  if (firstDot !== -1) {
    const intPart = s.slice(0, firstDot).replace(/\./g, "");
    let fracPart = s.slice(firstDot + 1).replace(/\./g, "");
    if (precision <= 0) {
      s = intPart;
    } else {
      fracPart = fracPart.slice(0, precision);
      s = `${intPart}.${fracPart}`;
      if (s.startsWith(".")) s = `0${s}`;
    }
  } else {
    s = s.replace(/\./g, "");
  }

  if (negative && s) return `-${s}`;
  if (negative && !s) return "-";
  return s;
};

const handleDigitUpdate = (val: string) => {
  const precision = getDigitPrecision();
  data.value = normalizeDigitInput(val, precision);
};

const handleDigitBlur = () => {
  const precision = getDigitPrecision();
  const raw = String(data.value ?? "").trim();
  if (!raw || raw === "-" || raw === ".") {
    data.value = "";
    return;
  }
  const normalized = normalizeDigitInput(raw, precision);
  const num = Number(normalized);
  if (!Number.isFinite(num)) {
    data.value = "";
    return;
  }
  data.value = precision > 0 ? num.toFixed(precision) : String(Math.trunc(num));
};

const { tooltipEffect } = useNav();

const handleFilterOption = (input: string, option: { label: string }) =>
  option.label.toLowerCase().includes(input);

const handleUploadSuccess = (_res: any, _file: any, fileList: any[]) => {
  data.value = fileList;
};

// 打开计算公式弹窗
const formulaEditerDialog = () => {
  emit("dialog", props.element);
};

const mathCompResult = () => {
  const val = data.value;
  if (Array.isArray(val) && val.length > 0 && val[0]?.num) {
    const total = val.reduce((prev, cur) => {
      const num = Number(cur.num);
      return prev + (isNaN(num) ? 0 : num);
    }, 0);
    return total;
  } else if (val) {
    return val;
  }
  return "公式设置";
};
const handleCheckboxClick = () => {};
const handleCheckboxChange = () => {
  emit("toggle-selection", props.element);
};
</script>

<style scoped>
/* 针对数字输入框的整个输入组 */
:deep(.el-input-group--append) {
  display: flex !important;
}

/* 使用深度选择器穿透 Element Plus 组件样式，针对 append 容器 */
:deep(.el-input-group--append .el-input-group__append) {
  min-width: 13ch !important;
  text-align: left !important;
  flex: 0 0 auto !important; /* flex-grow: 0, flex-shrink: 0, flex-basis: auto - 不允许收缩，根据内容自动扩展 */
  width: auto !important;
  display: inline-flex !important;
  justify-content: flex-start !important; /* 左对齐 */
}

/* 针对单位文本本身 */
:deep(.digit-append-unit) {
  min-width: 13ch !important;
  text-align: left !important;
  display: block !important;
  width: auto !important; /* 改为 auto，让宽度根据内容自动扩展 */
  white-space: nowrap !important; /* 防止文字换行 */
}
</style>
