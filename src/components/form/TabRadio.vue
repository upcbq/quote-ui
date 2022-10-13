<template>
  <div class="qa-tab-radio flex row align-c" @click.prevent="selectNext">
    <label v-for="(opt, i) in options" :key="i" class="qa-tr-label" :ref="refs.labels">
      <input
        type="radio"
        :name="name"
        :value="opt.value"
        class="qa-tr-radio"
        :ref="refs.radios"
        v-model="value"
        data-focus-parent
        @click.prevent.stop="() => {}"
      />
      <span>{{ opt.title || opt.value }}</span>
    </label>
    <div class="qa-tr-select" :style="selectStyle" :class="{ afterMount }"></div>
  </div>
</template>

<script lang="ts">
import { computed } from '@vue/reactivity';
import { defineComponent, nextTick, onMounted, PropType, ref } from 'vue';

let tabRadioCount = 0;

export default defineComponent({
  name: 'qa-tab-radio',
  props: {
    options: {
      type: Array as PropType<
        Array<{ title?: string; value: string | boolean | object | number }>
      >,
      default: Array,
    },
    modelValue: {
      type: [String, Object, Boolean, Array, Number],
      default: '',
    },
    name: {
      type: String,
      default: () => `tabRadio-${++tabRadioCount}`,
    },
  },
  emits: {
    'update:modelValue': null,
  },
  setup(props, { emit }) {
    const refs = {
      labels: ref([]),
      radios: ref([]),
    };

    const value = computed({
      get: () => props.modelValue,
      set: (value) => emit('update:modelValue', value),
    });

    const selectStyle = computed(() => {
      let width = 0;
      let left = 3;

      if (!refs.labels.value || !refs.radios.value) {
        return {};
      }
      const labels: HTMLLabelElement[] = (
        Array.isArray(refs.labels.value) ? refs.labels.value : [refs.labels.value]
      ).filter((v) => v !== undefined);
      const radios: HTMLInputElement[] = (
        Array.isArray(refs.radios.value) ? refs.radios.value : [refs.radios.value]
      ).filter((v) => v !== undefined);
      for (let i = 0; i < labels.length; i++) {
        if (radios[i]?.value === value.value) {
          width = labels[i]?.clientWidth;
          break;
        }
        left += labels[i]?.clientWidth + 10;
      }

      return {
        width: `${width}px`,
        left: `${left}px`,
      };
    });

    const afterMount = ref(false);

    onMounted(() => {
      nextTick().then(() => {
        afterMount.value = true;
      });
    });

    function selectNext() {
      const selectedIndex = props.options.findIndex((o) => o.value === props.modelValue);
      if (selectedIndex < props.options.length - 1) {
        emit('update:modelValue', props.options[selectedIndex + 1].value);
      } else {
        emit('update:modelValue', props.options[0].value);
      }
    }

    return {
      selectStyle,
      value,
      refs,
      afterMount,
      selectNext,
    };
  },
});
</script>

<style lang="scss">
.qa-tab-radio {
  border-radius: 1000px;
  height: 30px;
  background-color: var(--qa-color-white--darken-20);
  padding: 0 10px;
  position: relative;

  &:focus-within {
    outline: 2px solid #7aacfe !important;
    outline: 5px auto -webkit-focus-ring-color !important;
  }

  .qa-tr-select {
    position: absolute;
    height: calc(100% - 4px);
    top: 2px;
    border-radius: 1000px;
    background-color: var(--qa-color-white);
    padding: 0 7px;

    &.afterMount {
      transition: left animTime(0.2s) linear;
    }
  }

  .qa-tr-label {
    position: relative;
    &:not(:first-child) {
      margin-left: 10px;
    }
    z-index: 1;
    cursor: pointer;
  }
  .qa-tr-radio {
    position: absolute;
    width: 0;
    height: 0;
    opacity: 0;
    pointer-events: none;
  }
}
</style>
