import { PATH } from '@/router/router';
import { useStore } from '@/store/store';
import { referenceToString } from '@/utilities/utilityFunctions';
import { useRouter } from 'vue-router';

export async function checkForSession() {
  const store = useStore();
  const router = useRouter();

  if (
    store.state.session.id &&
    store.state.session.selectedVerseListId &&
    store.state.session.finalVerseIndex > 0
  ) {
    await store.dispatch('session/fetchVerseList');
    const verses = store.getters['session/verseList'].verses;
    store.dispatch('ui/openOverlay', {
      id: 'session-recover-modal',
      type: 'modal',
      title: 'Session in progress',
      body: `Would you like to recover review session covering verses ${referenceToString(
        verses[0]
      )} - ${referenceToString(
        verses.at(store.state.session.finalVerseIndex) || verses[0]
      )} (${store.getters['session/reviewedVerses'].length} reviewed, ${
        store.getters['session/unreviewedVerses'].length
      } recorded)?`,
      mainButton: 'Yes',
      secondaryButton: 'No',
      modalListeners: {
        primary: () => {
          router.push(PATH.quote);
        },
        secondary: () => {
          store.dispatch('session/stopSession');
        },
      },
    });
  }
}
