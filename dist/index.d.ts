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
    private __separator?;
    private __simple?;
    private __cloning?;
    constructor(options?: {
        ttl?: number;
        dump?: string;
        separator?: string | false;
        simple?: boolean;
        cloning?: boolean;
    });
    saveDump(): boolean;
    loadDump(): boolean;
    private __set;
    private __del;
    private __key;
    set(key: string, value: AllowedCacheValue, ttl?: number): boolean;
    has(key: string): boolean;
    get(key: string): AllowedCacheValue | undefined;
    del(key: string): boolean;
    keys(path?: string): IterableIterator<any> | Set<string>;
    values(path?: string): {
        [key: string]: AllowedCacheValue;
    };
}
export {};
