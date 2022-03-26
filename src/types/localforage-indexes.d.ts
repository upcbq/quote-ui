/// <reference types="localforage" />

interface LocalForageWithIndexes extends LocalForage {
  createIndex: (
    indexName: string,
    keyPath: string,
    options: IDBIndexParameters,
    callback?: LocalForageCallback<IDBIndex>
  ) => Promise<IDBIndex>;
  getIndex: (
    indexName: string,
    callback?: LocalForageCallback<IDBIndex>
  ) => Promise<IDBIndex>;
  updateIndex: (
    indexName: string,
    keyPath: string,
    options: IDBIndexParameters,
    callback?: LocalForageCallback<IDBIndex>
  ) => Promise<IDBIndex>;
  deleteIndex: (indexName: string, callback?: LocalForageCallback) => Promise<void>;
  _baseMethods: LocalForageMethods;
}

interface LocalForage extends LocalForageWithIndexes {}

interface LocalForageWithIndexes extends LocalForage {}

declare module 'localforage-indexes' {
  export function extendPrototype(localforage: LocalForage): LocalForageWithIndexes;
}
