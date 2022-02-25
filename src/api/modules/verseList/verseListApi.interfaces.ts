import { IReference } from '@/api/types';

export interface VerseListLimitedResponse {
  _id: string;
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
