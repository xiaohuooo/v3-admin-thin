<template>
  <div class="widget-cate">{{ title }}</div>
  <Draggable
    tag="ul"
    item-key="type"
    ghostClass="ghost"
    :group="{ name: 'people', pull: 'clone', put: false }"
    :sort="false"
    :list="list"
  >
    <template #item="{ element }">
      <li
        v-if="fields.includes(element.type)"
        class="form-edit-widget-label"
        :class="{ 'no-put': element.tpye === 'divider' }"
      >
        <a @click.stop="handleComponentClick(element)">
          <SvgIcon :iconClass="element.type" />
          <span>{{ element.label }}</span>
        </a>
      </li>
    </template>
  </Draggable>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import Draggable from "vuedraggable";
import SvgIcon from "./SvgIcon.vue";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  fields: {
    type: Array as PropType<Array<string>>,
    required: true,
  },
  list: {
    required: true,
  },
});

const emit = defineEmits<{
  componentClick: [element: any];
}>();

const handleComponentClick = (element) => {
  emit("componentClick", element);
};
</script>
