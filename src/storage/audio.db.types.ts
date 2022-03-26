export interface IDbAudio {
  sessionId: string;
  verseIndex: number;
  audio: IDbFile;
}

export interface IDbFile {
  type: string;
  data: ArrayBuffer;
}
