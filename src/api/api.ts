import { VerseApi } from './modules/verse/verse.api';
import { VerseListApi } from './modules/verseList/verseList.api';
import { BqApiConfigMap } from './types';

export class BqQuoteApi {
  public verse: VerseApi;
  public verseList: VerseListApi;

  public constructor(bqApiConfig: BqApiConfigMap) {
    this.verse = new VerseApi(bqApiConfig.verse);
    this.verseList = new VerseListApi(bqApiConfig.verseList);
  }
}

export const bqQuoteApi = new BqQuoteApi({
  verse: process.env?.VUE_APP_VERSE_API_URL,
  verseList: process.env?.VUE_APP_VERSE_LIST_API_URL,
});

// bqQuoteApi.axiosInstance.interceptors.request.use((config) => {
//   const token = store.state.auth.token;
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// bqQuoteApi.axiosInstance.interceptors.response.use(
//   (res) => {
//     if (res.data && typeof res.data.token === 'string') {
//       store.commit('auth/updateToken', res.data.token);
//     }
//     return res;
//   },
//   (err: AxiosError) => {
//     const res = err && err.response;
//     if (res && res.status === httpStatus.UNAUTHORIZED) {
//       store.dispatch('auth/logout');
//     }
//     throw err;
//   }
// );
