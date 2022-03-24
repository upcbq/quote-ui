<template>
  <div class="qa-quote-session">
    <div class="qa-qs-settings">
      <IconButton icon="settings"></IconButton>
    </div>
    <div class="qa-qs-display">
      <div class="qa-qs-top-controls">
        <Toggle id="auto-continue-toggle">Auto Advance</Toggle>
      </div>
      <QuizCard class="qa-qs-card" v-if="activeVerseString">
        {{ activeVerseString }}
      </QuizCard>
      <div class="qa-qs-controls">
        <IconButton
          :icon="shuffle ? 'shuffle_on' : 'shuffle'"
          class="qa-qs-shuffle"
          @click.prevent="toggleShuffle"
        >
        </IconButton>
        <RecordButton icon="fiber_manual_record" class="qa-qs-rec-button" border>
          REC
        </RecordButton>
        <IconButton icon="skip_next"> </IconButton>
      </div>
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
import { computed, defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { PATH } from '@/router/router';
import QuizCard from '@/components/atoms/QuizCard.vue';
import { referenceToString } from '@/utilities/utilityFunctions';
import CardStackDisplay from '@/components/molecules/CardStackDisplay.vue';
import IconButton from '@/components/molecules/IconButton.vue';
import RecordButton from '@/components/molecules/RecordButton.vue';
import Toggle from '@/components/form/Toggle.vue';

export default defineComponent({
  name: 'QuoteSession',
  components: { QuizCard, CardStackDisplay, IconButton, RecordButton, Toggle },
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
    const shuffle = computed(() => {
      return store.state.session.shuffle;
    });

    function testQuote() {
      if (!activeVerseRef.value) return;
      store.dispatch('session/quoteVerse', activeVerseRef.value?.index);
    }

    function toggleShuffle() {
      store.dispatch('session/shuffle', !shuffle.value);
    }
    return {
      unquoted,
      unreviewed,
      complete,
      activeVerseString,
      testQuote,
      toggleShuffle,
      store,
      shuffle,
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
  .qa-qs-shuffle {
    position: relative;
  }
  .qa-qs-top-controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
  }
  .qa-qs-controls {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    margin-top: 20px;
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
