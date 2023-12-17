type AllowedArray = AllowedCacheValue[];
type AllowedObject = {
    [key: string]: AllowedCacheValue;
};
type AllowedCacheValue = string | number | boolean | null | AllowedObject | AllowedArray;
export default class DeepCache {
    private __root;
    private __folders;
    private __ttl;
    private __dump?;
    constructor(options?: {
        ttl?: number;
        dump?: string;
    });
    saveDump(): boolean;
    loadDump(): boolean;
    private __set;
    set(key: string, value: AllowedCacheValue, ttl?: number): boolean;
    has(key: string): boolean;
    get(key: string): AllowedCacheValue | undefined;
    private __del;
    del(key: string): boolean;
    keys(path?: string): IterableIterator<any> | Set<string>;
    values(path?: string): {
        [key: string]: AllowedCacheValue;
    };
}
export {};
