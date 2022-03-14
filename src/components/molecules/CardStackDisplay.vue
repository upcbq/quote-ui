<template>
  <div class="qa-card-stack-display">
    <span class="qa-csd-count" v-if="verses.length">{{ verses.length }}</span>
    <CardStack
      class="qa-csd-stack"
      :visible-reference="topCard"
      :count="verses.length"
    ></CardStack>
    <div class="qa-csd-name" v-if="$slots.default">
      <slot></slot>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue';
import CardStack from '@/components/atoms/CardStack.vue';
import { IReference } from '@/api/types';
import { referenceToString } from '@/utilities/utilityFunctions';

export default defineComponent({
  name: 'CardStackDisplay',
  components: { CardStack },
  props: {
    verses: {
      type: Array as PropType<IReference[]>,
      default: Array,
    },
  },
  setup(props) {
    const topCard = computed(() => {
      if (props.verses.length === 0) return '';
      return referenceToString(props.verses[0]);
    });

    return {
      topCard,
    };
  },
});
</script>

<style lang="scss">
.qa-card-stack-display {
  padding: 45px 10px;
  position: relative;
  .qa-csd-count {
    position: absolute;
    color: var(--qa-color-font-medium);
    left: 10px;
    top: 10px;
  }
  .qa-csd-stack {
    max-width: 300px;
    margin: 0 auto;
  }
}
</style>
