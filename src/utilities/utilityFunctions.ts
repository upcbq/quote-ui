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
