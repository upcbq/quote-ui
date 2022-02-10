import { createStore } from 'vuex';
import { verseList } from '@/store/modules/verseList/verseList';
import { RootState, StoreType } from './store.interfaces';

export const RootStoreState: () => RootState = () => ({});

export const RootStoreMutations = {};

export const RootStoreActions = {};

export const RootStoreGetters = {};

export const store = createStore({
  state: RootStoreState,
  mutations: RootStoreMutations,
  actions: RootStoreActions,
  modules: {
    verseList,
  },
}) as StoreType;

export function useStore() {
  return store as StoreType;
}
