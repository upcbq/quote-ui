<template>
  <div class="qa-quote-session">
    <div class="qa-qs-settings"></div>
    <div class="qa-qs-display">
      <QuizCard class="qa-qs-card" v-if="activeVerseString">
        {{ activeVerseString }}
      </QuizCard>
      <button @click.prevent="testQuote">Quote</button>
      <button @click.prevent="testShuffle">Shuffle</button>
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

export default defineComponent({
  name: 'QuoteSession',
  components: { QuizCard, CardStackDisplay },
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

    function testQuote() {
      if (!activeVerseRef.value) return;
      store.dispatch('session/quoteVerse', activeVerseRef.value?.index);
    }

    function testShuffle() {
      store.dispatch('session/shuffle', true);
    }
    return {
      unquoted,
      unreviewed,
      complete,
      activeVerseString,
      testQuote,
      testShuffle,
      store,
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
    max-width: 600px;
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
}
</style>
