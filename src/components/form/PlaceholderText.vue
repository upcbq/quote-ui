<template>
  <span class="qa-placeholder-text">{{ text }}</span>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QaPlaceholderText',
  props: {
    length: {
      type: Number,
      default: 10,
    },
  },
  computed: {
    text(): string {
      return '█'.repeat(this.length);
    },
  },
});
</script>

<style lang="scss">
.qa-placeholder-text {
  opacity: 0.4;
  font-size: 0.8em;
}
</style>
