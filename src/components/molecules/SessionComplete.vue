<template>
  <div class="qa-session-complete flex col">
    <h3>completed verses</h3>
    <div class="qa-sc-content grow-1 flex col">
      <VerseCompleteGraph />
      <div class="qa-sc-all-verses flex col row-md grow-1">
        <div class="grow-1 flex col" v-if="correctVerses.length">
          <p>correct ({{ correctVerses.length }})</p>
          <div class="qa-sc-av-list grow-1">
            <p
              class="qa-sc-av-list-item"
              v-for="verse in correctVerses"
              :key="verse.index"
            >
              {{ reference(verse) }}
            </p>
          </div>
        </div>
        <div class="grow-1 flex col" v-if="incorrectVerses.length">
          <p>incorrect ({{ incorrectVerses.length }})</p>
          <div class="qa-sc-av-list grow-1">
            <p
              class="qa-sc-av-list-item"
              v-for="verse in incorrectVerses"
              :key="verse.index"
            >
              {{ reference(verse) }}
            </p>
          </div>
        </div>
        <div class="grow-1 flex col" v-if="incompleteVerses.length">
          <p>incomplete ({{ incompleteVerses.length }})</p>
          <div class="qa-sc-av-list grow-1">
            <p
              class="qa-sc-av-list-item"
              v-for="verse in incompleteVerses"
              :key="verse.index"
            >
              {{ reference(verse) }}
            </p>
          </div>
        </div>
      </div>
    </div>
    <Button class="margin-center" @click.prevent="endSession">End Session</Button>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/store/store';
import { referenceToString } from '@/utilities/utilityFunctions';
import { computed } from '@vue/reactivity';
import { defineComponent } from 'vue';
import Button from '@/components/form/Button.vue';
import VerseCompleteGraph from '@/components/molecules/VerseCompleteGraph.vue';
import { useRouter } from 'vue-router';
import { PATH } from '@/router/router';

export default defineComponent({
  name: 'SessionComplete',
  props: {},
  setup(props, ctx) {
    const store = useStore();
    const router = useRouter();

    function endSession() {
      store.dispatch('ui/openOverlay', {
        type: 'modal',
        id: 'verify-end-session',
        title: 'End Session',
        body: 'Are you sure you want to end this session?',
        mainButton: 'Yes',
        secondaryButton: 'No',
        modalListeners: {
          primary: async () => {
            await store.dispatch('session/stopSession');
            ctx.emit('close');
            router.push(PATH.home);
          },
          secondary: () => {
            // Don't do anything
          },
        },
      });
    }

    const reviewedVerses = computed(() => {
      return store.getters['session/reviewedVerses'];
    });

    const correctVerses = computed(() => {
      return reviewedVerses.value.filter((verse) => {
        return store.state.session.complete[verse.index]?.correct;
      });
    });

    const incorrectVerses = computed(() => {
      return reviewedVerses.value.filter((verse) => {
        return (
          store.state.session.complete[verse.index] &&
          !store.state.session.complete[verse.index].correct
        );
      });
    });

    const incompleteVerses = computed(() => {
      return [
        ...store.getters['session/unquotedVerses'],
        ...store.getters['session/skippedVerses'],
      ];
    });

    return {
      endSession,
      correctVerses,
      incorrectVerses,
      incompleteVerses,
      reference: referenceToString,
    };
  },
  components: { Button, VerseCompleteGraph },
});
</script>

<style lang="scss">
.qa-session-complete-overlay {
  width: 85%;
  height: 90%;
  background: var(--qa-color-white);
  border-radius: var(--qa-border-radius);
  box-sizing: border-box;
  @include media-larger(sm) {
    max-width: 85vw;
    max-height: 90vh;
  }
}

.qa-session-complete {
  box-sizing: border-box;
  height: 100%;
  padding: 10px 20px 20px;

  .qa-sc-content {
    min-height: 0;
    padding-bottom: 10px;
    overflow-y: auto;
  }

  .qa-sc-av-list {
    border: 1px solid var(--qa-color-white--darken-20);
    border-radius: var(--qa-border-radius);
    overflow-y: auto;
    min-height: 0;
    box-sizing: border-box;
    min-height: 40px;

    &:not(:first-child) {
      margin-left: 10px;
    }
  }

  .qa-sc-all-verses {
    min-height: 0;
  }

  @include media-larger(xs) {
    .qa-sc-all-verses {
      max-height: 100%;
    }
  }
}
</style>
