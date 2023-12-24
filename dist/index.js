"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const msgpack = require("msgpack");
const EmptyMapIterator = (new Map()).keys();
const IsArray = Array.isArray;
const structuredClone = global.structuredClone;
let cachedTimestamp;
const updateTimestamp = () => {
    cachedTimestamp = Date.now();
};
updateTimestamp();
class DeepCache {
    constructor(options) {
        this.__folders = {};
        this.__root = { data: {}, ttl: {}, keys: new Set() };
        this.__ttl = (options === null || options === void 0 ? void 0 : options.ttl) && options.ttl > 0 ? Math.round(options.ttl) : 60;
        this.__ttc = (options === null || options === void 0 ? void 0 : options.ttc) && options.ttc > 0 ? Math.round(options.ttc) : 60;
        this.__dump = options === null || options === void 0 ? void 0 : options.dump;
        this.__separator = options === null || options === void 0 ? void 0 : options.separator;
        this.__simple = options === null || options === void 0 ? void 0 : options.simple;
        this.__cloning = options === null || options === void 0 ? void 0 : options.cloning;
        const __this = this;
        if (this.__separator) {
            const getKeyPath = function (key) {
                const delimiterIndex = key.lastIndexOf(':');
                if (delimiterIndex === -1) {
                    return false;
                }
                const path = key.substring(0, delimiterIndex + 1);
                const pathSteps = key.split(':');
                const pathStepsLength = pathSteps.length;
                let lastPath = ``;
                for (let i = 0; i < pathStepsLength - 1; i++) {
                    if (lastPath === ``) {
                        lastPath = pathSteps[i];
                    }
                    else {
                        lastPath = `${lastPath}:${pathSteps[i]}`;
                    }
                    pathSteps[i] = `${lastPath}:*`;
                }
                return pathSteps;
            };
            this.__set = function (key, value, ttl, ttlend, timestamp = cachedTimestamp) {
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
            this.__del = function (key) {
                const rootFolder = this.__root;
                if (this.__simple === true) {
                    const deleteResult = (rootFolder.data[key] !== undefined) ? true : false;
                    delete rootFolder.data[key];
                    return deleteResult;
                }
                else {
                    if (rootFolder.keys.has(key) === false) {
                        return false;
                    }
                    ;
                    delete rootFolder.data[key];
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
                this.__clean = function () {
                    let removedKeys = 0;
                    const rootFolder = __this.__root;
                    for (let i in rootFolder.ttl) {
                        let value = rootFolder.ttl[i];
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
                            console.log(`cleaning a ${i} key`);
                        }
                    }
                    console.log(`cleaned x${removedKeys} keys`);
                    return true;
                };
                setInterval(this.__clean, this.__ttc * 1000);
            }
        }
        else {
            this.__set = function (key, value, ttl, ttlend, timestamp = cachedTimestamp) {
                const rootFolder = this.__root;
                rootFolder.data[key] = value;
                rootFolder.ttl[key] = { start: timestamp, ttl: ttl || this.__ttl };
                if (this.__simple === true) {
                    return true;
                }
                const setResult = rootFolder.keys.add(key);
                return setResult ? true : false;
            };
            this.__del = function (key) {
                const rootFolder = this.__root;
                if (this.__simple === true) {
                    const deleteResult = (rootFolder.data[key] !== undefined) ? true : false;
                    delete rootFolder.data[key];
                    return deleteResult;
                }
                else {
                    if (rootFolder.keys.has(key) === false) {
                        return false;
                    }
                    delete rootFolder.data[key];
                    const deleteResult = rootFolder.keys.delete(key);
                    return deleteResult;
                }
            };
            if (this.__ttc) {
                this.__clean = function () {
                    let removedKeys = 0;
                    const rootFolder = __this.__root;
                    for (let i in rootFolder.ttl) {
                        let value = rootFolder.ttl[i];
                        if ((value.start + value.ttl) <= cachedTimestamp) {
                            delete rootFolder.data[i];
                            delete rootFolder.ttl[i];
                            if (!__this.__simple) {
                                rootFolder.keys.delete(i);
                            }
                            removedKeys++;
                            console.log(`cleaning a ${i} key`);
                        }
                    }
                    console.log(`cleaned x${removedKeys} keys`);
                    return true;
                };
                setInterval(this.__clean, this.__ttc * 1000);
            }
        }
    }
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
            dumpData[key] = [value, ttl === null || ttl === void 0 ? void 0 : ttl.start, ttl === null || ttl === void 0 ? void 0 : ttl.ttl];
        }
        (0, fs_1.writeFileSync)(this.__dump, msgpack.pack(dumpData));
        return true;
    }
    loadDump() {
        if (typeof this.__dump !== `string`) {
            throw new Error(`"dump" not configured for this cache instance`);
        }
        let file = (0, fs_1.readFileSync)(this.__dump);
        let cache = msgpack.unpack(file);
        let timestamp = cachedTimestamp;
        for (let [key, value] of Object.entries(cache)) {
            if ((value[1] + value[2]) <= timestamp) {
                continue;
            }
            this.__set(key, value[0], value[2], value[1], timestamp);
        }
        return true;
    }
    __set(key, value, ttl, ttlend, timestamp) {
        return true;
    }
    __del(key) {
        return true;
    }
    __key(key) {
        return [];
    }
    __clean() {
        return true;
    }
    clean() {
        return this.__clean();
    }
    set(key, value, ttl) {
        if ((this.__cloning === true) && (typeof value === `object`) && (value !== null) && (value !== undefined)) {
            return this.__set(key, structuredClone(value), ttl);
        }
        else {
            return this.__set(key, value, ttl);
        }
    }
    has(key) {
        const rootFolder = this.__root;
        if (this.__simple === true) {
            const record = rootFolder.data[key];
            if (record === undefined) {
                return false;
            }
        }
        else {
            if (this.__root.keys.has(key) === false) {
                return false;
            }
        }
        ;
        const ttl = rootFolder.ttl[key];
        if ((ttl !== undefined) && ((ttl.start + ttl.ttl) <= cachedTimestamp)) {
            this.__del(key);
            return false;
        }
        return true;
    }
    get(key) {
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
        }
        else {
            return record;
        }
    }
    del(key) {
        return this.__del(key);
    }
    keys(path) {
        if (this.__simple === true) {
            throw new Error(`"keys" not allowed in cache instance with enabled "simple" property`);
        }
        if (path !== undefined) {
            if (!this.__folders[path]) {
                return EmptyMapIterator;
            }
            ;
            return this.__folders[path].keys;
        }
        else {
            return this.__root.keys;
        }
    }
    values(path) {
        if ((this.__simple === true) && (path !== undefined)) {
            throw new Error(`"values" with "path" parameter not allowed in cache instance with enabled "simple" property`);
        }
        if (path !== undefined) {
            if (!this.__folders[path]) {
                return {};
            }
            ;
            return this.__folders[path].data;
        }
        else {
            return this.__root.data;
        }
    }
}
exports.default = DeepCache;
//# sourceMappingURL=index.js.map