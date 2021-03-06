import { createStore } from 'vuex';
import { verseList } from '@/store/modules/verseList/verseList';
import { session } from '@/store/modules/session/session';
import { audio } from '@/store/modules/audio/audio';
import { ui } from '@/store/modules/ui/ui';
import { verse } from '@/store/modules/verse/verse';
import { RootState, StoreType } from './store.interfaces';
import VuexPersistence from 'vuex-persist';

const sessionPersistence = new VuexPersistence({
  storage: window.localStorage,
  modules: ['session', 'verseList'],
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
    ui,
    verse,
  },
  plugins: [sessionPersistence.plugin],
}) as StoreType;

export function useStore() {
  return store as StoreType;
}
