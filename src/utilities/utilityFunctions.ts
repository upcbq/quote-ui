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
  const mult = Math.pow(10, precision);
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

export function bytesToHuman(size: number) {
  const i = size === 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return `${roundTo(size / Math.pow(1024, i), 2)} ${['B', 'kB', 'MB', 'GB', 'TB'][i]}`;
}

export function chooseNearest(value: number, options: number[]) {
  return [...options].sort((a, b) => Math.abs(value - a) - Math.abs(value - b)).at(0);
}

export function secondsToHuman(secs: number, useMs = false) {
  const hr = Math.floor(secs / 3600);
  let min: string | number = Math.floor((secs - hr * 3600) / 60);
  let sec: string | number = Math.floor(secs - hr * 3600 - min * 60);
  const ms = secs % 1;

  if (min < 10) {
    min = `0${min}`;
  }

  if (sec < 10) {
    sec = `0${sec}`;
  }

  if (hr <= 0) {
    return `${min}:${sec}${useMs ? `.${ms.toFixed(3).substring(2)}` : ''}`;
  }

  return `${hr}:${min}:${sec}${useMs ? `.${ms.toFixed(3).substring(2)}` : ''}`;
}
