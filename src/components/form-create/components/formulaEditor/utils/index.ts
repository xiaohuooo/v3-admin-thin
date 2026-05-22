/**
 * @description 生成uuid
 * @returns
 */
export const uuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/** 将菜单树形结构扁平化为一维数组，用于菜单查询 */
export function flatTree(arr, defaultProps = {
  children: 'children',
  filterKey: 'functionName'
},) {
  const res = [];
  // 过滤掉没有handler的
  function deep(arr) {
    arr.forEach(item => {
      if (item[defaultProps['filterKey']]) {
        res.push(item);
      }
      item[defaultProps['children']] && deep(item[defaultProps['children']]);
    });
  }
  deep(arr);
  return res;
}

function generateRandomString(length) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }
  return result
}

function generateRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function generateRandomArray(length, min, max) {
  const result = []
  for (let i = 0; i < length; i++) {
    result.push(generateRandomNumber(min, max))
  }
  return result
}

export function generateRandomData(dataType, options) {
  const { length = 10, min = 0, max = 100 } = options || {}
  // ["digit", "date", "tableTimeline", "mathComp"]
  switch (dataType) {
    case 'date':
      return new Date()
    case 'digit':
      return generateRandomNumber(min, max)
    case 'mathComp':
      return generateRandomNumber(min, max)
    case 'tableTimeline':
      return generateRandomArray(length, min, max)
    default:
      return generateRandomNumber(min, max)
  }
}
