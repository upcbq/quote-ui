import { bqQuoteApi } from '@/api/api';
import {
  VerseListLimitedResponse,
  VerseListResponse,
} from '@/api/modules/verseList/verseListApi.interfaces';
import { RootState } from '@/store/store.interfaces';
import { RequestHelper } from '@/types/RequestState';
import { ActionContext, Module } from 'vuex';
import { VerseListState } from './verseList.interfaces';

export const VerseListStoreState: () => VerseListState = () => ({
  verseLists: [],
  verseListCache: {},
});

export const VerseListStoreMutations = {};

export const VerseListStoreActions = {
  async fetchVerseLists({ state }: ActionContext<VerseListState, RootState>) {
    const requestHelper = new RequestHelper<VerseListLimitedResponse[]>();
    const promise = requestHelper.start(bqQuoteApi.verseList.getVerseLists());
    const response = await promise;
    if (response.success) {
      state.verseLists = response.data;
    }
  },
  async fetchVerseList(
    { state }: ActionContext<VerseListState, RootState>,
    verseListId: string
  ) {
    const requestHelper = new RequestHelper<VerseListResponse>();
    const promise = requestHelper.start(bqQuoteApi.verseList.getVerseList(verseListId));
    const response = await promise;
    if (response.success) {
      state.verseListCache[verseListId] = response.data;
    }
  },
};

export const VerseListStoreGetters = {};

export const verseList: Module<VerseListState, RootState> = {
  namespaced: true,
  state: VerseListStoreState,
  mutations: VerseListStoreMutations,
  actions: VerseListStoreActions,
  getters: VerseListStoreGetters,
};
