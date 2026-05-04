import { type WritableAtom } from 'nanostores';
export declare function useStorageState(id: string, state: WritableAtom, storage?: Storage, { encode, decode }?: {
    encode?: {
        (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
        (value: any, replacer?: (number | string)[] | null, space?: string | number): string;
    };
    decode?: (text: string, reviver?: (this: any, key: string, value: any) => any) => any;
}): WritableAtom<any>;
