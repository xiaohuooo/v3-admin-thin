<template>
  <el-dialog
    v-model="dialogVisible"
    :title="title"
    width="800px"
    :before-close="handleClose"
    @open="handleOpen"
  >
    <el-form
      :model="publishForm"
      label-width="auto"
      ref="publishFormRef"
      :rules="rules"
    >
      <el-form-item label="业务组件名称" prop="name">
        <el-input v-model="publishForm.name" placeholder="请输入业务组件名称" />
      </el-form-item>
      <!-- 标签 -->
      <el-form-item label="标签" prop="label">
        <el-input-tag
          v-model="publishForm.label"
          placeholder="请输入标签"
          collapse-tags
          collapse-tags-tooltip
          :max-collapse-tags="2"
          clearable
          style="width: 100%"
        />
        <div class="mt-2 w-full">
          <el-input placeholder="请输入搜索内容" v-model="searchText" clearable>
            <template #suffix>
              <el-icon class="el-input__icon">
                <IconifyIconOffline icon="ri/search-line" />
              </el-icon>
            </template>
          </el-input>
          <el-scrollbar height="60px">
            <div class="flex gap-2 flex-wrap mt-2">
              <el-check-tag
                type="primary"
                :checked="publishForm.label.includes(item)"
                v-for="item in filteredScopeOptions"
                :key="item"
                @change="onTagChange(item)"
                >{{ item }}</el-check-tag
              >
            </div>
          </el-scrollbar>
        </div>
      </el-form-item>
      <!-- 是否保留原始id -->
      <!-- <el-form-item label="是否保留原始id" prop="keepOriginalId">
        <el-radio-group
          v-model="publishForm.keepOriginalId"
          @change="handleKeepOriginalIdChange"
        >
          <el-radio :label="true">是</el-radio>
          <el-radio :label="false">否</el-radio>
        </el-radio-group>
      </el-form-item> -->
      <el-form-item label="业务组件目录" prop="folderId">
        <el-popover
          ref="popoverRef"
          placement="bottom-start"
          :width="300"
          trigger="click"
          popper-class="tree-select-popover"
        >
          <template #reference>
            <el-input
              :model-value="folderNamePath || ''"
              placeholder="请选择业务组件目录"
              readonly
              clearable
              style="width: 100%"
              @clear="publishForm.folderId = ''"
            >
              <template #suffix>
                <el-icon class="el-input__icon">
                  <ArrowDown />
                </el-icon>
              </template>
            </el-input>
          </template>
          <el-tree
            :data="treeDataWithPath"
            :props="{ children: 'children', label: 'name' }"
            node-key="id"
            :highlight-current="true"
            :default-expand-all="false"
            :default-expanded-keys="defaultExpandedKeys"
            :expand-on-click-node="false"
            @node-click="handleTreeNodeClick"
          />
        </el-popover>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="previewVisible = true">预览</el-button>
      <el-button type="primary" @click="handlePublish">确认</el-button>
      <el-button @click="handleClose">取消</el-button>
    </template>
  </el-dialog>
  <el-dialog v-model="previewVisible" title="预览" :width="800">
    <div class="h-[500px] overflow-y-auto">
      <ElGenerateForm
        v-if="previewVisible"
        ref="generateFormRef"
        :data="selectedWidgetForm"
        :resetRules="true"
      />
    </div>

    <template #footer>
      <el-button @click="handleTarget('ModelMind')">导图</el-button>
      <el-button @click="handleTarget('modelGraph')">图谱</el-button>
      <el-button type="primary" @click="previewVisible = false">关闭</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from "vue";
import ElGenerateForm from "./ElGenerateForm.vue";
import { useTreePath, flattenTree } from "./useTreePath";
import { ArrowDown } from "@element-plus/icons-vue";
import { WidgetForm } from "@/components/form-create/config/element";
import { flatTree } from "@/components/form-create/components/formulaEditor/utils/index";
import { ElMessage } from "element-plus";

const props = defineProps({
  title: {
    type: String,
    default: "业务组件发布",
  },
  visible: {
    type: Boolean,
    default: false,
  },
  selectedWidgetForm: {
    type: Object,
    default: () => {},
  },
  widgetForm: {
    type: Object as PropType<WidgetForm>,
    required: true,
  },
  selectedWidgets: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
});

const emit = defineEmits(["update:visible", "confirm", "close"]);
const publishFormRef = ref();
const publishForm = ref({
  name: "",
  label: [],
  folderId: "",
  keepOriginalId: false,
});

const filteredComponents = ref(props.selectedWidgetForm?.list || {});

const versionTreeData = ref([]);
const versionOptions = ref([]);

const previewVisible = ref(false);
const searchText = ref("");
const scopeOptions = ref([]);
const rules = reactive({
  name: [
    { required: true, message: "业务组件名称为必填项", trigger: "change" },
  ],
  label: [
    {
      type: "array",
      required: true,
      message: "标签为必填项",
      trigger: "change",
    },
  ],
  folderId: [{ required: true, message: "目录为必填项", trigger: "change" }],
});

const dialogVisible = computed({
  get: () => props.visible,
  set: (value) => emit("update:visible", value),
});

const filteredScopeOptions = computed(() => {
  if (!searchText.value) {
    return scopeOptions.value;
  }
  return scopeOptions.value.filter((item) =>
    item.toLowerCase().includes(searchText.value.toLowerCase())
  );
});
// 使用 composable 处理路径计算
const { folderNamePath } = useTreePath(
  versionTreeData,
  computed(() => publishForm.value.folderId || "")
);
// 计算属性：处理树数据，确保 id 类型一致，下拉列表使用 name，输入框使用 folderNamePath
const treeDataWithPath = computed(() => {
  if (!versionTreeData.value || versionTreeData.value.length === 0) {
    return [];
  }

  // 递归处理树数据，确保 id 类型一致
  const processTree = (nodes: Array<any>): Array<any> => {
    return nodes.map((node) => {
      return {
        ...node,
        // 确保 id 是字符串类型，与 folderId 保持一致
        id: String(node.id),
        children:
          node.children && node.children.length > 0
            ? processTree(node.children)
            : undefined,
      };
    });
  };

  return processTree(versionTreeData.value);
});
// 获取一级节点的ID（用于默认展开）
function getFirstLevelNodeIds(nodes: Array<any>): Array<string> {
  const ids: Array<string> = [];
  if (!nodes || nodes.length === 0) return ids;

  // 只遍历一级节点，添加到展开列表
  for (const firstLevelNode of nodes) {
    ids.push(String(firstLevelNode.id));
  }
  return ids;
}
// 计算属性：获取默认展开的节点ID（在新增、编辑、复制模式下展开一级节点）
const defaultExpandedKeys = computed(() => {
  // 在新增、编辑、复制模式下都展开一级节点
  return getFirstLevelNodeIds(treeDataWithPath.value);
});

// popover 控制
const popoverRef = ref();

// 处理树节点点击
function handleTreeNodeClick(data: any) {
  publishForm.value.folderId = String(data.id);
  // 关闭 popover
  if (popoverRef.value) {
    popoverRef.value.hide();
  }
}

const handleClose = () => {
  emit("update:visible", false);
  emit("close");
};

const handleConfirm = () => {
  emit("update:visible", false);
  emit("confirm");
};
// 递归复制函数
const filterAndCopyComponents = (list, selectedKeys) => {
  let result = [];

  list.forEach((item) => {
    if (item.list) {
      // 如果是容器组件，递归过滤其子组件
      const filteredChildren = filterAndCopyComponents(item.list, selectedKeys);
      if (filteredChildren.length > 0) {
        // 如果有选中的子组件，复制容器组件并保留过滤后的子组件
        const copiedContainer = { ...item };
        copiedContainer.list = filteredChildren;
        if (copiedContainer.type == "tabs") {
          console.log(filteredChildren[0].name);
          copiedContainer.options.defaultValue = filteredChildren[0].name;
        }
        result.push(copiedContainer);
      }
    } else if (selectedKeys.includes(item.model)) {
      // 如果是选中的普通组件，复制它
      const copiedComponent = { ...item };
      result.push(copiedComponent);
    }
  });

  return result;
};
// const handleKeepOriginalIdChange = (val) => {
//   if (!val) {
//     filteredComponents.value = props.selectedWidgetForm.list;
//     console.log(filteredComponents.value, props.selectedWidgetForm);
//     return;
//   }
//   const selectedKeys = Array.from(props.selectedWidgets);
//   filteredComponents.value = filterAndCopyComponents(
//     props.widgetForm.list,
//     selectedKeys
//   );
//   console.log(filteredComponents.value);
// };

const handlePublish = async () => {
  try {
    await publishFormRef.value.validate();
    const config = {
      ...props.selectedWidgetForm,
      list: filteredComponents.value,
    };
    let params = {
      ...publishForm.value,
      modelConfig: JSON.stringify(config),
    };
    ElMessage.success("发布成功");
    emit("update:visible", false);
    emit("confirm");
  } catch (error) {
    console.log(error);
  }
};

const handleTarget = (type: string) => {
  previewVisible.value = false;
};

// 处理标签点击
function onTagChange(tag: string) {
  console.log(tag);
  if (publishForm.value.label.includes(tag)) {
    publishForm.value.label = publishForm.value.label.filter(
      (item) => item !== tag
    );
  } else {
    publishForm.value.label.push(tag);
  }
}

const init = async () => {
  publishFormRef.value.resetFields();
  filteredComponents.value = props.selectedWidgetForm.list;
};
const handleOpen = () => {
  init();
};
onMounted(() => {});
</script>

<style scoped lang="scss">
</style>
