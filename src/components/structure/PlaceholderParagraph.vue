<template>
  <span class="qa-placeholder-paragraph">
    {{ placeholderText }}
  </span>
</template>

<script lang="ts">
import { generatePlaceholderText } from '@/utilities/utilityFunctions';
import { computed, defineComponent } from 'vue';

export default defineComponent({
  name: 'QaPlaceholderParagraph',
  props: {
    length: {
      type: Number,
      default: 0,
    },
    averageWordLength: {
      type: Number,
      default: 6,
    },
  },
  setup(props) {
    const placeholderText = computed(() => {
      return generatePlaceholderText(props.length, props.averageWordLength);
    });
    return {
      placeholderText,
    };
  },
});
</script>

<style lang="scss">
.qa-placeholder-paragraph {
  font-family: $qa-font-sans;
  line-height: 1.8em;
  opacity: 0.2;
  font-size: 0.8em;
  letter-spacing: -0.05em;
  word-spacing: 0.2em;
}
</style>
