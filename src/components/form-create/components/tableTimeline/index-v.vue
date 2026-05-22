<template>
  <!-- <pure-table
    class="tableTimeline"
    :data="tableData"
    :columns="options.columns"
    max-height="300"
    ref="tablePure"
    border
    :summary-method="getSummaries"
    show-summary
  >
    <template #date="scope">
      <el-date-picker
        v-if="update"
        class="date-month"
        :type="dataType"
        placeholder="请选择时间"
        :disabled="disabled"
        :readonly="readonly"
        :disabled-date="options.limit?.length && disabledDate"
        :valueFormat="options.valueFormat"
        :model-value="scope.row.date"
        @update:model-value="
          (val) => {
            if (props.update) scope.row.date = val;
          }
        "
      />
      <span v-else> {{ scope.row.date }}</span>
    </template>
    <template #input="scope">
      <el-input
        v-if="update"
        class="date-month"
        placeholder="请输入"
        :disabled="disabled"
        :readonly="readonly"
        :model-value="scope.row.num"
        @update:model-value="
          (val) => {
            if (props.update) scope.row.num = val;
          }
        "
      />
      <span v-else> {{ scope.row.num }}</span>
    </template>
    <template #unitValue>
      {{ options.selectUnit.unitValue }}
    </template>
    <template #operation="scope">
      <div class="flex gap-1">
        <AddFill
          class="cursor-pointer text-primary"
          title="添加"
          @click="!disabled && handleAdd(scope)"
        />
        <IdeFill
          v-show="tableData.length > 1"
          class="cursor-pointer text-danger"
          title="删除"
          @click="!disabled && handleDelete(scope)"
        />
      </div>
    </template>
  </pure-table> -->
  <div style="height: 300px">
    <el-auto-resizer>
      <template #default="{ height, width }">
        <el-table-v2
          ref="tablePure"
          :columns="tableColumns"
          :data="tableData"
          :width="width"
          :height="height"
          :footer-height="50"
          fixed
        >
          <template #cell="{ column, rowData, rowIndex }">
            <div v-if="column.dataKey == 'date'">
              <el-date-picker
                v-if="update"
                class="date-month"
                :type="dataType"
                placeholder="请选择时间"
                :disabled="disabled"
                :readonly="readonly"
                :disabled-date="options.limit?.length && disabledDate"
                :valueFormat="options.valueFormat"
                :model-value="rowData[column.dataKey]"
                @update:model-value="
                  (val) => {
                    if (props.update) rowData[column.dataKey] = val;
                  }
                "
              />
              <span v-else> {{ rowData[column.dataKey] }}</span>
            </div>
            <div v-if="column.dataKey == 'num'">
              <el-input
                v-if="update"
                class="date-month"
                placeholder="请输入"
                :disabled="disabled"
                :readonly="readonly"
                :model-value="rowData[column.dataKey]"
                @update:model-value="
                  (val) => {
                    if (props.update) rowData[column.dataKey] = val;
                  }
                "
              />
              <span v-else> {{ rowData[column.dataKey] }}</span>
            </div>
            <div v-if="column.dataKey == 'unitValue'">
              {{ options.selectUnit.unitValue }}
            </div>
            <div v-if="column.dataKey == 'operation'">
              <div class="flex gap-1">
                <AddFill
                  class="cursor-pointer text-primary"
                  title="添加"
                  @click="!disabled && handleAdd(rowData, rowIndex)"
                />
                <IdeFill
                  v-show="tableData.length > 1"
                  class="cursor-pointer text-danger"
                  title="删除"
                  @click="!disabled && handleDelete(rowData, rowIndex)"
                />
              </div>
            </div>
          </template>
          <template #footer
            ><div class="el-table-v2__row">
              <div class="el-table-v2__row-cell" style="width: 100px">合计</div>
              <div class="el-table-v2__row-cell" style="width: 100px">
                {{ getSummaries() }}
              </div>
            </div>
          </template>
        </el-table-v2>
      </template>
    </el-auto-resizer>
  </div>

  <!-- <el-table
    class="tableTimeline"
    :data="tableData"
    max-height="300"
    ref="tablePure"
    border
    :summary-method="getSummaries"
    show-summary
  >
    <el-table-column
      v-for="(item, index) in options.columns"
      :key="index"
      :prop="item.prop"
      :label="item.label"
    >
      <template v-if="item.slot == 'date'" #default="scope">
        <el-date-picker
          v-if="update"
          class="date-month"
          :type="dataType"
          placeholder="请选择时间"
          :disabled="disabled"
          :readonly="readonly"
          :disabled-date="disabledDate"
          :valueFormat="options.valueFormat"
          :model-value="scope.row.date"
          @update:model-value="
            (val) => {
              if (props.update) scope.row.date = val;
            }
          "
        />
        <span v-else> {{ scope.row.date }}</span>
      </template>
      <template v-else-if="item.slot == 'input'" #default="scope">
        <el-input
          v-if="update"
          class="date-month"
          placeholder="请输入"
          :disabled="disabled"
          :readonly="readonly"
          :model-value="scope.row.num"
          @update:model-value="
            (val) => {
              if (props.update) scope.row.num = val;
            }
          "
        />
        <span v-else> {{ scope.row.num }}</span>
      </template>
      <template v-else-if="item.slot == 'unitValue'" #default="scope">
        {{ options.selectUnit.unitValue }}
      </template>
      <template v-else-if="item.slot == 'operation'" #default="scope">
        <div class="flex gap-1">
          <AddFill
            class="cursor-pointer text-primary"
            title="添加"
            @click="!disabled && handleAdd(scope)"
          />
          <IdeFill
            v-show="tableData.length > 1"
            class="cursor-pointer text-danger"
            title="删除"
            @click="!disabled && handleDelete(scope)"
          />
        </div>
      </template>
    </el-table-column>
  </el-table> -->
</template>

<script lang="ts" setup>
import {
  defineProps,
  defineEmits,
  PropType,
  h,
  ref,
  reactive,
  watch,
  computed,
  nextTick,
} from "vue";
import type { VNode, FunctionalComponent } from "vue";
import type { TableColumnCtx, Column, InputInstance } from "element-plus";
import AddFill from "~icons/ri/add-circle-line";
import IdeFill from "~icons/ri/indeterminate-circle-line";
import { ElMessage, ElInput } from "element-plus";
import dayjs from "dayjs";

// 时间序列项接口
interface TimelineItem {
  id: string;
  date: string;
  num: string;
}

// 表格作用域接口
interface TableScope<T = TimelineItem> {
  row: T;
  $index: number;
}

// 汇总方法参数接口
interface SummaryMethodProps<T = TimelineItem> {
  columns: TableColumnCtx<T>[];
  data: T[];
}

const props = defineProps({
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  readonly: {
    type: Boolean,
    required: false,
    default: false,
  },
  update: {
    type: Boolean,
    required: false,
    default: false,
  },
  size: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: false,
  },
  value: {
    type: Array as PropType<TimelineItem[]>,
    default: () => [],
  },
  options: {
    type: Object,
    default: {
      columns: [
        {
          label: "时间",
          prop: "date",
          slot: "date",
        },
        {
          label: "结果",
          prop: "num",
          slot: "input",
        },
      ],
    },
  },
  model: {
    type: Object,
    required: false,
  },
});
const emit = defineEmits<{
  "update:value": [value: TimelineItem[]];
  add: [row: TimelineItem];
  delete: [row: TimelineItem];
}>();

const tablePure = ref("");
const visible = ref(false);
const inputValue = ref("");
// 配置时间单位和值
const timeUnitConfig = {
  date: { unit: "day", value: 1 },
  month: { unit: "month", value: 1 },
  season: { unit: "month", value: 3 },
  year: { unit: "year", value: 1 },
};
const dataType = computed(() => {
  return timeUnitConfig[props.options.radio.radioValue].unit;
});
// 添加计算属性缓存
const selectValue = computed(() => props.options.select?.selectValue);
const daterange = computed(() => props.options.daterange || []);
// 首先定义计算属性缓存需要的配置
const daterangeValue = computed(() => props.options.daterangeModal || []);
// 检查daterangeModal是否有效
const isValidDaterangeModal = computed(() => {
  return (
    daterangeValue.value.length >= 2 &&
    daterangeValue.value[0]?.model &&
    daterangeValue.value[1]?.model
  );
});

// 根据selectValue获取正确的日期范围
const getDateRange = () => {
  if (
    selectValue.value === "model" &&
    isValidDaterangeModal.value &&
    props.model
  ) {
    // 使用daterangeModel绑定的日期
    return [
      props.model[daterangeValue.value[0].model],
      props.model[daterangeValue.value[1].model],
    ];
  } else {
    // 使用daterange的日期
    return props.options.daterange || [];
  }
};

// 检查是否需要更新表格数据（基于model）
const shouldUpdateTableFromModel = computed(() => {
  return (
    !(props.type == "fill") &&
    isValidDaterangeModal.value &&
    props.model &&
    selectValue.value == "model"
  );
});
const tableColumns = computed(() => {
  return props.options.columns.map((item) => ({
    key: item.prop,
    title: item.label,
    dataKey: item.prop,
    width: 100,
  }));
});

// 使用传入的数据或默认数据.
// radio.radioValue "date" "month" "season" "year"
// tableData 按数据里的date 日,月,季,年,排序
const tableDateList = (daterange) => {
  const [start, end] = daterange;
  const startDate = dayjs(start);
  const endDate = dayjs(end);
  const resultList = [];
  switch (props.options.radio.radioValue) {
    case "date":
      // 按日生成日期列表
      let currentDate = startDate;
      while (currentDate.isBefore(endDate) || currentDate.isSame(endDate)) {
        resultList.push({
          id: new Date(),
          date: currentDate.format("YYYY-MM-DD"),
          num: "", // 或其他默认值
        });
        currentDate = currentDate.add(1, "day");
      }
      break;

    case "month":
      // 按月生成日期列表
      let currentMonth = startDate.startOf("month");
      const endMonth = endDate.endOf("month");

      while (
        currentMonth.isBefore(endMonth) ||
        currentMonth.isSame(endMonth, "month")
      ) {
        resultList.push({
          id: new Date(),
          date: currentMonth.format("YYYY-MM-DD"),
          num: "",
        });
        currentMonth = currentMonth.add(1, "month");
      }
      break;

    case "season":
      // 按季度生成日期列表
      // 获取开始季度的起始月份
      const getQuarterStartMonth = (date) => {
        const month = date.month();
        return date.month(Math.floor(month / 3) * 3).startOf("month");
      };

      let currentQuarter = getQuarterStartMonth(startDate);
      const endQuarter = getQuarterStartMonth(endDate);

      while (
        currentQuarter.isBefore(endQuarter) ||
        currentQuarter.isSame(endQuarter, "month")
      ) {
        const quarter = Math.floor(currentQuarter.month() / 3) + 1;
        resultList.push({
          id: new Date(),
          date: `${currentQuarter.format("YYYY-MM-DD")}`,
          num: "",
        });
        currentQuarter = currentQuarter.add(3, "month");
      }
      break;

    case "year":
      // 按年生成日期列表
      let currentYear = startDate.startOf("year");
      const endYear = endDate.endOf("year");

      while (
        currentYear.isBefore(endYear) ||
        currentYear.isSame(endYear, "year")
      ) {
        resultList.push({
          id: new Date(),
          date: currentYear.format("YYYY-MM-DD"),
          num: "",
        });
        currentYear = currentYear.add(1, "year");
      }
      break;

    default:
      // 默认按日处理
      let defaultDate = startDate;
      while (defaultDate.isBefore(endDate) || defaultDate.isSame(endDate)) {
        resultList.push({
          id: new Date(),
          date: defaultDate.format("YYYY-MM-DD"),
          num: "",
        });
        defaultDate = defaultDate.add(1, "day");
      }
      break;
  }
  return resultList.length ? resultList : [{ id: "1", date: "", num: "" }];
};
let tableData = ref<TimelineItem[]>(
  props.value.length > 0 ? [...props.value] : [{ id: "1", date: "", num: "" }]
);

const onClickOutside = () => {
  visible.value = false;
};
// 禁止选择日期
const disabledDate = (time: Date) => {
  // 若启用限制且日期范围数组长度大于 2，则禁用超出范围的日期
  if (props.options.limit) {
    const dateRange = getDateRange();
    if (dateRange.length >= 2) {
      const [start, end] = dateRange;
      if (start && end) {
        const startDate = dayjs(start);
        const endDate = dayjs(end);
        const currentDate = dayjs(time);
        // 禁用 start 之前和 end 之后的日期
        return currentDate.isBefore(startDate) || currentDate.isAfter(endDate);
      }
    }
  }
  return false;
};
// 表格汇总函数 - 计算并显示各列合计值
const getSummaries = (param: SummaryMethodProps) => {
  const total = tableData.value.reduce((sum, item) => {
    const num = Number(item.num);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);
  return total.toFixed(2);
};

const handleAdd = (rowData: TimelineItem, rowIndex: number) => {
  // 在当前行后添加新行
  let currentDate = dayjs(rowData.date);
  const dateRange = getDateRange();
  const [start, end] = dateRange;
  const endDate = dayjs(end);
  const config = timeUnitConfig[props.options.radio.radioValue] || {
    unit: "day",
    value: 1,
  };
  // 按数据里的 props.options.radio.radioValue 日,月,季,年增加时间
  currentDate = currentDate.add(config.value, config.unit);
  if (
    end &&
    !(currentDate.isBefore(endDate) || currentDate.isSame(endDate)) &&
    props.options.limit
  ) {
    ElMessage.warning("该时间序列已限定时间范围!");
    return;
  }
  const newRow: TimelineItem = {
    id: `${Date.now()}`,
    date: currentDate.isValid() ? currentDate.format("YYYY-MM-DD") : "",
    num: "",
  };
  tableData.value.splice(rowIndex + 1, 0, newRow);
  nextTick(() => {
    tablePure.value.scrollToTop(48 * (rowIndex + 1));
  });
};

const handleDelete = (rowData: TimelineItem, rowIndex: number) => {
  // 删除当前数据
  const targetIndex = tableData.value.findIndex(
    (item) => item.id === rowData.id
  );
  if (targetIndex !== -1) {
    tableData.value.splice(targetIndex, 1);
  }
};

watch(
  props.options,
  () => {
    if (
      !(props.type == "fill") &&
      daterange.value.length >= 2 &&
      selectValue.value == "input"
    ) {
      tableData.value = tableDateList(daterange.value);
    }
  },
  { immediate: true }
);

watch(
  // 只监听需要的两个属性，添加安全检查
  [
    () =>
      isValidDaterangeModal.value && props.model
        ? props.model[daterangeValue.value[0].model]
        : undefined,
    () =>
      isValidDaterangeModal.value && props.model
        ? props.model[daterangeValue.value[1].model]
        : undefined,
    selectValue,
    () => props.type,
  ],
  ([startVal, endVal]) => {
    if (shouldUpdateTableFromModel.value) {
      const daterange = [startVal, endVal];
      tableData.value = tableDateList(daterange);
    }
  }
);

watch(
  tableData,
  (newVal) => {
    emit("update:value", newVal);
  },
  { deep: true }
);
</script>
<style scoped lang="scss">
.tableTimeline {
  ::v-deep(.date-month) {
    width: 100%;
    .el-input__wrapper {
      box-shadow: none;
    }
  }
}
</style>
