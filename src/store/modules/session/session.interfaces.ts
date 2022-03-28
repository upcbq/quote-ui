import { CommitOptions, DispatchOptions, Store as VuexStore } from 'vuex';
import {
  SessionStoreActions,
  SessionStoreGetters,
  SessionStoreMutations,
} from './session';

export interface VerseCheat {
  type: 'firstWord' | 'incompleteListen' | 'replace';
  amount: number;
}

export interface SessionCompleteVerse {
  recorded: boolean;
  correct: boolean;
  reviewed: boolean;
  skipped: boolean;
  order: number;
  index: number;
  cheats: VerseCheat[];
}

export interface SessionOptions {
  autoAdvance: boolean;
  batchSize: number;
  playbackSpeed: number;
}

export interface SessionState {
  selectedVerseListId: string;
  finalVerseIndex: number;
  complete: Record<number, SessionCompleteVerse>;
  order: number[];
  shuffle: boolean;
  options: SessionOptions;
  id: string;
}

type SessionNamespace<N extends string> = `session/${N}`;

export type SessionStoreModuleType<S = SessionState> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch' | 'state'
> & {
  commit<
    K extends keyof typeof SessionStoreMutations,
    P extends Parameters<typeof SessionStoreMutations[K]>[1]
  >(
    key: SessionNamespace<K>,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<typeof SessionStoreMutations[K]>;
} & {
  getters: {
    [K in keyof typeof SessionStoreGetters as SessionNamespace<K>]: ReturnType<
      typeof SessionStoreGetters[K]
    >;
  };
} & {
  dispatch<K extends keyof typeof SessionStoreActions>(
    key: SessionNamespace<K>,
    payload?: Parameters<typeof SessionStoreActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<typeof SessionStoreActions[K]>;
} & {
  state: {
    session: {
      [K in keyof SessionState]: SessionState[K];
    };
  };
};
