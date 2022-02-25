/* eslint-disable @typescript-eslint/interface-name-prefix */

export interface IVerse {
  book: string;
  chapter: number;
  verse: number;
  translation: string;
  text: string;
}

export interface IReference {
  book: string;
  chapter: number;
  verse: number;
}

export type BqApiModule = 'verse' | 'verseList';
export type BqApiConfigMap = Record<BqApiModule, string>;
