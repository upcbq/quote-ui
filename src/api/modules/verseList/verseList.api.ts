import { ApiModule } from '@/api/modules/base/ApiModule';
import { VerseListLimitedResponse, VerseListResponse } from './verseListApi.interfaces';

export class VerseListApi extends ApiModule {
  constructor(baseUrl: string) {
    super(baseUrl, '/verseList');
  }

  public async getVerseLists(organization?: string) {
    return this.get<VerseListLimitedResponse[]>('', { params: { organization } });
  }

  public async getVerseList(verseListId: string) {
    return this.get<VerseListResponse>(`/${verseListId}`);
  }
}
