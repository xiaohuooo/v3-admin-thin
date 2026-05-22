<template>
  <el-form v-if="data" :key="data.key" label-position="top">
    <el-form-item v-if="data.type !== 'grid'">
      <template #label>
        <div class="w-[calc(var(--el-aside-width)-25px)] flex justify-between">
          <span>字段标识</span>
          <span class="bg-gray-50 px-[5px]">{{ labelName(data.type) }}</span>
        </div>
      </template>
      <el-input disabled :value="data.model" />
    </el-form-item>

    <el-form-item
      v-if="!['grid', 'tabs', 'divider'].includes(data.type)"
      label="标题"
    >
      <el-input v-model="data.label" />
    </el-form-item>

    <el-form-item v-if="hasKey('width')" label="宽度">
      <el-input v-model="data.options.width" />
    </el-form-item>

    <el-form-item v-if="hasKey('placeholder')" label="占位内容">
      <el-input v-model="data.options.placeholder" />
    </el-form-item>

    <el-form-item
      v-if="
        hasKey('defaultValue') &&
        [
          'input',
          'digit',
          'password',
          'textarea',
          'text',
          'rate',
          'switch',
          'slider',
          'button',
          'divider',
        ].includes(data.type)
      "
      label="默认内容"
    >
      <el-input
        v-if="
          ['input', 'digit', 'password', 'text', 'button', 'divider'].includes(
            data.type
          )
        "
        v-model="data.options.defaultValue"
      />
      <el-input
        v-if="data.type === 'textarea'"
        v-model="data.options.defaultValue"
        type="textarea"
      />
      <el-rate
        v-if="data.type === 'rate'"
        v-model="data.options.defaultValue"
        :max="data.options.max"
        :allowHalf="data.options.allowHalf"
      />
      <el-switch
        v-if="data.type === 'switch'"
        v-model="data.options.defaultValue"
      />
      <template v-if="data.type === 'slider'">
        <el-input-number
          v-if="!data.options.range"
          v-model.number="data.options.defaultValue"
        />
        <template v-if="data.options.range">
          <el-input-number
            v-model.number="data.options.defaultValue[0]"
            :max="data.options.max"
          />
          <el-input-number
            v-model.number="data.options.defaultValue[1]"
            :max="data.options.max"
          />
        </template>
      </template>
    </el-form-item>

    <el-form-item v-if="hasKey('maxlength')" label="最大长度">
      <el-input v-model.number="data.options.maxlength" />
    </el-form-item>

    <el-form-item v-if="hasKey('max')" label="最大值">
      <el-input-number v-model.number="data.options.max" />
    </el-form-item>

    <el-form-item v-if="hasKey('min')" label="最小值">
      <el-input-number v-model.number="data.options.min" />
    </el-form-item>

    <el-form-item v-if="hasKey('step')" label="步长">
      <el-input-number v-model.number="data.options.step" :min="0" />
    </el-form-item>

    <el-form-item v-if="hasKey('unit')" label="单位">
      <el-input v-model="data.options.unit" />
    </el-form-item>

    <el-form-item v-if="hasKey('precision')" label="小数位数">
      <el-input-number
        v-model.number="data.options.precision"
        :min="0"
        :max="10"
      />
    </el-form-item>

    <el-form-item v-if="hasKey('prefix')" label="前缀">
      <el-input v-model="data.options.prefix" />
    </el-form-item>

    <el-form-item v-if="hasKey('suffix')" label="后缀">
      <el-input v-model="data.options.suffix" />
    </el-form-item>

    <el-form-item v-if="hasKey('prepend')" label="前置标签">
      <el-input v-model="data.options.prepend" />
    </el-form-item>

    <el-form-item v-if="hasKey('append')" label="后置标签">
      <el-input v-model="data.options.append" />
    </el-form-item>

    <el-form-item v-if="hasKey('activeText')" label="选中时的内容">
      <el-input v-model="data.options.activeText" />
    </el-form-item>

    <el-form-item v-if="hasKey('inactiveText')" label="非选中时的内容">
      <el-input v-model="data.options.inactiveText" />
    </el-form-item>

    <el-form-item v-if="hasKey('editable')" label="文本框可输入">
      <el-switch v-model="data.options.editable" />
    </el-form-item>

    <el-form-item v-if="hasKey('range')" label="范围选择">
      <el-switch
        v-model="data.options.range"
        @change="handleSliderModeChange"
      />
    </el-form-item>

    <el-form-item v-if="hasKey('showPassword')" label="是否显示切换按钮">
      <el-switch v-model="data.options.showPassword" />
    </el-form-item>

    <el-form-item v-if="hasKey('showWordLimit')" label="是否显示字数">
      <el-switch v-model="data.options.showWordLimit" />
    </el-form-item>

    <el-form-item v-if="hasKey('autosize')" label="是否自适应内容高度">
      <el-switch v-model="data.options.autosize" />
    </el-form-item>

    <el-form-item v-if="hasKey('rows') && !data.options.autosize" label="行数">
      <el-input-number v-model="data.options.rows" :min="0" />
    </el-form-item>

    <el-form-item v-if="hasKey('allowHalf')" label="是否允许半选">
      <el-switch v-model="data.options.allowHalf" />
    </el-form-item>

    <el-form-item v-if="hasKey('inline')" label="布局方式">
      <el-radio-group v-model="data.options.inline">
        <el-radio-button :label="true">行内</el-radio-button>
        <el-radio-button :label="false">块级</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item v-if="hasKey('multiple')" label="是否多选">
      <el-switch
        v-model="data.options.multiple"
        @change="handleSelectModeChange"
      />
    </el-form-item>

    <el-form-item v-if="hasKey('filterable')" label="是否可搜索">
      <el-switch v-model="data.options.filterable" />
    </el-form-item>

    <el-form-item v-if="hasKey('showLabel')" label="是否显示标签">
      <el-switch v-model="data.options.showLabel" />
    </el-form-item>

    <el-form-item v-if="hasKey('contentPosition')" label="文本位置">
      <el-radio-group v-model="data.options.contentPosition">
        <el-radio-button label="left">左边</el-radio-button>
        <el-radio-button label="center">中间</el-radio-button>
        <el-radio-button label="right">右边</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item v-if="hasKey('borderStyle')" label="分隔符样式">
      <el-radio-group v-model="data.options.borderStyle">
        <el-radio-button label="solid">实线</el-radio-button>
        <el-radio-button label="dashed">虚线</el-radio-button>
      </el-radio-group>
    </el-form-item>

    <el-form-item v-if="hasKey('options')" label="选项">
      <el-radio-group v-model="data.options.remote">
        <el-radio-button :label="false">静态数据</el-radio-button>
        <el-radio-button :label="true">远端数据</el-radio-button>
      </el-radio-group>
      <el-space
        v-if="data.options.remote"
        alignment="start"
        direction="vertical"
        style="margin-top: 10px"
      >
        <el-input v-model="data.options.remoteFunc">
          <template #prepend> 远端方法 </template>
        </el-input>
        <el-input v-model="data.options.props.label">
          <template #prepend> 标签 </template>
        </el-input>
        <el-input v-model="data.options.props.value">
          <template #prepend> 值 </template>
        </el-input>
      </el-space>
      <template v-else>
        <template
          v-if="
            data.type === 'radio' ||
            (data.type === 'select' && !data.options.multiple)
          "
        >
          <el-radio-group
            v-model="data.options.defaultValue"
            style="margin-top: 8px"
          >
            <Draggable
              tag="ul"
              item-key="index"
              ghostClass="ghost"
              handle=".drag-item"
              :group="{ name: 'options' }"
              :list="data.options.options"
            >
              <template #item="{ element, index }">
                <div
                  style="display: flex; align-items: center; margin-bottom: 5px"
                >
                  <el-radio
                    :value="element.value"
                    style="margin-right: 0; margin-bottom: 0"
                  >
                    <el-input
                      v-model="element.value"
                      :style="{
                        width: data.options.showLabel ? '90px' : '180px',
                      }"
                    />
                    <el-input
                      v-if="data.options.showLabel"
                      v-model="element.label"
                      :style="{
                        width: '90px',
                      }"
                    />
                  </el-radio>
                  <SvgIcon
                    style="margin: 0 5px; cursor: move"
                    iconClass="item"
                    className="drag-item"
                  />
                  <el-button
                    type="primary"
                    circle
                    @click="handleOptionsRemove(index)"
                  >
                    <SvgIcon iconClass="delete" />
                  </el-button>
                </div>
              </template>
            </Draggable>
          </el-radio-group>
        </template>

        <template
          v-if="
            data.type === 'checkbox' ||
            (data.type === 'select' && data.options.multiple)
          "
        >
          <el-checkbox-group
            v-model="data.options.defaultValue"
            style="margin-top: 8px"
          >
            <Draggable
              tag="ul"
              item-key="index"
              ghostClass="ghost"
              handle=".drag-item"
              :group="{ name: 'options' }"
              :list="data.options.options"
            >
              <template #item="{ element, index }">
                <li
                  style="display: flex; align-items: center; margin-bottom: 5px"
                >
                  <el-checkbox
                    :label="element.value"
                    style="margin-right: 0; margin-bottom: 0"
                  >
                    <el-input
                      v-model="element.value"
                      :style="{
                        width: data.options.showLabel ? '90px' : '180px',
                      }"
                    />
                    <el-input
                      v-if="data.options.showLabel"
                      v-model="element.label"
                      :style="{ width: '90px' }"
                    />
                  </el-checkbox>
                  <SvgIcon
                    style="margin: 0 5px; cursor: move"
                    iconClass="item"
                    className="drag-item"
                  />
                  <el-button
                    type="primary"
                    circle
                    @click="handleOptionsRemove(index)"
                  >
                    <SvgIcon iconClass="delete" />
                  </el-button>
                </li>
              </template>
            </Draggable>
          </el-checkbox-group>
        </template>

        <div style="margin-top: 5px">
          <el-button type="text" @click="handleInsertOption"
            >添加选项</el-button
          >
        </div>
      </template>
    </el-form-item>

    <template v-if="data.type === 'time'">
      <el-form-item label="默认值">
        <el-time-picker
          v-model="data.options.defaultValue"
          style="width: 100%"
          :format="data.options.format"
          :placeholder="data.options.placeholder"
        />
      </el-form-item>
    </template>

    <template v-if="data.type === 'date'">
      <el-form-item label="默认值">
        <el-date-picker
          v-model="data.options.defaultValue"
          style="width: 100%"
          :format="data.options.format"
          :placeholder="data.options.placeholder"
        />
      </el-form-item>
      <el-form-item label="单位">
        <el-select
          v-model="data.options.selectType.typeValue"
          placeholder="Select"
        >
          <el-option
            v-for="item in data.options.selectType.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
    </template>

    <template v-if="data.type === 'time'">
      <el-form-item label="格式">
        <el-input v-model="data.options.format" />
      </el-form-item>
    </template>

    <template v-if="data.type === 'img-upload'">
      <el-form-item label="模式">
        <el-radio-group v-model="data.options.listType">
          <el-radio-button label="text">text</el-radio-button>
          <el-radio-button label="picture">picture</el-radio-button>
          <el-radio-button label="picture-card">picture-card</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="文件参数名">
        <el-input v-model="data.options.name" />
      </el-form-item>

      <el-form-item label="上传地址">
        <el-input v-model="data.options.action" />
      </el-form-item>

      <el-form-item label="接受上传的文件类型(多个使用 , 隔开)">
        <el-input v-model="data.options.accept" />
      </el-form-item>

      <el-form-item label="最大上传数量">
        <el-input-number v-model.number="data.options.limit" :min="1" />
      </el-form-item>

      <el-form-item label="上传请求方法">
        <el-radio-group v-model="data.options.method">
          <el-radio-button label="post">POST</el-radio-button>
          <el-radio-button label="put">PUT</el-radio-button>
          <el-radio-button label="get">GET</el-radio-button>
          <el-radio-button label="delete">DELETE</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </template>

    <el-form-item v-if="data.type === 'cascader'" label="远端数据">
      <el-space direction="vertical" alignment="start">
        <el-input v-model="data.options.remoteFunc">
          <template #prepend> 远端方法 </template>
        </el-input>
        <el-input v-model="data.options.props.label">
          <template #prepend> 标签 </template>
        </el-input>
        <el-input v-model="data.options.props.value">
          <template #prepend> 值 </template>
        </el-input>
        <el-input v-model="data.options.props.children">
          <template #prepend> 子选项 </template>
        </el-input>
      </el-space>
    </el-form-item>

    <template v-if="data.type === 'grid'">
      <el-form-item label="栅格间隔">
        <el-input-number v-model.number="data.options.gutter" :min="0" />
      </el-form-item>

      <el-form-item label="列配置项">
        <Draggable
          tag="ul"
          item-key="index"
          ghostClass="ghost"
          handle=".drag-item"
          :group="{ name: 'options' }"
          :list="data.list"
        >
          <template #item="{ element, index }">
            <li style="margin-bottom: 5px">
              <SvgIcon iconClass="item" className="drag-item" />
              <el-input-number
                v-model.number="element.span"
                placeholder="栅格值"
                :min="0"
                :max="24"
              />
              <el-button
                type="primary"
                circle
                style="margin-left: 5px"
                @click="handleOptionsRemove(index)"
              >
                <SvgIcon iconClass="delete" />
              </el-button>
            </li>
          </template>
        </Draggable>

        <div>
          <el-button type="text" @click="handleInsertColumn">
            添加列
          </el-button>
        </div>
      </el-form-item>

      <el-form-item label="垂直对齐方式">
        <el-radio-group v-model="data.options.align">
          <el-radio-button label="top">顶部对齐</el-radio-button>
          <el-radio-button label="middle">居中对齐</el-radio-button>
          <el-radio-button label="bottom">底部对齐</el-radio-button>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="水平排列方式">
        <el-select v-model="data.options.justify">
          <el-option value="start" label="左对齐" />
          <el-option value="end" label="右对齐" />
          <el-option value="center" label="居中" />
          <el-option value="space-around" label="两侧间隔相等" />
          <el-option value="space-between" label="两端对齐" />
        </el-select>
      </el-form-item>
    </template>
    <template v-if="data.type === 'tabs'">
      <el-form-item label="风格类型">
        <el-radio-group v-model="data.options.type">
          <el-radio-button value="">默认</el-radio-button>
          <el-radio-button value="card">标签</el-radio-button>
          <el-radio-button value="border-card">边框</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标签位置">
        <el-radio-group v-model="data.options.tabPosition">
          <el-radio-button value="top">顶部</el-radio-button>
          <el-radio-button value="right">右侧</el-radio-button>
          <el-radio-button value="bottom">底部</el-radio-button>
          <el-radio-button value="left">左侧</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标签页配置项">
        <Draggable
          tag="ul"
          item-key="index"
          ghostClass="ghost"
          handle=".drag-item"
          :group="{ name: 'options' }"
          :list="data.list"
        >
          <template #item="{ element, index }">
            <li class="flex items-center" style="margin-bottom: 5px">
              <SvgIcon iconClass="item" className="drag-item" />
              <el-input v-model="element.label" placeholder="标签页" />
              <el-button
                type="primary"
                circle
                style="margin-left: 5px"
                @click="handleOptionsRemove(index)"
              >
                <SvgIcon iconClass="delete" />
              </el-button>
            </li>
          </template>
        </Draggable>

        <div>
          <el-button type="text" @click="handleInsertColumn">
            添加标签页
          </el-button>
        </div>
      </el-form-item>
    </template>
    <template v-if="data.type !== 'grid'">
      <el-form-item
        v-if="
          hasKey('rules') ||
          hasKey('readonly') ||
          hasKey('disabled') ||
          hasKey('allowClear')
        "
        label="操作属性"
      >
        <el-checkbox
          v-if="hasKey('rules')"
          v-model="data.options.rules.required"
          >必填</el-checkbox
        >
        <el-checkbox v-if="hasKey('readonly')" v-model="data.options.readonly"
          >只读</el-checkbox
        >
        <el-checkbox v-if="hasKey('disabled')" v-model="data.options.disabled"
          >禁用</el-checkbox
        >
        <el-checkbox v-if="hasKey('clearable')" v-model="data.options.clearable"
          >清除</el-checkbox
        >
      </el-form-item>

      <!-- <template v-if="hasKey('rules')">
        <el-collapse model-value="1">
          <el-collapse-item title="验证规则" name="1">
            <el-form-item label="触发时机">
              <el-radio-group v-model="data.options.rules.trigger">
                <el-radio-button label="blur">Blur</el-radio-button>
                <el-radio-button label="change">Change</el-radio-button>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="枚举类型">
              <el-input v-model="data.options.rules.enum" />
            </el-form-item>

            <el-form-item label="字段长度">
              <el-input v-model.number="data.options.rules.len" />
            </el-form-item>

            <el-form-item label="最大长度">
              <el-input v-model.number="data.options.rules.max" />
            </el-form-item>

            <el-form-item label="最小长度">
              <el-input v-model.number="data.options.rules.min" />
            </el-form-item>

            <el-form-item label="校验文案">
              <el-input v-model="data.options.rules.message" />
            </el-form-item>

            <el-form-item label="正则表达式">
              <el-input v-model="data.options.rules.pattern" />
            </el-form-item>

            <el-form-item label="校验类型">
              <el-select v-model="data.options.rules.type">
                <el-option value="string">字符串</el-option>
                <el-option value="number">数字</el-option>
                <el-option value="boolean">布尔值</el-option>
                <el-option value="method">方法</el-option>
                <el-option value="regexp">正则表达式</el-option>
                <el-option value="integer">整数</el-option>
                <el-option value="float">浮点数</el-option>
                <el-option value="array">数组</el-option>
                <el-option value="object">对象</el-option>
                <el-option value="enum">枚举</el-option>
                <el-option value="date">日期</el-option>
                <el-option value="url">URL地址</el-option>
                <el-option value="hex">十六进制</el-option>
                <el-option value="email">邮箱地址</el-option>
                <el-option value="any">任意类型</el-option>
              </el-select>
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </template> -->
    </template>
    <template v-if="data.type === 'tableTimeline'">
      <el-form-item label="时间列">
        <el-input
          v-model="data.options.columns[0].label"
          placeholder="时间节点"
          style="margin-bottom: 8px"
        />
        <el-checkbox v-model="data.options.limit" label="限定起止时间范围" />
        <el-radio-group
          v-model="data.options.select.selectValue"
          style="margin: 10px 0 20px"
        >
          <el-radio-button
            v-for="item in data.options.select.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-radio-group>
        <el-date-picker
          v-if="data.options.select.selectValue == 'input'"
          v-model="data.options.daterange"
          type="daterange"
          start-placeholder="Start Date"
          end-placeholder="End Date"
          :valueFormat="data.options.valueFormat"
        />
        <template v-else>
          <el-button
            style="width: 100px"
            @click="
              selectElementDialog({ params: 'daterangeModal', type: 'start' })
            "
            ><span style="width: 100px"
              ><ReText
                :tippyProps="{
                  theme: tooltipEffect,
                }"
                >{{
                  data.options.daterangeModal && data.options.daterangeModal[0]
                    ? data.options.daterangeModal[0].label
                    : "选择开始指标"
                }}</ReText
              ></span
            ></el-button
          >
          <el-button
            style="width: 100px"
            @click="
              selectElementDialog({ params: 'daterangeModal', type: 'end' })
            "
          >
            <span style="width: 100px"
              ><ReText
                :tippyProps="{
                  theme: tooltipEffect,
                }"
                >{{
                  data.options.daterangeModal && data.options.daterangeModal[1]
                    ? data.options.daterangeModal[1].label
                    : "选择结束指标"
                }}</ReText
              ></span
            ></el-button
          >
        </template>
      </el-form-item>

      <!-- <el-form-item label="时间列">
        <el-input
          v-model="data.options.columns[0].label"
          placeholder="时间节点"
        />
      </el-form-item> -->
      <el-form-item label="时间单位">
        <el-radio-group v-model="data.options.radio.radioValue">
          <el-radio
            v-for="item of data.options.radio.options"
            :key="item.value"
            :value="item.value"
          >
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="列名称">
        <el-input v-model="data.options.columns[1].label" />
        <!-- <Draggable
          tag="ul"
          item-key="index"
          ghostClass="ghost"
          handle=".drag-item"
          :group="{ name: 'options' }"
          :list="data.options.columns"
        >
          <template #item="{ element, index }">
            <li class="flex items-center" style="margin-bottom: 5px">
              <SvgIcon iconClass="item" className="drag-item" />
              <el-input v-model="element.label" placeholder="" />
              <el-button
                type="primary"
                circle
                style="margin-left: 5px"
                @click="handleOptionsRemove(index)"
              >
                <SvgIcon iconClass="delete" />
              </el-button>
            </li>
          </template>
        </Draggable> -->

        <!-- <div>
          <el-button type="text" @click="handleInsertColumn">
            添加列
          </el-button>
        </div> -->
      </el-form-item>
      <el-form-item label="单位">
        <el-input v-model="data.options.selectUnit.unitValue" />
        <!-- <el-select
          v-model="data.options.selectUnit.unitValue"
          filterable
          allow-create
          default-first-option
          placeholder="Select"
        >
          <el-option
            v-for="item in data.options.selectUnit.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select> -->
      </el-form-item>
    </template>
    <el-form-item v-if="hasKey('formulaEditer')" label="公式">
      <el-button @click="formulaEditerDialog">公式设置</el-button>
    </el-form-item>
    <el-form-item v-if="hasKey('businessEditer')" label="业务组件">
      <el-button @click="businessSelectDialog">业务组件设置</el-button>
    </el-form-item>
    <el-form-item v-if="hasKey('showModel')" label="字段权限">
      <el-checkbox v-model="data.options.showModel">可见</el-checkbox>
    </el-form-item>
  </el-form>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";
import Draggable from "vuedraggable";
import SvgIcon from "@/components/form-create/components/SvgIcon.vue";
import {
  basicComponents,
  advanceComponents,
  layoutComponents,
} from "@/components/form-create/config/element";
import { ReText } from "@/components/ReText";
import { useNav } from "@/layout/hooks/useNav";

interface Props {
  select?: Record<string, any>;
}

const props = withDefaults(defineProps<Props>(), {
  select: undefined,
});

const emit = defineEmits<{
  "update:select": [value: Record<string, any>];
  dialog: [value: string];
  selectDialog: [value: string];
  businessDialog: [value: string];
}>();

const data = ref<Record<string, any>>(props.select);
const { tooltipEffect } = useNav();
watch(
  () => props.select,
  (val) => (data.value = val)
);

watch(data, (val) => emit("update:select", val), { deep: true });

const hasKey = (key: string) => Object.keys(data.value.options).includes(key);

const handleInsertColumn = () => {
  if (data.value.type === "grid") {
    data.value.list.push({
      span: 0,
      list: [],
    });
  } else if (data.value.type === "tabs") {
    const index = data.value.list.length + 1;
    data.value.list.push({
      label: `标签页${index}`,
      name: `tabs ${index}`,
      list: [],
    });
  } else if (data.value.type === "tableTimeline") {
    const index = data.value.options.columns.length + 1;
    data.value.options.columns.push({
      label: "",
      prop: `columns ${index}`,
      slot: "input",
    });
  }
};

const handleInsertOption = () => {
  const index = data.value.options.options.length + 1;
  data.value.options.options.push({
    label: `Option ${index}`,
    value: `Option ${index}`,
  });
};

const handleOptionsRemove = (index: number) => {
  if (data.value.type === "grid") {
    data.value.list.splice(index, 1);
  } else if (data.value.type === "tabs") {
    data.value.list.splice(index, 1);
  } else if (data.value.type === "tableTimeline") {
    data.value.options.columns.splice(index, 1);
  } else {
    data.value.options.options.splice(index, 1);
  }
};

const handleSliderModeChange = (checked: boolean) => {
  checked
    ? (data.value.options.defaultValue = [10, 90])
    : (data.value.options.defaultValue = 0);
};

const handleSelectModeChange = (val: boolean) => {
  if (data.value.type === "img-upload") {
    return;
  }
  if (val) {
    if (data.value.options.defaultValue) {
      if (!(data.value.options.defaultValue instanceof Array)) {
        data.value.options.defaultValue = [data.value.options.defaultValue];
      }
    } else {
      data.value.options.defaultValue = [];
    }
  } else {
    data.value.options.defaultValue.length
      ? (data.value.options.defaultValue = data.value.options.defaultValue[0])
      : (data.value.options.defaultValue = null);
  }
};

const labelName = (type) => {
  let element = [...basicComponents, ...advanceComponents, ...layoutComponents];
  return element.find((item) => item.type == type)?.label || "";
};

const formulaEditerDialog = () => {
  emit("dialog");
};

const businessSelectDialog = () => {
  emit("businessDialog");
};

const selectElementDialog = (params) => {
  emit("selectDialog", params);
};
</script>
