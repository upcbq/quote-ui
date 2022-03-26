import { VerseListResponse } from '@/api/modules/verseList/verseListApi.interfaces';
import { IReference } from '@/api/types';
import { RootState, StoreType } from '@/store/store.interfaces';
import { indexArray, shuffle as shuffleArr } from '@/utilities/utilityFunctions';
import { ActionContext, Module } from 'vuex';
import { SessionCompleteVerse, SessionState } from './session.interfaces';
import { v4 as uuidv4 } from 'uuid';
import { AudioDb } from '@/storage/audio.db';

export const SessionStoreState: () => SessionState = () => ({
  selectedVerseListId: '',
  finalVerseIndex: -1,
  complete: {},
  order: [],
  shuffle: false,
  options: {
    autoAdvance: false,
    batchSize: -1,
    playbackSpeed: 1,
  },
  id: '',
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
    state.order = indexArray(finalVerseIndex);
  },
  setComplete(
    state: SessionState,
    {
      key,
      complete,
    }: { key: keyof SessionState['complete']; complete: SessionState['complete'][number] }
  ) {
    state.complete[key] = complete;
  },
  resetComplete(state: SessionState) {
    state.complete = {};
  },
  setShuffle(state: SessionState, shuffle: boolean) {
    state.shuffle = shuffle;
  },
  setOrder(state: SessionState, order: SessionState['order']) {
    state.order = order;
  },
  setAutoAdvance(
    state: SessionState,
    autoAdvance: SessionState['options']['autoAdvance']
  ) {
    state.options.autoAdvance = autoAdvance;
  },
  generateSessionId(state: SessionState) {
    state.id = uuidv4();
  },
  resetSessionId(state: SessionState) {
    state.id = '';
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
  quoteVerse(
    { commit, getters }: ActionContext<SessionState, RootState>,
    verseIndex: number
  ) {
    const order = getters.unquotedVerses.length;
    commit('setComplete', {
      key: verseIndex,
      complete: {
        reviewed: false,
        correct: false,
        skipped: false,
        index: verseIndex,
        order,
      },
    });
  },
  unquoteVerse({ state }: ActionContext<SessionState, RootState>, verseIndex: number) {
    delete state.complete[verseIndex];
  },
  reviewVerse(
    { commit, state }: ActionContext<SessionState, RootState>,
    { verseIndex, correct }: { verseIndex: number; correct: boolean }
  ) {
    commit('setComplete', {
      key: verseIndex,
      complete: {
        ...state.complete[verseIndex],
        reviewed: true,
        correct,
        skipped: false,
      },
    });
  },
  skipVerse(
    { commit, state }: ActionContext<SessionState, RootState>,
    verseIndex: number
  ) {
    commit('setComplete', {
      key: verseIndex,
      complete: {
        ...state.complete[verseIndex],
        reviewed: false,
        correct: false,
        skipped: true,
      },
    });
  },
  shuffle({ commit, getters }: ActionContext<SessionState, RootState>, shuffle: boolean) {
    commit('setShuffle', shuffle);
    if (shuffle) {
      commit('setOrder', shuffleArr(indexArray(getters.limitedVerses?.length || 0)));
    } else {
      commit('setOrder', indexArray(getters.limitedVerses?.length || 0));
    }
  },
  async startSession(
    { commit, dispatch, state }: ActionContext<SessionState, RootState>,
    finalVerseIndex: SessionState['finalVerseIndex']
  ) {
    await dispatch('clearAudio');
    commit('generateSessionId');
    commit('setFinalVerseIndex', finalVerseIndex);
    commit('resetComplete');
    if (state.shuffle) {
      dispatch('shuffle', state.shuffle);
    }
    // Read any default / user settings here for session data
  },
  async clearAudio({ state }: ActionContext<SessionState, RootState>) {
    try {
      if (state.id) {
        await AudioDb.deleteSessionAudio(state.id);
      }
    } catch (e) {
      console.log(e);
      // some issue deleting session audio
    }
  },
  async stopSession({ commit, dispatch }: ActionContext<SessionState, RootState>) {
    await dispatch('clearAudio');
    commit('resetSessionId');
    commit('resetComplete');
    commit('setFinalVerseIndex', -1);
    commit('setSelectedVerseListId', '');
    commit('setOrder', []);
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
  orderedVerses(
    state: SessionState,
    getters: { limitedVerses: VerseListResponse['verses'] }
  ) {
    const limitedVerses = getters.limitedVerses;
    return state.order
      .map((v) => {
        const verse = limitedVerses[v];
        if (verse) {
          return {
            ...verse,
            index: v,
          };
        }
        return undefined;
      })
      .filter((v) => v !== undefined);
  },
  unquotedVerses(
    state: SessionState,
    getters: { orderedVerses: Array<IReference & { index: number }> }
  ) {
    const orderedVerses = getters.orderedVerses;
    return (
      orderedVerses?.filter((v) => {
        return !state.complete[v.index];
      }) || []
    );
  },
  unreviewedVerses(
    state: SessionState,
    getters: {
      orderedVerses: Array<IReference & { index: number }>;
      limitedVerses: IReference[];
    }
  ) {
    const orderedVerses = getters.orderedVerses;
    const limitedVerses = getters.limitedVerses;
    return orderedVerses
      .reduce((arr, v) => {
        if (
          state.complete[v.index]?.reviewed === false &&
          state.complete[v.index]?.skipped === false
        ) {
          arr.push(state.complete[v.index]);
        }
        return arr;
      }, [] as SessionCompleteVerse[])
      .sort((a, b) => a.order - b.order)
      .reduce((arr, cv) => {
        const v = limitedVerses.at(cv.index);
        if (v) {
          arr.push({
            ...v,
            index: cv.index,
          });
        }
        return arr;
      }, [] as Array<IReference & { index: number }>);
  },
  reviewedVerses(
    state: SessionState,
    getters: {
      orderedVerses: Array<IReference & { index: number }>;
      limitedVerses: IReference[];
    }
  ) {
    const orderedVerses = getters.orderedVerses;
    const limitedVerses = getters.limitedVerses;
    return orderedVerses
      .reduce((arr, v) => {
        if (
          state.complete[v.index]?.reviewed === true &&
          state.complete[v.index]?.skipped === false
        ) {
          arr.push(state.complete[v.index]);
        }
        return arr;
      }, [] as SessionCompleteVerse[])
      .sort((a, b) => a.order - b.order)
      .map((cv) => limitedVerses.at(cv.index))
      .filter((ref) => !!ref) as IReference[];
  },
  skippedVerses(
    state: SessionState,
    getters: {
      orderedVerses: Array<IReference & { index: number }>;
      limitedVerses: IReference[];
    }
  ) {
    const orderedVerses = getters.orderedVerses;
    const limitedVerses = getters.limitedVerses;
    return orderedVerses
      .reduce((arr, v) => {
        if (state.complete[v.index]?.skipped === true) {
          arr.push(state.complete[v.index]);
        }
        return arr;
      }, [] as SessionCompleteVerse[])
      .sort((a, b) => a.order - b.order)
      .map((cv) => limitedVerses.at(cv.index))
      .filter((ref) => !!ref) as IReference[];
  },
};

export const session: Module<SessionState, RootState> = {
  namespaced: true,
  state: SessionStoreState,
  mutations: SessionStoreMutations,
  actions: SessionStoreActions,
  getters: SessionStoreGetters,
};
