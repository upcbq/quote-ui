import { CommitOptions, DispatchOptions, Store as VuexStore } from 'vuex';
import { AudioStoreActions, AudioStoreGetters, AudioStoreMutations } from './audio';

export interface AudioState {}

type AudioNamespace<N extends string> = `audio/${N}`;

export type AudioStoreModuleType<S = AudioState> = Omit<
  VuexStore<S>,
  'commit' | 'getters' | 'dispatch' | 'state'
> & {
  commit<
    K extends keyof typeof AudioStoreMutations,
    P extends Parameters<typeof AudioStoreMutations[K]>[1]
  >(
    key: AudioNamespace<K>,
    payload?: P,
    options?: CommitOptions
  ): ReturnType<typeof AudioStoreMutations[K]>;
} & {
  getters: {
    [K in keyof typeof AudioStoreGetters as AudioNamespace<K>]: ReturnType<
      typeof AudioStoreGetters[K]
    >;
  };
} & {
  dispatch<K extends keyof typeof AudioStoreActions>(
    key: AudioNamespace<K>,
    payload?: Parameters<typeof AudioStoreActions[K]>[1],
    options?: DispatchOptions
  ): ReturnType<typeof AudioStoreActions[K]>;
} & {
  state: {
    audio: {
      [K in keyof AudioState]: AudioState[K];
    };
  };
};
