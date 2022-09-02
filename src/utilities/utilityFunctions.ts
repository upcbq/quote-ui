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

export function mergeDefault<T extends object>(
  defaultData: T,
  currentData: T | undefined,
  newData: Partial<T>
) {
  return currentData
    ? {
        ...currentData,
        ...newData,
      }
    : {
        ...defaultData,
        ...newData,
      };
}

export function roundTo(num: number, precision: number) {
  const mult = 10 ^ precision;
  return Math.round((num + Number.EPSILON) * mult) / mult;
}

export function randomNormalDist() {
  const u = 1 - Math.random(); //Converting [0,1) to (0,1)
  const v = Math.random();
  return (
    boundedNumber(Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v) + 3, 0, 6) /
    6
  );
}

export function generatePlaceholderText(length: number, averageWordLength = 12) {
  let dummyText = '';
  while (dummyText.length < length) {
    const wordLength = Math.max(1, Math.round(averageWordLength * randomNormalDist()));
    dummyText += '█'.repeat(wordLength) + ' ';
  }
  return dummyText.slice(0, length);
}
