/// <reference types="node" />
import { EventEmitter } from "events";
type AllowedArray = AllowedCacheValue[];
type AllowedObject = {
    [key: string]: AllowedCacheValue;
};
type AllowedCacheValue = string | number | boolean | null | AllowedObject | AllowedArray;
export default class DeepCache extends EventEmitter {
    private __root;
    private __folders;
    private __ttl;
    private __ttc;
    private __dump?;
    private __separator?;
    private __cloning?;
    private __events?;
    constructor(options?: {
        ttl?: number;
        dump?: string;
        separator?: string | false;
        cloning?: boolean;
        ttc?: number;
        events?: boolean;
    });
    saveDump(): boolean;
    loadDump(): boolean;
    private __set;
    private __del;
    private __key;
    private __clean;
    clean(): boolean;
    set(key: string, value: AllowedCacheValue, ttl?: number): boolean;
    has(key: string): boolean;
    get(key: string): AllowedCacheValue | undefined;
    del(key: string): boolean;
    values(path?: string): {
        [key: string]: AllowedCacheValue;
    };
}
export {};
