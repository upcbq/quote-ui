<template>
  <svg class="qa-quiz-card" viewBox="0 0 200 100">
    <rect x="0" y="0" width="200" height="100"></rect>
    <foreignObject width="100%" height="100%">
      <div xmlns="http://www.w3.org/1999/xhtml" class="ref-text-container">
        <p
          class="ref-text"
          v-if="refText"
          :class="{ 'qa-qc-ref--with-verse': !!verseText }"
        >
          {{ refText }}
        </p>
        <p
          class="verse-text"
          v-if="verseText"
          :style="{ fontSize: `${verseTextFontSize}px` }"
        >
          {{ verseText }}
        </p>
      </div>
    </foreignObject>
  </svg>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue';
import { boundedNumber } from '@/utilities/utilityFunctions';

export default defineComponent({
  name: 'QaQuizCard',
  props: {
    verseText: {
      type: String,
      default: '',
    },
    refText: {
      type: String,
      default: '',
    },
  },
  setup(props) {
    const verseTextFontSize = computed(() => {
      const textLength = props.verseText.length;
      let size = 16;
      let computedColumns = 180 / size;
      let computedRows = textLength / computedColumns;
      while (size * computedRows > 80) {
        size--;
        computedColumns = 180 / size;
        computedRows = textLength / computedColumns;
      }
      return boundedNumber(size, 6, 16);
    });
    return {
      verseTextFontSize,
    };
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
    position: relative;
  }

  .ref-text {
    font-family: 'Noto Serif', 'Times New Roman', Times, serif;
    font-size: 16px;
    width: 100%;
  }

  .qa-qc-ref--with-verse {
    color: var(--qa-color-white--darken-30);
    position: absolute;
    width: auto;
    left: 0;
    top: 0;
    margin: 2px 0 0 2px;
    font-size: 8px;
  }

  .verse-text {
    font-family: 'Noto Serif', 'Times New Roman', Times, serif;
    max-height: 100%;
    width: 100%;
    text-align: left;
    padding: 10px;
    box-sizing: border-box;
    margin: 0;
  }

  @include media-smaller(xs) {
    .ref-text {
      font-size: 22px;
    }
    .qa-qc-ref--with-verse {
      font-size: 8px;
    }
  }
}
</style>
