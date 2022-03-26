<template>
  <div
    class="qa-quote-session"
    v-touch-options="{ swipeTolerance: 80, disableClick: true }"
    v-touch:swipe="testSwipe"
  >
    <div
      class="qa-qs-swipe-overlay"
      :style="{ opacity: swipeIndColor ? 0.2 : 0, backgroundColor: swipeIndColor }"
    ></div>
    <div class="qa-qs-settings">
      <button class="clear-btn qa-qs-skipped-button">
        <span class="underline">skipped&nbsp;</span>
        <span>({{ skipped.length }})</span>
      </button>
      <IconButton icon="settings">Test</IconButton>
    </div>
    <div class="qa-qs-display">
      <div class="qa-qs-top-controls">
        <Toggle
          id="auto-continue-toggle"
          v-model="autoAdvance"
          v-if="mode === 'quote'"
          title="auto start recording"
        >
          Auto Advance
        </Toggle>
      </div>
      <QuizCard
        class="qa-qs-card"
        v-if="activeVerseRef"
        :ref-text="activeVerseString"
        :verse-text="activeVerseText"
      >
      </QuizCard>
      <SessionControls
        class="qa-qs-controls"
        :current-index="activeVerseRef?.index"
        :mode="mode"
      ></SessionControls>
    </div>
    <div class="qa-qs-stacks">
      <CardStackDisplay
        :verses="unquoted"
        class="qa-color-bg-blue"
        @click.prevent="setMode('quote')"
      >
        Unquoted
      </CardStackDisplay>
      <CardStackDisplay
        :verses="unreviewed"
        class="qa-color-bg-yellow"
        @click.prevent="setMode('review')"
      >
        Unreviewed
      </CardStackDisplay>
      <CardStackDisplay :verses="complete" class="qa-color-bg-green">
        Complete
      </CardStackDisplay>
    </div>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store/store';
import { computed, defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { PATH } from '@/router/router';
import QuizCard from '@/components/atoms/QuizCard.vue';
import { referenceToString } from '@/utilities/utilityFunctions';
import CardStackDisplay from '@/components/molecules/CardStackDisplay.vue';
import IconButton from '@/components/molecules/IconButton.vue';
import Toggle from '@/components/form/Toggle.vue';
import SessionControls from '@/components/molecules/SessionControls.vue';

export default defineComponent({
  name: 'QuoteSession',
  components: {
    QuizCard,
    CardStackDisplay,
    IconButton,
    Toggle,
    SessionControls,
  },
  mounted() {
    // If there is no session started, redirect to home page to set up session
    const store = useStore();
    if (!store.getters['session/limitedVerses']?.length) {
      const router = useRouter();
      router.push(PATH.home);
    }
  },
  setup() {
    const store = useStore();

    const mode = ref<'quote' | 'review'>('quote');

    const swipeIndColor = ref('');

    const unquoted = computed(() => {
      const storeVal = store.getters['session/unquotedVerses'];
      return mode.value === 'quote' ? storeVal.slice(1) : storeVal;
    });
    const unreviewed = computed(() => {
      const storeVal = store.getters['session/unreviewedVerses'];
      const returnVal = [...storeVal];
      if (mode.value === 'review') {
        returnVal.reverse();
      }
      return returnVal.slice(mode.value === 'review' ? 1 : 0);
    });
    const complete = computed(() => {
      return store.getters['session/reviewedVerses'];
    });
    const activeVerseRef = computed(() => {
      return (
        mode.value === 'quote'
          ? store.getters['session/unquotedVerses']
          : [...store.getters['session/unreviewedVerses']].reverse()
      ).at(0);
    });
    const activeVerseString = computed(() => {
      return (
        (mode.value === 'quote' &&
          activeVerseRef.value &&
          referenceToString(activeVerseRef.value)) ||
        ''
      );
    });
    const activeVerseText = computed(() => {
      return (
        (mode.value === 'review' &&
          activeVerseRef.value &&
          store.getters['verse/verses'](activeVerseRef.value) &&
          store.getters['verse/verses'](activeVerseRef.value).text) ||
        ''
      );
    });
    const autoAdvance = computed({
      get: () => store.state.session.options.autoAdvance,
      set: (value) => store.commit('session/setAutoAdvance', value),
    });
    const skipped = computed(() => {
      return store.getters['session/skippedVerses'];
    });

    function setMode(md: typeof mode.value) {
      if (md === 'quote' && unquoted.value.length) {
        mode.value = md;
      } else if (md === 'review' && unreviewed.value.length) {
        store.dispatch('verse/fetchVerses', unreviewed.value);
        mode.value = md;
      }
    }

    function testSwipe(direction: string) {
      if (direction === 'right') {
        swipeIndColor.value = '#00ff00';
      } else if (direction === 'left') {
        swipeIndColor.value = '#ff0000';
      }

      if (['right', 'left'].includes(direction)) {
        setTimeout(() => {
          swipeIndColor.value = '';
        }, 250);
      }
    }
    return {
      unquoted,
      unreviewed,
      complete,
      activeVerseRef,
      activeVerseString,
      activeVerseText,
      autoAdvance,
      skipped,
      testSwipe,
      swipeIndColor,
      store,
      mode,
      setMode,
    };
  },
});
</script>

<style lang="scss">
.qa-quote-session {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  .qa-qs-display {
    padding: 0 5%;
    margin: 0 auto;
    max-width: 700px;
    box-sizing: border-box;
    width: 100%;
  }
  .qa-qs-card {
    width: 100%;
  }
  .qa-qs-stacks {
    width: 100%;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
    cursor: pointer;
  }
  .qa-qs-settings {
    padding: 0 20px;
    box-sizing: border-box;
    width: 100%;
    justify-content: flex-end;
    display: flex;
  }
  .qa-qs-top-controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  .qa-qs-controls {
    margin-top: 20px;
  }
  .qa-qs-skipped-button {
    font-family: $qa-font-sans;
    color: var(--qa-color-disabled);
    transition: color 0.1s ease-in-out;
    cursor: pointer;
    padding: 0 20px;
    &:hover {
      color: var(--qa-color-font-dark);
    }
  }
  .qa-qs-swipe-overlay {
    position: absolute;
    @include position(0);
    opacity: 0;
    transition: transition(opacity, background-color, 0.1s, ease-in-out);
    pointer-events: none;
  }
}

@include media-smaller(xs) {
  .qa-quote-session {
    .qa-qs-settings {
      padding: 0 5%;
    }
  }
}

@include media-short() {
  .qa-quote-session {
    .qa-qs-card {
      width: unset;
      max-height: 30vh;
    }
  }
}
</style>
