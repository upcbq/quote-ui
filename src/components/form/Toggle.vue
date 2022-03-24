<template>
  <div class="qa-toggle-container">
    <input type="checkbox" class="qa-toggle" v-bind="$attrs" :id="id" />
    <label class="qa-toggle-label" :for="id">
      <span class="qa-toggle-outer">
        <span class="qa-toggle-inner"></span>
      </span>
      <span>
        <slot />
      </span>
    </label>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'QaToggle',
  props: {
    modelValue: {
      type: Boolean,
    },
    id: {
      type: String,
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
.qa-toggle-container {
  position: relative;
  .qa-toggle {
    opacity: 0;
    position: absolute;

    &:checked {
      & ~ .qa-toggle-label {
        .qa-toggle-outer {
          background-color: var(--qa-color-primary);
          border: 2px solid var(--qa-color-primary);
        }
        .qa-toggle-inner {
          left: calc(100% - 18px);
        }
      }
    }
  }
  .qa-toggle-label {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    .qa-toggle-outer,
    .qa-toggle-inner {
      display: inline-block;
      transition: all 0.1s ease-in-out;
    }
    .qa-toggle-outer {
      width: 36px;
      height: 20px;
      border-radius: 1000px;
      border: 2px solid var(--qa-color-border);
      position: relative;
      background-clip: content-box;
      box-sizing: border-box;
      margin-right: 4px;
    }
    .qa-toggle-inner {
      height: 20px;
      width: 20px;
      border-radius: 50%;
      background-color: var(--qa-color-font-dark);
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      left: -2px;
    }
  }
}
</style>
