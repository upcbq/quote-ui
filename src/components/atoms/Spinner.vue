<template>
  <span class="qa-spinner" v-if="display"></span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QaSpinner',
  props: {
    delay: {
      type: Number,
      default: 200,
    },
  },
  data: () => ({
    display: false,
    timerId: -1,
  }),
  mounted() {
    if (this.delay > 0) {
      this.timerId = setTimeout(() => {
        this.display = true;
      }, this.delay);
    } else {
      this.display = true;
    }
  },
  beforeUnmount() {
    if (this.timerId < 0) {
      clearTimeout(this.timerId);
    }
  },
});
</script>

<style lang="scss">
.qa-spinner {
  display: inline-block;
  width: 70px;
  height: 70px;
  position: relative;
  &::after {
    position: absolute;
    content: '';
    display: block;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 6px solid var(--qa-color-secondary);
    border-color: var(--qa-color-secondary) transparent var(--qa-color-secondary)
      transparent;
    animation: animate-spin animTime(1.2s) linear infinite;
    box-sizing: border-box;
  }
}
@keyframes animate-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
