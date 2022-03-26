import { bqQuoteApi } from '@/api/api';
import { IReference, IVerse } from '@/api/types';
import { RootState } from '@/store/store.interfaces';
import { RequestHelper } from '@/types/RequestState';
import { ActionContext, Module } from 'vuex';
import { VerseState } from './verse.interfaces';

function verseToKey(verse: IReference) {
  return `${verse.book}|${verse.chapter}|${verse.verse}`;
}

export const VerseStoreState: () => VerseState = () => ({
  verses: {},
});

export const VerseStoreMutations = {
  addVerse(state: VerseState, verse: IVerse) {
    state.verses[verseToKey(verse)] = verse;
  },
  addVerses(state: VerseState, verses: IVerse[]) {
    for (const verse of verses) {
      state.verses[verseToKey(verse)] = verse;
    }
  },
  resetVerses(state: VerseState) {
    state.verses = {};
  },
};

export const VerseStoreActions = {
  async fetchVerse(
    { commit, state }: ActionContext<VerseState, RootState>,
    verse: IReference
  ) {
    // If verse is cached, no reason to refetch it
    if (state.verses[verseToKey(verse)]) return;

    const requestHelper = new RequestHelper<IVerse>();
    const promise = requestHelper.start(
      bqQuoteApi.verse.getVerse(verse.book, verse.chapter, verse.verse)
    );
    const response = await promise;
    if (response.success) {
      commit('addVerse', response.data);
    }
  },
  async fetchVerses(
    { commit, state }: ActionContext<VerseState, RootState>,
    verses: IReference[]
  ) {
    // Check for cached verses to only fetch what is needed
    const uncachedVerses = verses.filter((v) => !state.verses[verseToKey(v)]);

    if (uncachedVerses.length > 0) {
      const requestHelper = new RequestHelper<IVerse[]>();
      const promise = requestHelper.start(
        bqQuoteApi.verse.getVerses({ verses: uncachedVerses })
      );
      const response = await promise;
      if (response.success) {
        commit('addVerses', response.data);
      }
    }
  },
};

export const VerseStoreGetters = {
  verses: (state: VerseState) => (v: IReference) => state.verses[verseToKey(v)],
};

export const verse: Module<VerseState, RootState> = {
  namespaced: true,
  state: VerseStoreState,
  mutations: VerseStoreMutations,
  actions: VerseStoreActions,
  getters: VerseStoreGetters,
};
