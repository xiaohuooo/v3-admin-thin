import { ref, watch, type Ref, type ComputedRef } from "vue";



/**
 * 将树形数据扁平化处理
 * @param tree 树形数据
 * @param result 结果数组（递归使用）
 * @param level 当前层级（递归使用）
 * @returns 扁平化后的选项数组
 */
export function flattenTree(
  tree: Array<any>,
  result: Array<{ label: string; value: string }> = [],
  level = 0
): Array<{ label: string; value: string }> {
  tree.forEach((item) => {
    const prefix = "　".repeat(level); // 使用全角空格作为缩进
    result.push({
      label: prefix + item.name,
      value: item.id?.toString() || item.code || "",
    });
    if (item.children && item.children.length > 0) {
      flattenTree(item.children, result, level + 1);
    }
  });
  return result;
}
/**
 * 查找节点及其所有父节点，生成完整路径
 * @param tree 树形数据
 * @param targetId 目标节点ID
 * @param path 当前路径（递归使用）
 * @returns 路径数组，如果未找到返回 null
 */
export function findNodePath(
  tree: Array<any>,
  targetId: string | number,
  path: Array<string> = []
): Array<string> | null {
  for (const node of tree) {
    const currentPath = [...path, node.name];
    if (node.id?.toString() === targetId?.toString()) {
      return currentPath;
    }
    if (node.children && node.children.length > 0) {
      const result = findNodePath(node.children, targetId, currentPath);
      if (result) {
        return result;
      }
    }
  }
  return null;
}

/**
 * 树路径计算 Composable
 * @param treeData 树形数据
 * @param folderId 文件夹ID（ref 或 computed）
 * @returns 路径相关的响应式数据和方法
 */
export function useTreePath(
  treeData: Ref<Array<any>>,
  folderId: Ref<string> | ComputedRef<string>
) {
  const folderNamePath = ref("");

  // 计算路径的函数
  const calculatePath = (id: string | number | null | undefined) => {
    if (!id || !treeData.value || treeData.value.length === 0) {
      folderNamePath.value = "";
      return;
    }

    const path = findNodePath(treeData.value, id);
    if (path && path.length > 0) {
      folderNamePath.value = path.join("/");
    } else {
      folderNamePath.value = "";
    }
  };

  // 监听 folderId 变化
  watch(
    () => folderId.value,
    newId => {
      calculatePath(newId);
    },
    { immediate: true }
  );

  // 监听树数据变化
  watch(
    () => treeData.value,
    () => {
      calculatePath(folderId.value);
    },
    { deep: true, immediate: false }
  );

  return {
    folderNamePath,
    calculatePath
  };
}
