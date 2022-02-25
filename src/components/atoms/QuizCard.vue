<template>
  <svg class="qa-quiz-card" viewBox="0 0 200 100">
    <rect x="0" y="0" width="200" height="100"></rect>
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" class="ref-text-container">
        <p class="ref-text">
          <slot></slot>
        </p>
      </div>
    </foreignObject>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'QaQuizCard',
  setup() {
    //
  },
});
</script>

<style lang="scss">
.qa-quiz-card {
  box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.25);
  width: 50%;

  & > rect {
    fill: #fff;
  }

  .ref-text-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    height: 100px;
    width: 200px;
  }

  .ref-text {
    font-family: 'Noto Serif', 'Times New Roman', Times, serif;
    font-size: 16px;
    width: 100%;
  }

  @include media-smaller(xs) {
    .ref-text {
      font-size: 22px;
    }
  }
}
</style>
