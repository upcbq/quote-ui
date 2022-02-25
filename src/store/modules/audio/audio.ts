import { RootState } from '@/store/store.interfaces';
import { Module } from 'vuex';
import { AudioState } from './audio.interfaces';

export const AudioStoreState: () => AudioState = () => ({});

export const AudioStoreMutations = {};

export const AudioStoreActions = {};

export const AudioStoreGetters = {};

export const audio: Module<AudioState, RootState> = {
  namespaced: true,
  state: AudioStoreState,
  mutations: AudioStoreMutations,
  actions: AudioStoreActions,
  getters: AudioStoreGetters,
};
