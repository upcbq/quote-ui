import { IReference } from '@/api/types';

export function displayBook(book: string) {
  return book
    .split('-')
    .map((s) => `${s[0].toUpperCase()}${s.slice(1).toLowerCase()}`)
    .join(' ');
}

export function referenceToString(ref: IReference) {
  return `${displayBook(ref.book)} ${ref.chapter}:${ref.verse}`;
}

export function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function indexArray(length: number) {
  return Array.from(Array(length)).map((a, i) => i);
}

export function boundedNumber(num: number, min: number = num, max: number = num) {
  return Math.min(Math.max(min, num), max);
}
