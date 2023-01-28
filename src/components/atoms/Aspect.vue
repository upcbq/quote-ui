<template>
  <div class="qa-aspect" ref="rootEl">
    <div class="qa-aspect-size" :style="style">
      <div class="qa-aspect-content">
        <slot :scale="implicitScale"></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, computed } from 'vue';

export default defineComponent({
  name: 'qa-aspect',
  props: {
    aspectRatio: {
      type: Number,
      default: 1,
    },
    initialWidth: {
      type: Number,
      default: -1,
    },
  },
  setup(props) {
    const rootEl = ref<HTMLElement>();
    const scale = ref(1);
    const implicitScale = ref(1);
    const style = computed(() => {
      return {
        width: `${100 * scale.value}%`,
        paddingBottom: `${(1 / props.aspectRatio) * 100 * scale.value}%`,
      };
    });
    function onResize() {
      const parentW = rootEl.value?.clientWidth;
      if (props.initialWidth > -1 && parentW !== undefined) {
        implicitScale.value = parentW / props.initialWidth;
      } else {
        implicitScale.value = 1;
      }
    }

    onMounted(() => {
      window.addEventListener('resize', onResize, true);
      onResize();
    });
    onUnmounted(() => {
      window.removeEventListener('resize', onResize);
    });
    return {
      rootEl,
      style,
      implicitScale,
    };
  },
});
</script>

<style lang="scss">
.qa-aspect {
  .qa-aspect-size {
    position: relative;
    height: 0;
    box-sizing: content-box;
    width: 100%;
    margin: auto;
  }

  .qa-aspect-content {
    position: absolute;
    @include position(0);
  }
}
</style>
