<template>
  <div class="qa-verse-complete-graph">
    <div class="qa-vcg-top-bar flex row justify-e">
      <div class="flex row qa-vcg-order-container align-c">
        <span class="qa-vcg-order-label">order:</span>
        <TabRadio
          :options="[{ value: 'verse' }, { value: 'quote' }]"
          v-model:model-value="ordering"
          class="qa-vcg-order-select"
        />
      </div>
    </div>
    <div
      class="qa-vcg-graph flex row"
      :class="{ 'no-lines': verses.length > 100 || (verses.length > 40 && !$mqs.lg) }"
      @mouseleave="mouseOut"
    >
      <div
        class="qa-vcg-verse grow-1"
        v-for="verse in verses"
        :key="verse.index"
        :class="getState(verse)"
        @mouseenter="mouseIn(verse.index)"
      ></div>
      <div class="qa-vcg-overlay" v-if="showBox" :style="boxDim" :title="title"></div>
    </div>
    <div class="qa-vcg-legend flex row justify-c">
      <div
        class="qa-vcg-legend-label flex row align-c"
        v-for="label in ['correct', 'incorrect', 'skipped', 'incomplete'].filter(
          (l) => l !== 'incomplete' || showIncomplete
        )"
        :key="label"
      >
        <div class="qa-vcg-ll-square" :class="label"></div>
        {{ label }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { IReference } from '@/api/types';
import { SessionCompleteVerse } from '@/store/modules/session/session.interfaces';
import { useStore } from '@/store/store';
import { referenceToString } from '@/utilities/utilityFunctions';
import { computed, ref } from '@vue/reactivity';
import { defineComponent } from 'vue';
import TabRadio from '@/components/form/TabRadio.vue';

export default defineComponent({
  name: 'qa-verse-complete-graph',
  components: { TabRadio },
  setup() {
    const store = useStore();

    const showBox = ref(false);
    const showIncomplete = ref(true);
    const mousedIndex = ref(0);
    const ordering = ref<'verse' | 'quote'>('verse');
    const verses = computed(() => {
      const v = store.getters['session/limitedVerses']
        .map((verse, i) => {
          return {
            ...verse,
            index: i,
            ...(store.state.session.complete[i] as Partial<SessionCompleteVerse>),
          };
        })
        .filter((verse) => showIncomplete.value || !(!verse.reviewed && !verse.skipped));
      if (ordering.value === 'quote') {
        return v
          .map((verse) => ({
            ...verse,
            order:
              verse.order !== undefined
                ? verse.order
                : Object.keys(store.state.session.complete).length +
                  store.state.session.order.indexOf(verse.index),
          }))
          .sort((a, b) => a.order - b.order);
      }
      return v;
    });
    const contiguousRange = computed(() => {
      const i = verses.value.findIndex((v) => v.index === mousedIndex.value);
      let start = i;
      let end = i;
      while (start >= 0 && getState(verses.value[start]) === getState(verses.value[i])) {
        start--;
      }
      while (
        end < verses.value.length &&
        getState(verses.value[end]) === getState(verses.value[i])
      ) {
        end++;
      }
      return { start: ++start, end: --end, length: end - start + 1 };
    });
    const boxDim = computed(() => {
      const verseWidth = 100 / verses.value.length;
      const width = `${verseWidth * contiguousRange.value.length}%`;
      const left = `${verseWidth * contiguousRange.value.start}%`;
      const borderLeft = contiguousRange.value.start === 0;
      const borderRight = contiguousRange.value.end === verses.value.length - 1;
      const borderTopLeftRadius = borderLeft ? '8px' : '0';
      const borderBottomLeftRadius = borderTopLeftRadius;
      const borderTopRightRadius = borderRight ? '8px' : '0';
      const borderBottomRightRadius = borderTopRightRadius;
      return {
        width,
        left,
        borderBottomLeftRadius,
        borderTopLeftRadius,
        borderBottomRightRadius,
        borderTopRightRadius,
      };
    });
    const title = computed(() => {
      if (ordering.value === 'quote') {
        return '';
      }
      return (
        `${referenceToString(verses.value[contiguousRange.value.start])}` +
        (contiguousRange.value.length > 1
          ? `- ${referenceToString(verses.value[contiguousRange.value.end])}`
          : '')
      );
    });
    function getState(verse: Partial<SessionCompleteVerse> & IReference) {
      if (verse.reviewed && verse.correct) {
        return 'correct';
      } else if (verse.reviewed && !verse.correct && !verse.skipped) {
        return 'incorrect';
      } else if (verse.skipped) {
        return 'skipped';
      } else {
        return 'incomplete';
      }
    }
    function mouseIn(index: number) {
      mousedIndex.value = index;
      showBox.value = true;
    }
    function mouseOut() {
      showBox.value = false;
    }
    return {
      verses,
      reference: referenceToString,
      showIncomplete,
      mouseIn,
      mouseOut,
      showBox,
      boxDim,
      title,
      getState,
      ordering,
    };
  },
});
</script>

<style lang="scss">
.qa-verse-complete-graph {
  width: 100%;
  box-sizing: border-box;

  .qa-vcg-graph {
    height: 100px;
    border-radius: var(--qa-border-radius);
    overflow: hidden;
    border: 1px solid var(--qa-color-white--darken-30);
    position: relative;
  }

  .qa-vcg-legend {
    flex-wrap: wrap;
  }

  .qa-vcg-overlay {
    position: absolute;
    border: 2px solid var(--qa-color-black);
    height: 100%;
    top: 0;
    box-sizing: border-box;
  }

  .qa-vcg-ll-square {
    border: 2px solid var(--qa-color-black);
    width: 10px;
    height: 10px;
    margin: 5px;
  }
  .qa-vcg-verse {
    &::after {
      content: '';
      position: relative;
      left: 100%;
      width: 1px;
      height: 100%;
      opacity: 0.05;
      background-color: var(--qa-color-black);
      display: block;
    }
  }
  .qa-vcg-graph.no-lines {
    .qa-vcg-verse {
      &::after {
        content: unset;
      }
    }
  }

  .qa-vcg-ll-square,
  .qa-vcg-verse {
    &.correct {
      background-color: var(--qa-color-bg-green);
    }

    &.incorrect {
      background-color: var(--qa-color-red--lighten-20);
    }

    &.skipped {
      background-color: var(--qa-color-white--darken-20);
      &::after {
        opacity: 0.1;
      }
    }
  }

  .qa-vcg-top-bar {
    margin-bottom: 10px;
  }

  .qa-vcg-order-label {
    margin-right: 10px;
  }
}
</style>
