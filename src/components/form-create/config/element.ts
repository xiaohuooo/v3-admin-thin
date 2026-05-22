export interface Rules {
  trigger: string;
  enum: string;
  len?: number;
  max?: number;
  message: string;
  min?: number;
  pattern: string;
  required: boolean;
  type: string;
}

export interface WidgetForm {
  list: any[];
  config: {
    size: string;
    cols: number;
    hideRequiredAsterisk: boolean;
    labelWidth: number;
    labelPosition: string;
  };
}

const rules: Rules = {
  trigger: "blur",
  enum: "",
  len: undefined,
  max: undefined,
  message: "",
  min: undefined,
  pattern: "",
  required: false,
  type: "any"
};

export const widgetForm: WidgetForm = {
  list: [],
  config: {
    size: "default",
    cols: 1,
    hideRequiredAsterisk: false,
    labelWidth: 100,
    labelPosition: "right"
  }
};

export const basicComponents = [
  {
    label: "单行文本",
    type: "input",
    options: {
      width: "100%",
      defaultValue: "",
      placeholder: "",
      maxlength: null,
      prefix: "",
      suffix: "",
      prepend: "",
      append: "",
      disabled: false,
      clearable: false,
      readonly: false,
      showModel: true,
      rules
    }
  },
  {
    label: "数字输入",
    type: "digit",
    options: {
      width: "100%",
      defaultValue: "",
      placeholder: "",
      maxlength: null,
      unit: "",
      precision: 2,
      disabled: false,
      clearable: false,
      readonly: false,
      showModel: true,
      rules
    }
  },
  {
    label: "密码框",
    type: "password",
    options: {
      width: "100%",
      defaultValue: "",
      placeholder: "",
      maxlength: null,
      prefix: "",
      suffix: "",
      prepend: "",
      append: "",
      showPassword: true,
      disabled: false,
      clearable: false,
      readonly: false,
      showModel: true,
      rules
    }
  },
  {
    label: "多行文本",
    type: "textarea",
    options: {
      width: "100%",
      defaultValue: "",
      placeholder: "",
      maxlength: null,
      rows: 4,
      autosize: false,
      showWordLimit: false,
      disabled: false,
      clearable: false,
      readonly: false,
      showModel: true,
      rules
    }
  },
  {
    label: "计数器",
    type: "number",
    options: {
      width: "",
      defaultValue: 0,
      min: 0,
      max: 100,
      step: 1,
      disabled: false,
      showModel: true,
      rules
    }
  },
  {
    label: "单选框组",
    type: "radio",
    options: {
      defaultValue: "",
      width: "",
      inline: true,
      remote: false,
      showLabel: false,
      remoteFunc: "https://mock/mock.json",
      options: [
        {
          value: "Option 1",
          label: "Option 1"
        },
        {
          value: "Option 2",
          label: "Option 2"
        },
        {
          value: "Option 3",
          label: "Option 3"
        }
      ],
      remoteOptions: [],
      props: {
        value: "value",
        label: "label"
      },
      disabled: false,
      showModel: true,
      rules
    }
  },
  {
    label: "多选框组",
    type: "checkbox",
    options: {
      defaultValue: [],
      width: "",
      inline: true,
      remote: false,
      showLabel: false,
      remoteFunc: "https://mock/mock.json",
      options: [
        {
          label: "Option 1",
          value: "Option 1"
        },
        {
          label: "Option 2",
          value: "Option 2"
        },
        {
          label: "Option 3",
          value: "Option 3"
        }
      ],
      remoteOptions: [],
      props: {
        value: "value",
        label: "label"
      },
      disabled: false,
      showModel: true,
      rules
    }
  },
  {
    label: "时间选择器",
    type: "time",
    options: {
      defaultValue: "",
      width: "",
      placeholder: "请选择时间",
      format: "HH:mm:ss",
      valueFormat: "HH:mm:ss",
      readonly: false,
      editable: true,
      clearable: true,
      disabled: false,
      showModel: true,
      rules
    }
  },
  {
    label: "日期选择器",
    type: "date",
    options: {
      selectType: {
        typeValue: "date",
        options: [
          {
            label: "年",
            value: "year"
          },
          {
            label: "年-月",
            value: "month"
          },
          {
            label: "年-月-日",
            value: "date"
          }
        ],
        props: {
          value: "value",
          label: "label"
        }
      },
      defaultValue: "",
      width: "100%",
      placeholder: "请选择时间",
      format: "YYYY-MM-DD",
      valueFormat: "YYYY-MM-DD",
      readonly: false,
      editable: true,
      clearable: true,
      disabled: false,
      showModel: true,
      rules
    }
  },
  {
    label: "评分",
    type: "rate",
    options: {
      defaultValue: 0,
      max: 5,
      allowHalf: false,
      disabled: false,
      showModel: true,
      rules
    }
  },
  {
    label: "下拉选择框",
    type: "select",
    options: {
      defaultValue: "",
      width: "200px",
      multiple: false,
      placeholder: "",
      remote: false,
      showLabel: false,
      filterable: false,
      clearable: false,
      disabled: false,
      props: {
        label: "label",
        value: "value"
      },
      options: [
        {
          label: "Option 1",
          value: "Option 1"
        },
        {
          label: "Option 2",
          value: "Option 2"
        },
        {
          label: "Option 3",
          value: "Option 3"
        }
      ],
      remoteOptions: [],
      remoteFunc: "https://mock/mock.json",
      showModel: true,
      rules
    }
  },
  {
    label: "开关",
    type: "switch",
    options: {
      defaultValue: false,
      disabled: false,
      activeText: "",
      inactiveText: "",
      showModel: true,
      rules
    }
  },
  {
    label: "滑块",
    type: "slider",
    options: {
      defaultValue: 0,
      width: "",
      min: 0,
      max: 100,
      step: 1,
      disabled: false,
      range: false,
      showModel: true,
      rules
    }
  },
  {
    label: "分割线",
    type: "divider",
    labelName: false,
    options: {
      showModel: true,
      contentPosition: "center",
      borderStyle: "solid",
      defaultValue: "This is a divider"
    }
  },
  {
    label: "文字",
    type: "text",
    options: {
      showModel: true,
      defaultValue: "This is a text"
    }
  },
  {
    label: "按钮",
    type: "button",
    options: {
      showModel: true,
      type: "primary",
      defaultValue: "This is a button"
    }
  }
];

export const advanceComponents = [
  {
    label: "图片",
    type: "img-upload",
    options: {
      defaultValue: [],
      name: "file",
      action: "http://example.com/upload",
      method: "post",
      listType: "text",
      accept: "image/*",
      limit: 3,
      multiple: false,
      disabled: false,
      showModel: true,
      rules
    }
  },
  // {
  //   label: '富文本编辑器',
  //   type: 'richtext-editor',
  //   options: {
  //     defaultValue: '',
  //     width: '',
  //     disabled: false
  //   }
  // },
  {
    label: "级联选择器",
    type: "cascader",
    options: {
      defaultValue: [],
      width: "200px",
      placeholder: "",
      disabled: false,
      clearable: false,
      filterable: false,
      remote: true,
      remoteOptions: [],
      props: {
        label: "label",
        value: "value",
        children: "children"
      },
      remoteFunc: "https://mock/mock.json",
      showModel: true,
      rules
    }
  },
  {
    label: "时间序列",
    type: "tableTimeline",
    options: {
      width: "100%",
      labelLimit: false,
      limit: false,
      daterange: [],
      daterangeModal: [],
      valueFormat: "YYYY-MM-DD",
      selectUnit: {
        unitValue: "",
        options: [
          {
            label: "%",
            value: "%"
          },
          {
            label: "kj/kwh",
            value: "kj/kwh"
          },
          {
            label: "万千瓦时",
            value: "万千瓦时"
          },
          {
            label: "自定义输入",
            value: "自定义输入"
          }
        ],
        props: {
          value: "value",
          label: "label"
        }
      },
      columns: [
        {
          label: "时间节点",
          prop: "date",
          slot: "date"
        },
        {
          label: "数值",
          prop: "num",
          slot: "input",
          headerSlot: "numHeader"
        },
        {
          label: "单位",
          prop: "unitValue",
          slot: "unitValue"
        },
        {
          label: "操作",
          prop: "operation",
          // fixed: "right",
          // width: 90,
          slot: "operation"
        }
      ],
      select: {
        selectValue: "input",
        options: [
          {
            label: "选择指标",
            value: "model"
          },
          {
            label: "自定义时间",
            value: "input"
          }
        ],
        props: {
          value: "value",
          label: "label"
        }
      },
      radio: {
        radioValue: "year",
        options: [
          {
            value: "year",
            label: "年"
          },
          {
            value: "month",
            label: "月"
          },
          {
            value: "date",
            label: "日"
          }
          // {
          //   value: "season",
          //   label: "季度"
          // }说是暂时先把季度去掉
        ],
        props: {
          value: "value",
          label: "label"
        }
      },
      showModel: true,
      data: [{ id: "1", date: "", num: "" }],
      rules: {
        ...rules,
        type: 'array'
      }
    }
  },
  {
    label: "标签面板",
    type: "tabs",
    list: [
      {
        label: "标签页1",
        name: "tab1",
        list: []
      },
      {
        label: "标签页2",
        name: "tab2",
        list: []
      }
    ],
    options: {
      type: "",
      defaultValue: "tab1",
      showModel: true,
      tabPosition: "top"
    }
  },
  {
    label: "计算公式",
    type: "mathComp",
    options: {
      unit: "",
      formulaEditer: true,
      defaultValue: "公式设置",
      showModel: true,
      mathData: [
        {
          text: "",
          textModel: "",
          marks: [],
          type: 2
        }
      ]
    }
  },
  {
    // 业务组件
    label: "业务组件",
    type: "businessComp",
    options: {
      showModel: true,
      businessEditer: true,
      defaultValue: "业务组件设置"
    }
  }
  // {
  //   label: "指标组组件",
  //   type: "drawdown",
  //   list: [
  //     {
  //       label: "指标组1",
  //       name: "drawdown1",
  //       list: []
  //     },
  //   ],
  //   options: {
  //     type: "",
  //     expandIconPosition: "left",
  //     defaultValue: "drawdown1",
  //     showModel: true,
  //     tabPosition: "top"
  //   }
  // },
];

export const layoutComponents = [
  {
    label: "栅格布局",
    type: "grid",
    list: [
      {
        span: 12,
        list: []
      },
      {
        span: 12,
        list: []
      }
    ],
    options: {
      gutter: 0,
      justify: "start",
      showModel: true,
      align: "top"
    }
  }
];
