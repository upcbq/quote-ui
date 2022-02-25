import { createStore } from 'vuex';
import { verseList } from '@/store/modules/verseList/verseList';
import { session } from '@/store/modules/session/session';
import { audio } from '@/store/modules/audio/audio';
import { RootState, StoreType } from './store.interfaces';
import createPersistedState from 'vuex-persist-indexeddb';

const persistedSession = createPersistedState({
  paths: 'session',
});

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
    session,
    audio,
  },
  plugins: [persistedSession],
}) as StoreType;

export function useStore() {
  return store as StoreType;
}
