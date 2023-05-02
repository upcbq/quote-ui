import { VerseListResponse } from '@/api/modules/verseList/verseListApi.interfaces';
import { IReference } from '@/api/types';
import { RootState, StoreType } from '@/store/store.interfaces';
import {
  indexArray,
  mergeDefault,
  shuffle as shuffleArr,
} from '@/utilities/utilityFunctions';
import { ActionContext, Module } from 'vuex';
import { SessionCompleteVerse, SessionState, VerseCheat } from './session.interfaces';
import { v4 as uuidv4 } from 'uuid';
import { AudioDb } from '@/storage/audio.db';

export const SessionStoreState: () => SessionState = () => ({
  selectedVerseListId: '',
  finalVerseIndex: -1,
  complete: {},
  order: [],
  shuffle: false,
  organization: '',
  displayText: false,
  options: {
    autoAdvance: false,
    batchSize: -1,
    playbackSpeed: 1,
    coachMode: false,
  },
  id: '',
});

const defaultComplete: SessionCompleteVerse = {
  recorded: false,
  reviewed: false,
  correct: false,
  skipped: false,
  index: -1,
  cheats: [],
  order: -1,
};

export const SessionStoreMutations = {
  setSelectedVerseListId(
    state: SessionState,
    selectedVerseListId: SessionState['selectedVerseListId']
  ) {
    state.selectedVerseListId = selectedVerseListId;
  },
  setFinalVerseIndex(state: SessionState, finalVerseIndex: number) {
    state.finalVerseIndex = finalVerseIndex;
    if (finalVerseIndex >= 0) {
      state.order = indexArray(finalVerseIndex);
    }
  },
  setComplete(
    state: SessionState,
    {
      key,
      complete,
    }: {
      key: keyof SessionState['complete'];
      complete: SessionState['complete'][number];
    }
  ) {
    if (complete) {
      state.complete[key] = {
        ...complete,
        index: key,
      };
    } else {
      delete state.complete[key];
    }
  },
  setAllComplete(state: SessionState, complete: SessionState['complete']) {
    state.complete = complete;
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
  setBatchSize(state: SessionState, batchSize: SessionState['options']['batchSize']) {
    state.options.batchSize = batchSize;
  },
  setPlaybackSpeed(
    state: SessionState,
    playbackSpeed: SessionState['options']['playbackSpeed']
  ) {
    state.options.playbackSpeed = playbackSpeed;
  },
  setCoachMode(state: SessionState, coachMode: SessionState['options']['coachMode']) {
    state.options.coachMode = coachMode;
    if (!coachMode) {
      state.displayText = false;
    }
  },
  setDisplayText(state: SessionState, displayText: SessionState['displayText']) {
    state.displayText = displayText;
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
    { commit, state }: ActionContext<SessionState, RootState>,
    verseIndex: number
  ) {
    const order = Object.keys(state.complete).length;
    commit('setComplete', {
      key: verseIndex,
      complete: mergeDefault(defaultComplete, state.complete[verseIndex], {
        index: verseIndex,
        order,
        recorded: true,
      }),
    });
  },
  unquoteVerse(
    { state, commit, getters }: ActionContext<SessionState, RootState>,
    verseIndex: number
  ) {
    const cheats: VerseCheat[] = getters.cheats(verseIndex) || [];
    const cheatsWithoutReplace = cheats.filter((c) => c.type !== 'replace');
    const replaceCheat = cheats.find((c) => c.type === 'replace') || {
      type: 'replace',
      amount: 0,
    };
    replaceCheat.amount++;

    commit('setComplete', {
      key: verseIndex,
      complete: mergeDefault(defaultComplete, state.complete[verseIndex], {
        recorded: false,
        cheats: [...cheatsWithoutReplace, replaceCheat],
        correct: undefined,
        skipped: false,
        reviewed: false,
      }),
    });
  },
  reviewVerse(
    { commit, state }: ActionContext<SessionState, RootState>,
    { verseIndex, correct }: { verseIndex: number; correct: boolean }
  ) {
    const order = state.complete[verseIndex]?.order || Object.keys(state.complete).length;
    commit('setComplete', {
      key: verseIndex,
      complete: mergeDefault(defaultComplete, state.complete[verseIndex], {
        index: verseIndex,
        recorded: true,
        reviewed: true,
        correct,
        skipped: false,
        order,
      }),
    });
  },
  skipVerse(
    { commit, state }: ActionContext<SessionState, RootState>,
    verseIndex: number
  ) {
    const order = Object.keys(state.complete).length;
    commit('setComplete', {
      key: verseIndex,
      complete: mergeDefault(defaultComplete, state.complete[verseIndex], {
        reviewed: false,
        correct: false,
        skipped: true,
        order,
      }),
    });
  },
  unskipVerse(
    { commit, state }: ActionContext<SessionState, RootState>,
    verseIndex: number
  ) {
    commit('setComplete', {
      key: verseIndex,
      complete: mergeDefault(defaultComplete, state.complete[verseIndex], {
        index: verseIndex,
        skipped: false,
      }),
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
  // Cheats below here
  giveStartWord(
    { commit, state }: ActionContext<SessionState, RootState>,
    verseIndex: number
  ) {
    const complete = state.complete[verseIndex] as undefined | SessionCompleteVerse;
    const cheats = complete?.cheats.filter((c) => c.type !== 'firstWord') || [];
    const firstWordCheat = complete?.cheats.find((c) => c.type === 'firstWord') || {
      type: 'firstWord',
      amount: 0,
    };
    firstWordCheat.amount++;

    const order =
      complete?.order !== undefined && complete.order > -1
        ? complete.order
        : Object.keys(state.complete).length;

    commit('setComplete', {
      key: verseIndex,
      complete: mergeDefault(defaultComplete, state.complete[verseIndex], {
        index: verseIndex,
        order,
        cheats: [...cheats, firstWordCheat],
      }),
    });
  },
  markIncompleteListen(
    { commit, state }: ActionContext<SessionState, RootState>,
    { verseIndex, percent }: { verseIndex: number; percent: number }
  ) {
    const complete = state.complete[verseIndex] as SessionCompleteVerse | undefined;
    const cheats = complete?.cheats || [];
    const cheatsWithoutIncompleteListen = cheats.filter(
      (c) => c.type === 'incompleteListen'
    );
    commit('setComplete', {
      key: verseIndex,
      complete: mergeDefault(defaultComplete, state.complete[verseIndex], {
        cheats: [
          ...cheatsWithoutIncompleteListen,
          {
            type: 'incompleteListen',
            amount: percent,
          },
        ],
      }),
    });
  },
  // Temporary for debugging
  // TODO: remove
  markAllUnreviewed({ commit, state }: ActionContext<SessionState, RootState>) {
    const complete = { ...state.complete };
    for (const key in complete) {
      complete[key] = {
        ...complete[key],
        correct: false,
        reviewed: false,
      };
    }
    commit('setAllComplete', complete);
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
    return getters.verseList?.verses?.slice(0, state.finalVerseIndex) || [];
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
        return !state.complete[v.index]?.recorded && !state.complete[v.index]?.skipped;
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
          state.complete[v.index]?.skipped === false &&
          state.complete[v.index]?.recorded === true
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
      .map((cv) => ({
        ...limitedVerses.at(cv.index),
        index: cv.index,
      }))
      .filter((ref) => !!ref) as Array<IReference & { index: number }>;
  },
  cheats(state: SessionState) {
    return (verseIndex: number) => {
      const complete = state.complete[verseIndex] as SessionCompleteVerse | undefined;
      return complete?.cheats || [];
    };
  },
  cheatType(
    state: SessionState,
    getters: {
      cheats: (verseIndex: number) => VerseCheat[];
    }
  ) {
    return (verseIndex: number, type: VerseCheat['type']) => {
      const cheats = getters.cheats(verseIndex);
      return cheats.find((c) => c.type === type);
    };
  },
};

export const session: Module<SessionState, RootState> = {
  namespaced: true,
  state: SessionStoreState,
  mutations: SessionStoreMutations,
  actions: SessionStoreActions,
  getters: SessionStoreGetters,
};
