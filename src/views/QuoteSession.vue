<template>
  <div class="qa-quote-session">
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
          title="auto start recording"
          >Auto Advance</Toggle
        >
      </div>
      <QuizCard class="qa-qs-card" v-if="activeVerseString">
        {{ activeVerseString }}
      </QuizCard>
      <SessionControls
        class="qa-qs-controls"
        :current-index="activeVerseRef?.index"
        :mode="mode"
      ></SessionControls>
    </div>
    <div class="qa-qs-stacks">
      <CardStackDisplay :verses="unquoted.slice(1)" class="qa-color-bg-blue">
        Unquoted</CardStackDisplay
      >
      <CardStackDisplay :verses="unreviewed" class="qa-color-bg-yellow">
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

    const unquoted = computed(() => {
      return store.getters['session/unquotedVerses'];
    });
    const unreviewed = computed(() => {
      return store.getters['session/unreviewedVerses'];
    });
    const complete = computed(() => {
      return store.getters['session/reviewedVerses'];
    });
    const activeVerseRef = computed(() => {
      return unquoted.value?.at(0);
    });
    const activeVerseString = computed(() => {
      return (activeVerseRef.value && referenceToString(activeVerseRef.value)) || '';
    });
    const autoAdvance = computed({
      get: () => store.state.session.options.autoAdvance,
      set: (value) => store.commit('session/setAutoAdvance', value),
    });
    const skipped = computed(() => {
      return store.getters['session/skippedVerses'];
    });

    function testQuote() {
      if (!activeVerseRef.value) return;
      store.dispatch('session/quoteVerse', activeVerseRef.value?.index);
    }
    return {
      unquoted,
      unreviewed,
      complete,
      activeVerseRef,
      activeVerseString,
      autoAdvance,
      skipped,
      testQuote,
      store,
      mode,
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
  .qa-qs-display {
    padding: 0 5%;
    margin: 0 auto;
    max-width: 700px;
    box-sizing: border-box;
  }
  .qa-qs-card {
    width: 100%;
  }
  .qa-qs-stacks {
    width: 100%;
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: 1fr;
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
}

@include media-smaller(xs) {
  .qa-quote-session {
    .qa-qs-settings {
      padding: 0 5%;
    }
  }
}
</style>
