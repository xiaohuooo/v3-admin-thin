<template>
  <div
    v-show="element.options.showModel"
    class="widget-item-container"
    :class="{ flex: multiSelectMode, 'gap-[8px]': multiSelectMode }"
  >
    <div
      v-if="multiSelectMode"
      class="widget-checkbox-wrapper"
      @click.stop="handleCheckboxClick"
    >
      <el-checkbox
        :modelValue="selectedWidgets.has(element.model)"
        @change="handleCheckboxChange"
      />
    </div>
    <template v-if="element.type === 'divider'">
      <div
        class="widget-view"
        :class="{
          active: selectWidget?.key === element.key,
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
      class="widget-view"
      :class="{
        active: selectWidget?.key === element.key,
        'flex-1': multiSelectMode,
      }"
      :rules="element.options.rules"
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
          readonly
          :modelValue="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :placeholder="element.options.placeholder"
          :maxlength="parseInt(element.options.maxlength)"
          :clearable="element.options.clearable"
          :disabled="element.options.disabled"
        >
          <template #prefix>
            {{ element.options.prefix }}
          </template>
          <template #suffix>
            {{ element.options.suffix }}
          </template>
          <template v-if="element.options.prepend" #prepend>
            {{ element.options.prepend }}
          </template>
          <template v-if="element.options.append" #append>
            {{ element.options.append }}
          </template>
        </el-input>
      </template>

      <template v-if="element.type === 'digit'">
        <el-input
          readonly
          :modelValue="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :placeholder="element.options.placeholder"
          :maxlength="parseInt(element.options.maxlength)"
          :clearable="element.options.clearable"
          :disabled="element.options.disabled"
        >
          <template v-if="element.options.unit" #append>
            {{ element.options.unit }}
          </template>
        </el-input>
      </template>

      <template v-if="element.type === 'password'">
        <el-input
          readonly
          :modelValue="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :placeholder="element.options.placeholder"
          :maxlength="parseInt(element.options.maxlength)"
          :clearable="element.options.clearable"
          :disabled="element.options.disabled"
          :show-password="element.options.showPassword"
        >
          <template v-if="element.options.prefix" #prefix>
            {{ element.options.prefix }}
          </template>
          <template v-if="element.options.suffix" #suffix>
            {{ element.options.suffix }}
          </template>
          <template v-if="element.options.prepend" #prepend>
            {{ element.options.prepend }}
          </template>
          <template v-if="element.options.append" #append>
            {{ element.options.append }}
          </template>
        </el-input>
      </template>

      <template v-if="element.type === 'textarea'">
        <el-input
          type="textarea"
          resize="none"
          readonly
          :rows="element.options.rows"
          :modelValue="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :placeholder="element.options.placeholder"
          :maxlength="parseInt(element.options.maxlength)"
          :show-word-limit="element.options.showWordLimit"
          :autosize="element.options.autosize"
          :clearable="element.options.clearable"
          :disabled="element.options.disabled"
        />
      </template>

      <template v-if="element.type === 'number'">
        <el-input-number
          :modelValue="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :max="element.options.max"
          :min="element.options.min"
          :disabled="element.options.disabled"
        />
      </template>

      <template v-if="element.type === 'radio'">
        <el-radio-group
          :modelValue="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :disabled="element.options.disabled"
        >
          <el-radio
            v-for="item of element.options.options"
            :key="item.value"
            :value="item.value"
            :style="{
              display: element.options.inline ? 'inline-block' : 'block',
            }"
            >{{ element.options.showLabel ? item.label : item.value }}</el-radio
          >
        </el-radio-group>
      </template>

      <template v-if="element.type === 'checkbox'">
        <el-checkbox-group
          :modelValue="element.options.defaultValue"
          :style="{ width: element.options.width }"
          :disabled="element.options.disabled"
        >
          <el-checkbox
            v-for="item of element.options.options"
            :key="item.value"
            :label="item.value"
            :style="{
              display: element.options.inline ? 'inline-block' : 'block',
            }"
            >{{ element.options.showLabel ? item.label : item.value }}
          </el-checkbox>
        </el-checkbox-group>
      </template>

      <template v-if="element.type === 'time'">
        <el-time-picker
          :modelValue="element.options.defaultValue"
          :placeholder="element.options.placeholder"
          :readonly="element.options.readonly"
          :editable="element.options.editable"
          :clearable="element.options.clearable"
          :format="element.options.format"
          :disabled="element.options.disabled"
          :style="{ width: element.options.width }"
        />
      </template>

      <template v-if="element.type === 'date'">
        <el-date-picker
          :modelValue="element.options.defaultValue"
          :placeholder="element.options.placeholder"
          :readonly="element.options.readonly"
          :editable="element.options.editable"
          :clearable="element.options.clearable"
          :valueFormat="element.options.valueFormat"
          :type="element.options.selectType?.typeValue"
          :disabled="element.options.disabled"
          :style="{ width: element.options.width }"
        />
      </template>

      <template v-if="element.type === 'rate'">
        <el-rate
          :modelValue="element.options.defaultValue"
          :max="element.options.max"
          :allowHalf="element.options.allowHalf"
          :disabled="element.options.disabled"
        />
      </template>

      <template v-if="element.type === 'select'">
        <el-select
          :modelValue="element.options.defaultValue"
          :multiple="element.options.multiple"
          :placeholder="element.options.placeholder"
          :clearable="element.options.clearable"
          :filterable="element.options.filterable"
          :disabled="element.options.disabled"
          :style="{ width: element.options.width }"
        >
          <el-option
            v-for="item of element.options.options"
            :key="item.value"
            :value="item.value"
            :label="element.options.showLabel ? item.label : item.value"
          />
        </el-select>
      </template>

      <template v-if="element.type === 'switch'">
        <el-switch
          :modelValue="element.options.defaultValue"
          :active-text="element.options.activeText"
          :inactive-text="element.options.inactiveText"
          :disabled="element.options.disabled"
        />
      </template>

      <template v-if="element.type === 'slider'">
        <el-slider
          :modelValue="element.options.defaultValue"
          :min="element.options.min"
          :max="element.options.max"
          :step="element.options.step"
          :range="element.options.range"
          :disabled="element.options.disabled"
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
          :formula="element.options.mathData[0].textModel || '公式设置'"
          :variables="variables"
          :oldVariables="widgetForm.variables"
          @unvailableclick="unvailableclick"
        >
          <template v-if="element.options.unit" #append>
            {{ element.options.unit }}
          </template>
        </FormulaPreview>
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
          :disabled="element.options.disabled"
        >
          <SvgIcon
            v-if="element.options.listType === 'picture-card'"
            iconClass="insert"
          />
          <el-button v-else>
            <SvgIcon iconClass="img-upload" style="margin-right: 10px" />
            点击上传
          </el-button>
        </el-upload>
      </template>

      <template v-if="element.type === 'richtext-editor'">
        <!-- <RichTextEditor
          :value="element.options.defaultValue"
          :disable="element.options.disabled"
          :style="{ width: element.options.width }"
        /> -->
      </template>

      <template v-if="element.type === 'cascader'">
        <el-cascader
          :modelValue="element.options.defaultValue"
          :options="element.options.remoteOptions"
          :placeholder="element.options.placeholder"
          :filterable="element.options.filterable"
          :clearable="element.options.clearable"
          :disabled="element.options.disabled"
          :style="{ width: element.options.width }"
        />
      </template>

      <template v-if="element.type === 'tableTimeline'">
        <tableTimeline
          :options="element.options"
          :style="{
            width: multiSelectMode
              ? 'calc(' + element.options.width + ' - 5px)'
              : element.options.width,
          }"
        />
      </template>
      <template v-if="element.type === 'businessComp'">
        <el-input :value="element.options.defaultValue" readonly></el-input>
      </template>
    </el-form-item>
    <div v-if="selectWidget?.key === element.key" class="widget-view-action">
      <SvgIcon iconClass="copy" @click.stop="emit('copy')" />
      <SvgIcon iconClass="delete" @click.stop="emit('delete')" />
    </div>

    <div v-if="selectWidget?.key === element.key" class="widget-view-drag">
      <SvgIcon iconClass="move" className="drag-widget" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from "vue";
import SvgIcon from "@/components/form-create/components/SvgIcon.vue";
import { WidgetForm } from "@/components/form-create/config/element";
import tableTimeline from "@/components/form-create/components/tableTimeline/index.vue";
import { useNav } from "@/layout/hooks/useNav";
import { ReText } from "@/components/ReText";
import FormulaPreview from "@/components/form-create/components/formulaEditor/FormulaPreview.vue";
import { flatTree } from "@/components/form-create/components/formulaEditor/utils/index";

const props = defineProps({
  config: {
    type: Object as PropType<WidgetForm["config"]>,
    required: true,
  },
  element: {
    type: Object,
    required: true,
  },
  selectWidget: {
    type: Object,
  },
  widgetForm: {
    type: Object as PropType<WidgetForm>,
    required: true,
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
const { tooltipEffect } = useNav();
const emit = defineEmits(["copy", "delete", "toggle-selection", "dialog"]);

const handleCheckboxClick = () => {};

const handleCheckboxChange = () => {
  console.log(props.element.key, "--checkbox");
  emit("toggle-selection", props.element);
};

const unvailableclick = (event: MouseEvent) => {
  console.log("点击了不可用字段");
  emit("dialog", props.element);
};

const defaultProps = {
  children: "list",
  filterKey: "model",
};

const variables = computed(() => {
  return flatTree(props.widgetForm?.list || [], defaultProps);
});
</script>
<style scoped>
.widget-checkbox-wrapper {
  display: inline-block;
}
</style>
