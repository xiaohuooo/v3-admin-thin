import { addDialog, closeDialog } from "@/components/ReDialog";
import { deviceDetection } from "@pureadmin/utils";
import { ref, reactive, h } from "vue";
import formulaEditor from "@/components/form-create/components/formulaEditor/index.vue";
import ElGenerateForm from "@/components/form-create/core/element/ElGenerateForm.vue";
import { uuid, flatTree } from "./utils/index";
import { VARIABLE_REG } from "./utils/formula";

export function useModelConfig(data?: object) {
  const generateFormSelect = ref({});
  const selectedGenerates = reactive(new Set())
  const formulaRef = ref(null);
  function handleView(row) {
    const defaultProps = {
      children: "list",
      filterKey: "model"
    };
    const flatList = flatTree(
      JSON.parse(JSON.stringify(row.widgetForm.list)),
      defaultProps
    );
    console.log(flatList);
    // widgetForm 树形结构数据过滤
    const filterWidgetForm = (nodes, bList = [row.widgetFormSelect.key]) => {
      return nodes.filter(item => {
        return !bList.includes(item.key)
      }).map(item => {
        item = Object.assign({}, item)
        if (item.list) {
          item.list = filterWidgetForm(item.list, bList)
        }
        return item
      })

    };
    function chores(options, index) {
      const result = formulaRef?.value.getResult()
      if (result.error) {
        // return
      }
      const textModel = formulaRef?.value.codeValue
      const mathData = [
        {
          text: result.text,
          textModel,
          marks: result.marks,
          type: result.type,
        }
      ]
      row.callBack && row.callBack(mathData)
      closeDialog(options, index, { command: "cancel" });
    }
    addDialog({
      props: {},
      title: row.title,
      titleTip: row.tip,
      fullscreen: deviceDetection(),
      fullscreenIcon: true,
      closeOnClickModal: false,
      hideFooter: true,
      contentRenderer: ({ options, index }) =>
        h(formulaEditor, {
          type: "view",
          variables: flatList,
          oldVariables: row.widgetForm.variables,
          ref: formulaRef,
          disabled: row.disabled || false,
          modelValue: row.widgetFormSelect.options.mathData[0]?.textModel,
          onCancel: () => {
            closeDialog(options, index, { command: "cancel" });
          },
          onSure: () => {
            chores(options, index)
          },
          onOpen: () => {
            console.log(row.widgetForm, "=======嘿嘿row.widgetForm");
            addDialog({
              props: {
                data: { ...row.widgetForm, list: row.widgetForm.list },
                type: "select",
                readonly: true,
                search: true,
                multiSelectMode: true,
                style: { height: '500px', padding: "5px", overflowY: 'scroll' },
                selectFields: ["digit", "date", "tableTimeline", "mathComp", "select"]
              },
              title: `设置变量`,
              contentRenderer: ({ options, index }) => (
                h(ElGenerateForm, {
                  generateFormSelect: generateFormSelect.value,
                  selectedGenerates,
                  // 定位
                  scrollTo: row.widgetFormSelect,
                  onGenerateSelect: val => {
                    // console.log(val, "选完以后？");
                    generateFormSelect.value = val;
                  },
                  onToggleSelection: val => {
                    if (selectedGenerates.has(val.model)) {
                      selectedGenerates.delete(val.model);
                    } else {
                      selectedGenerates.add(val.model);
                    }
                  }

                })
              ),
              beforeSure: done => {
                function chores() {
                  done(); // 关闭弹框
                  const selectedKeys = Array.from(selectedGenerates);
                  if (selectedKeys.length) {
                    const text = selectedKeys.map(item => {
                      return '${' + item + '}'
                    }).join()
                    formulaRef?.value.insertValue(
                      text
                    );
                    selectedGenerates.clear()
                    // return
                  }
                  // if (!generateFormSelect.value) {
                  //   return
                  // }
                  // formulaRef?.value.insertVariables(
                  //   generateFormSelect.value.model
                  // );
                  // generateFormSelect.value = {};
                }
                chores();
              }
            });
          }
        }),

      beforeSure: done => {
      }
    });
  }
  return {
    handleView
  };
}
