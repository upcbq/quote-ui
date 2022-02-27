<template>
  <div class="qa-range">
    <div class="qa-range--label">
      <slot name="label" />
    </div>
    <div class="qa-range--track"></div>
    <input
      type="range"
      :min="min"
      :max="max"
      v-model="value"
      @touchstart="active = true"
      @touchend="active = false"
      @[isIOS?`touchmove`:null]="iosFix"
      :class="{ active: active }"
    />
    <output
      v-if="!hideTooltip"
      class="qa-range-bubble mdc-elevation--z2 nowrap"
      :style="{
        '--position': left,
        '--correction': correction,
      }"
      >{{ tooltip || value }}</output
    >
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

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
  data: () => ({
    isIOS: !!navigator.platform.match(/iPhone|iPod|iPad/),
  }),
  methods: {
    iosFix(e: TouchEvent) {
      // Should only be bound for iOS devices to fix a range issue if beginning touch
      // from outside of the range thumb
      const slider = e.target;
      if (
        this.isIOS &&
        slider instanceof HTMLInputElement &&
        e.touches &&
        e.touches.length === 1
      ) {
        e.preventDefault();
        const touch = e.touches && e.touches.item(0);
        const val =
          (touch!.pageX - slider.getBoundingClientRect().left) /
          (slider.getBoundingClientRect().right - slider.getBoundingClientRect().left);
        let max = Number(this.max) || 100;
        const min = Number(this.min) || 1;
        const segment = 1 / (max - min),
          segmentArr = [];

        max++;

        for (let i = 0; i < max; i++) {
          segmentArr.push(segment * i);
        }

        const segCopy = segmentArr.slice(),
          ind = segmentArr.sort((a, b) => Math.abs(val - a) - Math.abs(val - b))[0];

        this.value = String(segCopy.indexOf(ind));
      }
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

    const active = ref(false);

    const left = computed(() => {
      const val = Number(value.value || 0);
      const leftNum = Number((val - props.min) * 100) / (props.max - props.min);
      return leftNum;
    });

    const rangeEl = ref<HTMLElement | null>(null);
    const outputEl = ref<HTMLElement | null>(null);

    const correction = computed(() => {
      const total = props.max - props.min;
      const val = Number(value.value || 0);
      const maxDiff = props.max - val;
      const minDiff = val - props.min;
      const sign = maxDiff > minDiff ? -1 : 1;
      const offset = Math.min(maxDiff, minDiff);
      const edgeOffset = offset / total;

      return sign * (0.5 - edgeOffset);
    });

    return {
      value,
      left,
      active,
      correction,
      rangeEl,
      outputEl,
    };
  },
});
</script>

<style lang="scss">
.qa-range {
  position: relative;
  margin: 30px 0;

  .qa-range--track {
    height: 6px;
    border-radius: 3px;
    width: 100%;
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background-color: var(--qa-color-primary);
    z-index: 0;
  }

  input[type='range'] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
    cursor: pointer;
    width: 100%;
    z-index: 1;
    position: relative;
    -webkit-tap-highlight-color: transparent;

    @include ios-only {
      padding: 20px 0;
      margin: -20px 0;
    }

    &::-webkit-slider-runnable-track {
      background: transparent;
      height: 6px;
      border-radius: 3px;
      border-top: 20px solid transparent;
      border-bottom: 20px solid transparent;
      margin: -20px 0;
      box-sizing: content-box;
    }
    &::-moz-range-track {
      background: transparent;
      height: 6px;
      border-radius: 3px;
      border-top: 20px solid transparent;
      border-bottom: 20px solid transparent;
      margin: -20px 0;
      box-sizing: content-box;
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

    &:active,
    &.active {
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
    --position: 0;
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
    transform: translateX(calc(-50% - (var(--correction) * 100%)));
    z-index: 2;
    left: calc(var(--position) * 1% + (50 - var(--position)) * 0.25px);
    max-width: calc(100vw - 20px);
    text-overflow: ellipsis;

    &::before {
      content: '';
      position: absolute;
      left: max(min(calc(50% + (var(--correction) * 100%)), calc(100% - 10px)), 10px);
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
    pointer-events: none;
  }
}
</style>
