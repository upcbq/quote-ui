<template>
  <div class="qa-select-container">
    <div class="qa-select--label">
      <slot name="label" />
    </div>
    <select class="qa-select" v-model="value" v-bind="$attrs">
      <slot></slot>
    </select>
  </div>
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
  -webkit-appearance: none;
  -moz-appearance: none;
  width: 100%;
  min-width: fit-content;
  height: 40px;
  text-align: left;
  padding: 0 20px 0 10px;
  border: 2px solid var(--qa-color-border);
  border-radius: 5px;
  color: var(--qa-color-font-dark);
  cursor: pointer;
  background-color: var(--qa-color-white);
}
.qa-select-container {
  display: inline-block;
  position: relative;
  min-width: fit-content;
  flex: 1 0;
  margin: 20px 0 10px;
  &::after {
    content: '';
    border-top: 6px solid var(--qa-color-font-dark);
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    position: absolute;
    box-sizing: border-box;
    right: 6px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
  }

  .qa-select--label {
    font-size: 14px;
    font-family: $qa-font-sans;
    color: var(--qa-color-border);
    position: absolute;
    left: 0;
    top: -18px;
  }
}
</style>
