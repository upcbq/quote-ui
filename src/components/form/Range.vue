<template>
  <div class="qa-range">
    <div class="qa-range--label">
      <slot name="label" />
    </div>
    <input type="range" :min="min" :max="max" v-model="value" />
    <output
      v-if="!hideTooltip"
      class="qa-range-bubble mdc-elevation--z2"
      :style="{
        left: left,
      }"
      >{{ tooltip || value }}</output
    >
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'QaRange',
  props: {
    modelValue: {
      type: [String, Number],
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    tooltip: {
      type: [String, Number],
      default: '',
    },
    hideTooltip: {
      type: Boolean,
      default: false,
    },
  },
  emits: {
    'update:modelValue': null,
  },
  setup(props, { emit }) {
    const value = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', Number(value)),
    });

    const left = computed(() => {
      const val = Number(value.value || 0);
      const leftNum = Number((val - props.min) * 100) / (props.max - props.min);
      return `calc(${leftNum}% + (${12 - leftNum * 0.25}px))`;
    });

    return {
      value,
      left,
    };
  },
});
</script>

<style lang="scss">
.qa-range {
  position: relative;
  margin: 30px 0;

  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    width: 100%;

    &::-webkit-slider-runnable-track {
      background: qa-color(primary);
      height: 6px;
      border-radius: 3px;
      margin: 0;
    }
    &::-moz-range-track {
      background: qa-color(primary);
      height: 6px;
      border-radius: 3px;
      margin: 0;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none; /* Override default look */
      appearance: none;
      width: 25px;
      height: 25px;
      border-radius: 50%;
      background-color: qa-color(primary);
      margin-top: -9.5px;
      border: none;
    }
    &::-moz-range-thumb {
      width: 25px;
      height: 25px;
      border-radius: 50%;
      border: none;
      background-color: qa-color(primary);
    }

    &:hover {
      &::-webkit-slider-thumb {
        background-color: darken(qa-color(primary), 10%);
      }
      &::-moz-range-thumb {
        background-color: darken(qa-color(primary), 10%);
      }
    }

    &:active {
      & ~ .qa-range-bubble {
        display: initial;
      }
    }
    &:focus-visible {
      & ~ .qa-range-bubble {
        display: initial;
      }
    }
  }
  .qa-range-bubble {
    display: none;
    position: absolute;
    background-color: qa-color(border);
    bottom: 35px;
    color: qa-color(font);
    min-width: 20px;
    box-sizing: border-box;
    border-radius: 3px;
    padding: 4px 12px;
    transition: width animTime(0.2s) ease-in-out;
    transform: translateX(-50%);

    &::before {
      content: '';
      position: absolute;
      left: 50%;
      top: 100%;
      transform: translateX(-50%);
      border-top: 8px solid qa-color(border);
      border-right: 8px solid transparent;
      border-left: 8px solid transparent;
      border-bottom: none;
    }
  }

  .qa-range--label {
    font-size: 14px;
    font-family: $qa-font-sans;
    color: var(--qa-color-border);
    position: absolute;
    left: 0;
    top: -18px;
  }
}
</style>
