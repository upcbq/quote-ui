import localforage from 'localforage';
import { extendPrototype as extendIndexes } from 'localforage-indexes';
import { extendPrototype as extendGetItems } from 'localforage-getitems';
import { extendPrototype as extendStartsWith } from 'localforage-startswith';

extendGetItems(localforage);
extendStartsWith(localforage);
extendIndexes(localforage);

import { IDbAudio } from './audio.db.types';

/**
 * Audio storge service; stores audio to indexeddb using localforage.
 *
 * Don't want to use the vuex store with an indexeddb persistence for this to avoid double storage
 * of potentially larget objects.
 *
 * Structure is:
 * quote-app-audio
 */
export class AudioDb {
  private static db: LocalForage;

  public static initialize() {
    if (!this.db) {
      this.db = localforage.createInstance({
        name: 'quote-app-audio',
        driver: localforage.INDEXEDDB,
        storeName: 'audio',
      });
    }
  }

  public static async addAudio(dbAudio: IDbAudio) {
    return this.db?.setItem(`${dbAudio.sessionId}-${dbAudio.verseIndex}`, dbAudio);
  }

  public static async getAudio(
    sessionId: string,
    verseIndex: number
  ): Promise<IDbAudio | null> {
    return this.db?.getItem(`${sessionId}-${verseIndex}`);
  }

  public static async deleteAudio(sessionId: string, verseIndex: number) {
    return this.db?.removeItem(`${sessionId}-${verseIndex}`);
  }

  public static async deleteMultipleAudio(sessionId: string, verseIndexes: number[]) {
    for (const verseIndex of verseIndexes) {
      await this.deleteAudio(sessionId, verseIndex);
    }
  }

  public static async getAllSessionAudio(
    sessionId: string
  ): Promise<Record<string, IDbAudio>> {
    return this.db?.startsWith(`${sessionId}-`);
  }

  public static async deleteSessionAudio(sessionId: string) {
    const sessionAudio = await this.db?.keysStartingWith(`${sessionId}-`);
    for (const key of sessionAudio) {
      await this.db?.removeItem(key);
    }
  }

  public static async clearAllAudio() {
    for (const key of await this.db?.keys()) {
      await this.db?.removeItem(key);
    }
  }

  public static async calculateStorageUsed() {
    const items: Record<string, IDbAudio> = await this.db?.getItems();

    let size = 0;
    for (const key in items) {
      const audio = items[key];
      size += audio.audio.data.byteLength;
      size += audio.audio.type.length;
      size += audio.sessionId.length;
      size += 8; // adding the 8 bytes for the verseIndex number
    }

    return size;
  }
}
