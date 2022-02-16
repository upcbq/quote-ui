import { IReference } from '@/api/types';

export interface VerseListLimitedResponse {
  name: string;
  year: number;
  count: number;
  organization: string;
  division: string;
  translation: string;
}

export interface VerseListResponse extends VerseListLimitedResponse {
  verses: IReference[];
}
