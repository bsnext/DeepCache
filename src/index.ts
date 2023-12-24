import { throws } from "assert";
import { readFileSync, writeFileSync } from "fs";
import * as msgpack from "msgpack";

////////////////////////////////

type AllowedArray = AllowedCacheValue[];
type AllowedObject = { [key: string]: AllowedCacheValue; };
type AllowedCacheValue = string | number | boolean | null | AllowedObject | AllowedArray;

const EmptyMapIterator = (new Map()).keys();
const IsArray = Array.isArray;
const structuredClone = global.structuredClone;

////////////////////////////////

let cachedTimestamp;

const updateTimestamp = () => {
    cachedTimestamp = Date.now();
};

updateTimestamp();
// setInterval(updateTimestamp, 1000);

////////////////////////////////

export default class DeepCache {
    private __root: {
        data: { [key: string]: AllowedCacheValue; };
        ttl: { [key: string]: { start: number, ttl: number; }; };
        keys: Set<string>;
    };

    private __folders: {
        [key: string]: {
            data: { [key: string]: AllowedCacheValue; };
            keys: Set<string>;
        };
    };

    private __ttl: number;
    private __ttc: number;
    private __dump?: string;
    private __separator?: string | false;
    private __simple?: boolean;
    private __cloning?: boolean;

    constructor(options?: { ttl?: number; dump?: string; separator?: string | false; simple?: boolean; cloning?: boolean; ttc?: number }) {
        this.__folders = {};
        this.__root = { data: {}, ttl: {}, keys: new Set() };

        this.__ttl = options?.ttl && options.ttl > 0 ? Math.round(options.ttl) : 60;
        this.__ttc = options?.ttc && options.ttc > 0 ? Math.round(options.ttc) : 60;
        this.__dump = options?.dump;
        this.__separator = options?.separator;
        this.__simple = options?.simple;
        this.__cloning = options?.cloning;

        ////////////////////////
        
        const __this = this;

        ////////////////////////

        if (this.__separator) {
            // const cachedKeyPath: { [key: string]: string[]; } = {};

            const getKeyPath = function (key: string): string[] | false {
                const delimiterIndex = key.lastIndexOf(':');

                if (delimiterIndex === -1) {
                    return false;
                }

                const path = key.substring(0, delimiterIndex + 1);

                // if (cachedKeyPath[path] !== undefined) {
                //     return cachedKeyPath[path];
                // }

                const pathSteps = key.split(':');
                const pathStepsLength = pathSteps.length;
                let lastPath = ``;

                for (let i = 0; i < pathStepsLength - 1; i++) {
                    if (lastPath === ``) {
                        lastPath = pathSteps[i];
                    } else {
                        lastPath = `${lastPath}:${pathSteps[i]}`;
                    }

                    pathSteps[i] = `${lastPath}:*`;
                }

                // cachedKeyPath[path] = pathSteps;
                return pathSteps;
            };

            this.__set = function (key: string, value: AllowedCacheValue, ttl?: number, ttlend?: number, timestamp: number = cachedTimestamp) {
                const rootFolder = this.__root;

                rootFolder.data[key] = value;
                rootFolder.ttl[key] = { start: timestamp, ttl: ttl || this.__ttl };

                if (this.__simple === true) {
                    return true;
                }

                const setResult = rootFolder.keys.add(key);

                const path = getKeyPath(key);

                if (path !== false) {
                    for (let folder of path) {
                        if (this.__folders[folder] === undefined) {
                            this.__folders[folder] = {
                                data: {},
                                keys: new Set()
                            };
                        }

                        const childFolder = this.__folders[folder];
                        childFolder.data[key] = rootFolder.data[key];
                        childFolder.keys.add(key);
                    }
                }

                return setResult ? true : false;
            };

            this.__del = function (key: string) {
                const rootFolder = this.__root;

                if (this.__simple === true) {
                    const deleteResult = (rootFolder.data[key] !== undefined) ? true : false;

                    delete rootFolder.data[key];
                    // delete rootFolder.ttl[key];

                    return deleteResult;
                } else {
                    if (rootFolder.keys.has(key) === false) {
                        return false;
                    };

                    delete rootFolder.data[key];
                    // delete rootFolder.ttl[key];
                }

                const deleteResult = rootFolder.keys.delete(key);

                if (deleteResult === false) {
                    return deleteResult;
                }

                const path = getKeyPath(key);

                if (path !== false) {
                    for (let folder of path) {
                        const childFolder = this.__folders[folder];

                        if (childFolder !== undefined) {
                            delete childFolder.data[key];
                            childFolder.keys.delete(key);
                        }
                    }
                }

                return deleteResult;
            };
    
            if (this.__ttc) {
                this.__clean = function() {
                    let removedKeys = 0;
                    
                    const rootFolder = __this.__root;

                    for (let i in rootFolder.ttl) {
                        let value = rootFolder.ttl[i]

                        if ((value.start + value.ttl) <= cachedTimestamp) {
                            delete rootFolder.data[i];
                            delete rootFolder.ttl[i];

                            if (!__this.__simple) {
                                rootFolder.keys.delete(i);
                            }                       

                            const path = getKeyPath(i);

                            if (path !== false) {
                                for (let folder of path) {
                                    const childFolder = __this.__folders[folder];

                                    if (childFolder !== undefined) {
                                        delete childFolder.data[i];
                                        childFolder.keys.delete(i);
                                    }
                                }
                            }

                            removedKeys++;
                            console.log(`cleaning a ${i} key`)
                        }
                    }

                    console.log(`cleaned x${removedKeys} keys`)

                    return true
                }

                setInterval(this.__clean, this.__ttc * 1000);
            }
        } else {
            this.__set = function (key: string, value: AllowedCacheValue, ttl?: number, ttlend?: number, timestamp: number = cachedTimestamp) {
                const rootFolder = this.__root;

                rootFolder.data[key] = value;
                rootFolder.ttl[key] = { start: timestamp, ttl: ttl || this.__ttl };

                if (this.__simple === true) {
                    return true;
                }

                const setResult = rootFolder.keys.add(key);

                return setResult ? true : false;
            };

            this.__del = function (key: string) {
                const rootFolder = this.__root;

                if (this.__simple === true) {
                    const deleteResult = (rootFolder.data[key] !== undefined) ? true : false;

                    delete rootFolder.data[key];
                    // delete rootFolder.ttl[key];

                    return deleteResult;
                } else {
                    if (rootFolder.keys.has(key) === false) {
                        return false;
                    }

                    delete rootFolder.data[key];
                    // delete rootFolder.ttl[key];

                    const deleteResult = rootFolder.keys.delete(key);

                    return deleteResult;
                }
            };

            if (this.__ttc) {
                this.__clean = function() {
                    let removedKeys = 0;
                    
                    const rootFolder = __this.__root;

                    for (let i in rootFolder.ttl) {
                        let value = rootFolder.ttl[i]

                        if ((value.start + value.ttl) <= cachedTimestamp) {
                            delete rootFolder.data[i];
                            delete rootFolder.ttl[i];

                            if (!__this.__simple) {
                                rootFolder.keys.delete(i);
                            }

                            removedKeys++;
                            console.log(`cleaning a ${i} key`)
                        }
                    }

                    console.log(`cleaned x${removedKeys} keys`)

                    return true
                }

                setInterval(this.__clean, this.__ttc * 1000);
            }
        }
    }

    ////////

    saveDump() {
        if (typeof this.__dump !== `string`) {
            throw new Error(`"dump" not configured for this cache instance`);
        }

        let dumpData = {};
        let timestamp = cachedTimestamp;

        for (let [key, value] of Object.entries(this.__root.data)) {
            const ttl = this.__root.ttl[key];

            if (!ttl) {
                continue;
            }

            if ((ttl.start + ttl.ttl) <= timestamp) {
                continue;
            }

            dumpData[key] = [value, ttl?.start, ttl?.ttl];
        }

        writeFileSync(this.__dump, msgpack.pack(dumpData));

        return true;
    }

    loadDump() {
        if (typeof this.__dump !== `string`) {
            throw new Error(`"dump" not configured for this cache instance`);
        }

        let file = readFileSync(this.__dump);
        let cache: { [key: string]: [AllowedCacheValue, number, number]; } = msgpack.unpack(file);

        let timestamp = cachedTimestamp;

        for (let [key, value] of Object.entries(cache)) {
            if ((value[1] + value[2]) <= timestamp) {
                continue;
            }

            this.__set(key, value[0], value[2], value[1], timestamp);
        }

        return true;
    }

    ////////

    private __set(key: string, value: AllowedCacheValue, ttl?: number, ttlend?: number, timestamp?: number): boolean {
        return true;
    }

    private __del(key: string): boolean {
        return true;
    }

    private __key(key: string): (string[] | boolean) {
        return [];
    }

    private __clean(): boolean {
        return true;
    }

    ////////

    clean(): boolean {
        return this.__clean();
    }

    ////////

    set(key: string, value: AllowedCacheValue, ttl?: number) {
        if ((this.__cloning === true) && (typeof value === `object`) && (value !== null) && (value !== undefined)) {
            return this.__set(key, structuredClone(value), ttl);
        } else {
            return this.__set(key, value, ttl);
        }
    }

    has(key: string) {
        const rootFolder = this.__root;

        if (this.__simple === true) {
            const record = rootFolder.data[key];

            if (record === undefined) {
                return false;
            }

        } else {
            if (this.__root.keys.has(key) === false) {
                return false;
            }            
        };

        const ttl = rootFolder.ttl[key];

        if ((ttl !== undefined) && ((ttl.start + ttl.ttl) <= cachedTimestamp)) {
            this.__del(key);
            return false;
        }

        return true;
    }

    get(key: string) {
        const record = this.__root.data[key];

        if (record === undefined) {
            return undefined;
        }

        const ttl = this.__root.ttl[key];

        if ((ttl !== undefined) && ((ttl.start + ttl.ttl) <= cachedTimestamp)) {
            this.__del(key);
            return undefined;
        }

        if ((this.__cloning === true) && (typeof record === `object`) && (record !== null) && (record !== undefined)) {
            return structuredClone(record);
        } else {
            return record;
        }
    }

    del(key: string) {
        return this.__del(key);
    }

    keys(path?: string) {
        if (this.__simple === true) {
            throw new Error(`"keys" not allowed in cache instance with enabled "simple" property`);
        }

        if (path !== undefined) {
            if (!this.__folders[path]) {
                return EmptyMapIterator;
            };

            return this.__folders[path].keys;
        } else {
            return this.__root.keys;
        }
    }

    values(path?: string) {
        if ((this.__simple === true) && (path !== undefined)) {
            throw new Error(`"values" with "path" parameter not allowed in cache instance with enabled "simple" property`);
        }

        if (path !== undefined) {
            if (!this.__folders[path]) {
                return {};
            };

            return this.__folders[path].data;
        } else {
            return this.__root.data;
        }
    }
}