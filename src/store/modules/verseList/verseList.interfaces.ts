import {
  VerseListLimitedResponse,
  VerseListResponse,
} from '@/api/modules/verseList/verseListApi.interfaces';
import { CommitOptions, DispatchOptions, Store as VuexStore } from 'vuex';
import {
  VerseListStoreActions,
  VerseListStoreGetters,
  VerseListStoreMutations,
} from './verseList';

export interface VerseListState {
  verseLists: VerseListLimitedResponse[];
  verseListCache: Record<string, VerseListResponse>;
}

type VerseListNamespace<N extends string> = `verseList/${N}`;

export type VerseListStoreModuleType<S = VerseListState> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch' | 'state'
> & {
  commit<
    K extends keyof typeof VerseListStoreMutations,
    P extends Parameters<typeof VerseListStoreMutations[K]>[1]
  >(
    key: VerseListNamespace<K>,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<typeof VerseListStoreMutations[K]>;
} & {
  getters: {
    [K in keyof typeof VerseListStoreGetters as VerseListNamespace<K>]: ReturnType<
      typeof VerseListStoreGetters[K]
    >;
  };
} & {
  dispatch<K extends keyof typeof VerseListStoreActions>(
    key: VerseListNamespace<K>,
    payload?: Parameters<typeof VerseListStoreActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<typeof VerseListStoreActions[K]>;
} & {
  state: {
    verseList: {
      [K in keyof VerseListState]: VerseListState[K];
    };
  };
};
