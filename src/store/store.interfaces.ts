import { CommitOptions, DispatchOptions, Store as VuexStore } from 'vuex';
import { RootStoreActions, RootStoreGetters, RootStoreMutations } from './store';
import { VerseListStoreModuleType } from '@/store/modules/verseList/verseList.interfaces';
import { SessionStoreModuleType } from '@/store/modules/session/session.interfaces';
import { AudioStoreModuleType } from '@/store/modules/audio/audio.interfaces';
import { UiStoreModuleType } from '@/store/modules/ui/ui.interfaces';
import { VerseStoreModuleType } from './modules/verse/verse.interfaces';

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

export type StoreType = VerseListStoreModuleType &
  SessionStoreModuleType &
  AudioStoreModuleType &
  UiStoreModuleType &
  VerseStoreModuleType;
