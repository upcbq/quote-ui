<template>
  <select class="qa-select" v-model="value">
    <slot></slot>
  </select>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'QaSelect',
  props: {
    modelValue: {
      type: [String, Number],
    },
  },
  emits: {
    'update:modelValue': null,
  },
  setup(props, { emit }) {
    const value = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    });

    return {
      value,
    };
  },
});
</script>

<style lang="scss">
.qa-select {
  width: 150px;
  height: 40px;
  text-align: center;
  margin: 10px;
  padding: 0 10px;
  border: 1px solid var(--qa-color-border);
  border-radius: 5px;
  background-color: var(--qa-background-color);
  color: var(--qa-font-color-dark);
}
</style>
