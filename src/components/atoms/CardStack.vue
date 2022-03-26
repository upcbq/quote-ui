<template>
  <div class="qa-card-stack">
    <div class="qa-cs-container">
      <QuizCard class="qa-cs-card" v-show="count > 2"></QuizCard>
      <QuizCard class="qa-cs-card" v-if="count > 1"></QuizCard>
      <QuizCard
        class="qa-cs-card qa-cs-card--top"
        :style="{ opacity: count > 0 ? 1 : 0 }"
        :ref-text="visibleReference"
      ></QuizCard>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import QuizCard from '@/components/atoms/QuizCard.vue';

export default defineComponent({
  name: 'QuoteSession',
  components: { QuizCard },
  props: {
    visibleReference: {
      type: String,
      default: '',
    },
    count: {
      type: Number,
      default: 0,
    },
  },
});
</script>

<style lang="scss">
.qa-card-stack {
  width: 100%;
  height: 100%;

  .qa-cs-container {
    width: 100%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 3% 0;
  }

  .qa-cs-card {
    position: absolute;
    width: 94%;
    &:nth-child(2) {
      position: relative;
    }
    &:nth-child(1) {
      transform: translateX(-50%);
      left: 47%;
      bottom: 0;
    }
    &:nth-child(3) {
      transform: translateX(-50%);
      left: 53%;
      top: 0;
    }
  }

  @include media-short() {
    .qa-cs-card {
      width: 70%;
    }
  }
}
</style>
