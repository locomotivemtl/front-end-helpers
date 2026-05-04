import { type WritableAtom } from 'nanostores';
export interface StorageObject {
    id: string;
    storage: Storage;
    datas: Record<string, any>;
    sync: (key: string, state: any, resetStorage?: boolean) => WritableAtom;
    get: (key: string, def?: any) => any;
    set: (key: string, value: any) => void;
    remove: (key: string) => void;
    clear: () => void;
    folder: (subKey: string) => StorageObject;
}
export declare function useStorage(_id?: string, _storage?: Storage, { encode, decode }?: {
    encode?: {
        (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
        (value: any, replacer?: (number | string)[] | null, space?: string | number): string;
    };
    decode?: (text: string, reviver?: (this: any, key: string, value: any) => any) => any;
}): StorageObject;
export declare function useLocalStorage(id: string, { encode, decode }?: {
    encode?: {
        (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
        (value: any, replacer?: (number | string)[] | null, space?: string | number): string;
    };
    decode?: (text: string, reviver?: (this: any, key: string, value: any) => any) => any;
}): StorageObject;
export declare function useSessionStorage(id: string, { encode, decode }?: {
    encode?: {
        (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
        (value: any, replacer?: (number | string)[] | null, space?: string | number): string;
    };
    decode?: (text: string, reviver?: (this: any, key: string, value: any) => any) => any;
}): StorageObject;
