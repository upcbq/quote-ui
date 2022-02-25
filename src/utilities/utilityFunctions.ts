import { IReference } from '@/api/types';

export function referenceToString(ref: IReference) {
  return `${ref.book} ${ref.chapter}:${ref.verse}`;
}
