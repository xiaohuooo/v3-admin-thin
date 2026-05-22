<template>
  <div class="calculator">
    <el-scrollbar class="scrollbar">
      <div class="calculator-display">
        <div class="calculator-label">计算符号:</div>
        <div class="display-row">
          <div
            class="row-item"
            v-for="(item, index) in fuHao"
            :key="index"
            @click="calculatorClick('display', item)"
          >
            {{ item }}
          </div>
        </div>
      </div>
      <div class="calculator-keypad">
        <div class="calculator-label">数字键盘:</div>
        <div class="keypad-row">
          <div
            :class="['row-item', { 'zero-item': item == 0 }]"
            v-for="(item, index) in number"
            :key="index"
            @click="calculatorClick('keypad', item)"
          >
            {{ item }}
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";

const emit = defineEmits("calculatorClick");
// 计算符号定义
const fuHao = ["+", "-", "*", "/", ">", "<", "(", ")", "="];
// 数字键盘定义
const number = ["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."];

const calculatorClick = (type: String, item: String) => {
  emit("calculatorClick", item, type);
};
</script>
<style lang="scss" scoped>
.calculator {
  display: inline-block;
  width: 50%;
  .calculator-label {
    font-size: 14px;
    flex-shrink: 0;
  }
  .calculator-display,
  .calculator-keypad {
    display: flex;
    gap: 10px;
  }
  .display-row,
  .keypad-row {
    .row-item {
      display: inline-block;
      width: 25px;
      height: 25px;
      text-align: center;
      line-height: 25px;
      background: #f2f3f5;
      color: #4e5969;
      margin: 0 10px 10px 0;
      cursor: pointer;
      &.zero-item {
        width: 60px;
      }
      &:hover {
        background-color: rgb(218, 219, 217);
      }
    }
  }
}
</style>
