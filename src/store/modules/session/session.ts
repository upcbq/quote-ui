import { VerseListResponse } from '@/api/modules/verseList/verseListApi.interfaces';
import { RootState, StoreType } from '@/store/store.interfaces';
import { ActionContext, Module } from 'vuex';
import { SessionState } from './session.interfaces';

export const SessionStoreState: () => SessionState = () => ({
  selectedVerseListId: '',
});

export const SessionStoreMutations = {
  setSelectedVerseListId(
    state: SessionState,
    selectedVerseListId: SessionState['selectedVerseListId']
  ) {
    state.selectedVerseListId = selectedVerseListId;
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
};

export const session: Module<SessionState, RootState> = {
  namespaced: true,
  state: SessionStoreState,
  mutations: SessionStoreMutations,
  actions: SessionStoreActions,
  getters: SessionStoreGetters,
};
