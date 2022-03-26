import { IVerse } from '@/api/types';
import { CommitOptions, DispatchOptions, Store as VuexStore } from 'vuex';
import { VerseStoreActions, VerseStoreGetters, VerseStoreMutations } from './verse';

export interface VerseState {
  verses: Record<string, IVerse>;
}

type VerseNamespace<N extends string> = `verse/${N}`;

export type VerseStoreModuleType<S = VerseState> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch' | 'state'
> & {
  commit<
    K extends keyof typeof VerseStoreMutations,
    P extends Parameters<typeof VerseStoreMutations[K]>[1]
  >(
    key: VerseNamespace<K>,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<typeof VerseStoreMutations[K]>;
} & {
  getters: {
    [K in keyof typeof VerseStoreGetters as VerseNamespace<K>]: ReturnType<
      typeof VerseStoreGetters[K]
    >;
  };
} & {
  dispatch<K extends keyof typeof VerseStoreActions>(
    key: VerseNamespace<K>,
    payload?: Parameters<typeof VerseStoreActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<typeof VerseStoreActions[K]>;
} & {
  state: {
    verse: {
      [K in keyof VerseState]: VerseState[K];
    };
  };
};
