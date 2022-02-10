import { CommitOptions, DispatchOptions, Store as VuexStore } from 'vuex';
import { RootStoreActions, RootStoreGetters, RootStoreMutations } from './store';
import { VerseListStoreModuleType } from './modules/verseList/verseList.interfaces';

export interface RootState {}

export type RootStoreType<S = RootState> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch'
> & {
  commit<
    K extends keyof typeof RootStoreMutations,
    P extends Parameters<typeof RootStoreMutations[K]>[1]
  >(
    key: K,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<typeof RootStoreMutations[K]>;
} & {
  getters: {
    [K in keyof typeof RootStoreGetters]: ReturnType<typeof RootStoreGetters[K]>;
  };
} & {
  dispatch<K extends keyof typeof RootStoreActions>(
    key: K,
    payload?: Parameters<typeof RootStoreActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<typeof RootStoreActions[K]>;
};

export type StoreType = VerseListStoreModuleType;
