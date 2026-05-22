export interface VariableItem {
  label: string
  value: string
  desc?: string
  [key: string]: any
}

export interface MathItem {
  functionName: string
  handler?: (...arg: any[]) => any
  desc?: string
  usage?: string
  example?: string
  children?: MathItem[]
  [key: string]: any
}
