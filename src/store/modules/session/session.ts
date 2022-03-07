import { VerseListResponse } from '@/api/modules/verseList/verseListApi.interfaces';
import { IReference } from '@/api/types';
import { RootState, StoreType } from '@/store/store.interfaces';
import { ActionContext, Module } from 'vuex';
import { SessionState } from './session.interfaces';

export const SessionStoreState: () => SessionState = () => ({
  selectedVerseListId: '',
  finalVerseIndex: -1,
  complete: {},
});

export const SessionStoreMutations = {
  setSelectedVerseListId(
    state: SessionState,
    selectedVerseListId: SessionState['selectedVerseListId']
  ) {
    state.selectedVerseListId = selectedVerseListId;
  },
  setFinalVerseIndex(state: SessionState, finalVerseIndex: number) {
    state.finalVerseIndex = finalVerseIndex;
  },
};

export const SessionStoreActions = {
  async fetchVerseList({ state, dispatch }: ActionContext<SessionState, RootState>) {
    await (dispatch as StoreType['dispatch'])(
      'verseList/fetchVerseList',
      state.selectedVerseListId,
      { root: true }
    );
  },
  quoteVerse({ state }: ActionContext<SessionState, RootState>, verseIndex: number) {
    state.complete[verseIndex] = { reviewed: false, correct: false };
  },
  unquoteVerse({ state }: ActionContext<SessionState, RootState>, verseIndex: number) {
    delete state.complete[verseIndex];
  },
  reviewVerse(
    { state }: ActionContext<SessionState, RootState>,
    { verseIndex, correct }: { verseIndex: number; correct: boolean }
  ) {
    state.complete[verseIndex] = { reviewed: true, correct };
  },
};

export const SessionStoreGetters = {
  verseList(
    state: SessionState,
    getters: Record<string, unknown>,
    rootState: RootState
  ): VerseListResponse {
    return (rootState as StoreType['state']).verseList.verseListCache[
      state.selectedVerseListId
    ];
  },
  limitedVerses(state: SessionState, getters: { verseList: VerseListResponse }) {
    return getters.verseList?.verses?.slice(0, state.finalVerseIndex + 1) || [];
  },
  unquotedVerses(
    state: SessionState,
    getters: { limitedVerses: VerseListResponse['verses'] }
  ) {
    return (
      getters.limitedVerses?.filter((v, i) => {
        return !state.complete[i];
      }) || []
    );
  },
  unreviewedVerses(
    state: SessionState,
    getters: { limitedVerses: VerseListResponse['verses'] }
  ) {
    return (
      getters.limitedVerses?.filter((v, i) => {
        return state.complete[i]?.reviewed === false;
      }) || []
    );
  },
  reviewedVerses(
    state: SessionState,
    getters: { limitedVerses: VerseListResponse['verses'] }
  ) {
    return (
      getters.limitedVerses?.filter((v, i) => {
        return state.complete[i]?.reviewed === true;
      }) || []
    );
  },
  randomCardIndex(state: SessionState, getters: { unquotedVerses: IReference[] }) {
    return Math.floor(Math.random() * getters.unquotedVerses.length);
  },
};

export const session: Module<SessionState, RootState> = {
  namespaced: true,
  state: SessionStoreState,
  mutations: SessionStoreMutations,
  actions: SessionStoreActions,
  getters: SessionStoreGetters,
};
