import { ApiModule } from '@/api/modules/base/ApiModule';
import { IVerse } from '@/api/types';
import { GetVersesRequest } from './verseApi.interfaces';

export class VerseApi extends ApiModule {
  constructor(baseUrl: string) {
    super(baseUrl, '/verse');
  }

  public async getVerse(
    book: string,
    chapter: number,
    verse: number,
    translation?: string
  ) {
    const url = `/${book}/${chapter}/${verse}${
      translation ? `?translation=${translation}` : ''
    }`;
    return this.get<IVerse>(url);
  }

  public async getChapter(book: string, chapter: number, translation?: string) {
    const url = `/${book}/${chapter}${translation ? `?translation=${translation}` : ''}`;
    return this.get<IVerse[]>(url);
  }

  public async getVerses(request: GetVersesRequest, translation?: string) {
    const url = `${translation ? `?translation=${translation}` : ''}`;
    return this.post<IVerse[]>(url, request);
  }
}
