import { type MathItem } from '../interfaces'

import { FORMULA_MATHS } from './math'
import { uuid } from './index'

const isStrBrackets = (val: string) => /[\'\"]{1}/.test(val)

// 变量正则
export const VARIABLE_REG = /\$\{(.*?)\}/g

/**
 * @desc 检查符号是否关闭
 * @param content
 * @returns
 */
export const isCloseBrackets = (content: string) => {
  const brackets = [
    ['{', '}'],
    ['[', ']'],
    ['(', ')']
  ]
  const contentArr = content.split('')
  if (!contentArr.length) {
    return true
  }
  const bracketObj: { [key: string]: number } = {}
  const bracketLeft: string[] = []
  const bracketRight: string[] = []

  for (let i = 0; i < brackets.length; i++) {
    const [left, right] = brackets[i]
    bracketObj[left] = i + 1
    bracketObj[right] = -(i + 1)
    bracketLeft.push(left)
    bracketRight.push(right)
  }
  const stack = []
  for (let i = 0; i < contentArr.length; i++) {
    const item = contentArr[i]
    const current: number | undefined = bracketObj[item]
    if (!current) {
      continue
    }
    // 当这个符号作为字符串是跳过
    if (i > 0 && isStrBrackets(contentArr[i - 1]) && isStrBrackets(contentArr[i + 1])) {
      continue
    }
    if (bracketLeft.includes(item)) {
      stack.push(current)
    } else if (bracketRight.includes(item)) {
      const stackLen = stack.length
      // 是否对值匹配
      if (stackLen > 0 && stack[stackLen - 1] + current === 0) {
        stack.pop()
      } else {
        stack.push(current)
      }
    }
  }
  return stack.length === 0
}

/**
 * @desc 函数计算
 * @param formula 公式内容
 * @param variableHandler 变量处理, 用来取变量所在formulaSope中的值 返回示例 ['id']['d'][0] 则取formulaSope['id']['d'][0]的值
 * @param formulaSope 必填，变量处理通过链的方式取出参数
 * @param formulaMaths 非必填，函数处理
 * @returns
 */
export const evalFormula = (
  formula: string,
  variableHandler: (variable: any) => string,
  variableData: Record<string, any>,
  mathList: MathItem[] = FORMULA_MATHS
) => {
  const isPass = isCloseBrackets(formula)
  if (!isPass) {
    throw ('括号不匹配')
  }
  const formulaMaths: Record<string, (...arg: any[]) => any> = {}
  const nameList: string[] = mathList.map(item => {
    const { functionName, handler } = item
    formulaMaths[functionName] = handler || (() => 1)
    return functionName
  })
  // 函数正则
  const MATH_REG = new RegExp(`\\b(${nameList.join('|')})\\b`, 'g')

  // 检查日期变量是否在数学函数外使用
  let dateVariables: string[] = []
  //    {
  //     "digit_f03f7008aa4e472b887c514b8fbadaca": 100,
  //     "date_d721bcb1c27d4572a670e020aae6bee6": "2026-03-10T08:57:37.875Z"
  // }
  // 提取所有日期变量
  dateVariables = Object.keys(variableData).filter(key => key.startsWith('date_'))
  // 提取数字类型变量
  const digitVariables = Object.keys(variableData).filter(key => key.startsWith('digit_'))

  // 检查日期变量是否在数学函数外使用
  if (dateVariables.length > 0 && digitVariables.length > 0) {
    const mathFunctionRegex = new RegExp(`\\b(${nameList.join('|')})\\s*\\(`, 'g')
    const mathFunctionMatches = formula.match(mathFunctionRegex) || []

    for (const dateVar of dateVariables) {
      const dateVarRegex = new RegExp(`\\$\\{${dateVar}\\}`, 'g')
      const dateVarMatches = formula.match(dateVarRegex) || []

      for (const match of dateVarMatches) {
        const matchIndex = formula.indexOf(match)
        let isWithinMathFunction = false

        // 检查该日期变量是否在数学函数内
        for (const mathMatch of mathFunctionMatches) {
          const mathIndex = formula.indexOf(mathMatch)
          // 找到匹配的右括号
          let openParens = 1
          let closeIndex = mathIndex + mathMatch.length
          while (openParens > 0 && closeIndex < formula.length) {
            if (formula[closeIndex] === '(') openParens++
            if (formula[closeIndex] === ')') openParens--
            closeIndex++
          }

          if (matchIndex > mathIndex && matchIndex < closeIndex) {
            isWithinMathFunction = true
            break
          }
        }

        if (!isWithinMathFunction) {
          throw `日期变量必须使用时间函数（如YEAR）进行处理后才能和数字变量计算`
        }
      }
    }
  }

  try {
    // 执行一次随机变量才可访问
    const mock_variable = variableData && variableData[uuid()]
    const mock_math = formulaMaths && formulaMaths[uuid()]
    // 处理变量
    let evalFormula = formula.replace(VARIABLE_REG, (match, p1) => {
      return 'variableData' + variableHandler(p1.split('_')[1])
    })
    // 处理函数
    evalFormula = evalFormula.replace(MATH_REG, match => {
      return `formulaMaths['${match}']`
    })
    // 处理Excel = 等于运算符转换为JavaScript ==
    evalFormula = evalFormula.replace(/(?<![<>=!\s])=(?!=)/g, '==')
    // 处理Excel <>不等于运算符转换为JavaScript !== 
    evalFormula = evalFormula.replace(/<>/g, '!==')
    // 处理Excel : 范围运算符（将A:B转换为数组访问）
    evalFormula = evalFormula.replace(/:/g, ',')
    // 去掉#
    evalFormula = evalFormula.replace(/#/g, '')
    // 去掉@
    evalFormula = evalFormula.replace(/@/g, '')
    // ,, 替换成 ,
    evalFormula = evalFormula.replace(/,,/g, ',')

    const result = eval(evalFormula)
    return result
  } catch (error) {
    console.log(error, '--error');
    throw '请检查公式'
  }
}
