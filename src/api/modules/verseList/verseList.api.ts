import { ApiModule } from '@/api/modules/base/ApiModule';
import { VerseListLimitedResponse } from './verseListApi.interfaces';

export class VerseListApi extends ApiModule {
  constructor(baseUrl: string) {
    super(baseUrl, '/verse');
  }

  public async getVerseLists() {
    return this.get<VerseListLimitedResponse[]>('');
  }
}
