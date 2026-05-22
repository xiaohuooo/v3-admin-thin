import { addDialog, closeDialog } from "@/components/ReDialog";
import { ref, h } from "vue";
import ElGenerateForm from "@/components/form-create/core/element/ElGenerateForm.vue";

export function useElementConfig(data?: object) {
  const generateFormSelect = ref({});
  function handleSelectView(row) {
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
    addDialog({
      props: {
        data: { ...row.widgetForm, list: row.widgetForm.list },
        type: "select",
        readonly: true,
        search: true,
        style: { height: '500px', padding: "5px", overflowY: 'scroll' },
        selectFields: ["date"]
      },
      title: row.title,
      contentRenderer: ({ options, index }) => (
        h(ElGenerateForm, {
          generateFormSelect: generateFormSelect.value,
          onGenerateSelect: val => {
            console.log(val, "选完以后？");
            generateFormSelect.value = val;
          }
        })
      ),
      beforeSure: done => {
        function chores() {
          done(); // 关闭弹框
          row.callBack(generateFormSelect.value)
          generateFormSelect.value = [];
        }
        chores();
      }
    });
  }
  function businessSelectView({ callBack }) {
  }
  return {
    handleSelectView,
    businessSelectView
  };
}
