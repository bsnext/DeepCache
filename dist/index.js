"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const msgpack = require("msgpack");
let cachedTimestamp;
const getTimestamp = function () {
    return cachedTimestamp;
};
const updateTimestamp = function () {
    cachedTimestamp = Math.round(new Date().getTime() / 1000);
};
updateTimestamp();
setInterval(updateTimestamp, 1000);
const cachedKeyPath = {};
function getKeyPath(key) {
    let a = key.lastIndexOf(`:`);
    if (a === -1) {
        return false;
    }
    let path = key.substring(0, a + 1);
    if (!cachedKeyPath[path]) {
        cachedKeyPath[path] = [];
        let formattedPath = ``;
        for (let i of path.split(`:`)) {
            if (i === ``) {
                continue;
            }
            if (formattedPath === ``) {
                formattedPath = i;
            }
            else {
                formattedPath = `${formattedPath}:${i}`;
            }
            ;
            cachedKeyPath[path].push(`${formattedPath}:*`);
        }
    }
    return cachedKeyPath[path];
}
const EmptyMapIterator = (new Map()).keys();
class DeepCache {
    constructor(options) {
        this.__folders = {};
        this.__root = {
            data: {},
            ttl: {},
            keys: new Set()
        };
        if (options && (options.ttl !== undefined)) {
            this.__ttl = Math.round(options.ttl);
            if (this.__ttl !== options.ttl) {
                console.warn(`"ttl" option changed to ${this.__ttl}`);
            }
            if (!(this.__ttl > 0)) {
                throw new Error(`"ttl" option can not be 0 or less.`);
            }
        }
        else {
            this.__ttl = 60;
        }
        if (options && (options.dump)) {
            this.__dump = options.dump;
        }
    }
    saveDump() {
        if (!this.__dump) {
            throw new Error(`"dump" not configured for this cache instance`);
        }
        let dumpData = {};
        let timestamp = getTimestamp();
        for (let [key, value] of Object.entries(this.__root.data)) {
            const ttl = this.__root.ttl[key];
            if (!ttl) {
                continue;
            }
            if ((ttl.start + ttl.ttl) <= getTimestamp()) {
                continue;
            }
            dumpData[key] = [value, ttl === null || ttl === void 0 ? void 0 : ttl.start, ttl === null || ttl === void 0 ? void 0 : ttl.ttl];
        }
        (0, fs_1.writeFileSync)(this.__dump, msgpack.pack(dumpData));
        return true;
    }
    loadDump() {
        if (!this.__dump) {
            throw new Error(`"dump" not configured for this cache instance`);
        }
        let file = (0, fs_1.readFileSync)(this.__dump);
        let cache = msgpack.unpack(file);
        let timestamp = getTimestamp();
        for (let [key, value] of Object.entries(cache)) {
            if ((value[1] + value[2]) <= timestamp) {
                continue;
            }
            this.__set(key, value[0], value[2], value[1], timestamp);
        }
        return true;
    }
    __set(key, value, ttl, ttlend, timestamp = getTimestamp()) {
        const ttlData = { start: timestamp, ttl: ttl || this.__ttl };
        const rootFolder = this.__root;
        rootFolder.data[key] = value;
        rootFolder.ttl[key] = { start: timestamp, ttl: ttl || this.__ttl };
        if (!rootFolder.keys.has(key)) {
            rootFolder.keys.add(key);
        }
        const path = getKeyPath(key);
        if (path) {
            for (let folder of path) {
                if (!this.__folders[folder]) {
                    this.__folders[folder] = {
                        data: {},
                        keys: new Set()
                    };
                }
                const childFolder = this.__folders[folder];
                childFolder.data[key] = rootFolder.data[key];
                if (!childFolder.keys.has(key)) {
                    childFolder.keys.add(key);
                }
            }
        }
        return true;
    }
    set(key, value, ttl) {
        return this.__set(key, value, ttl);
    }
    has(key) {
        return this.__root.keys.has(key);
    }
    get(key) {
        const record = this.__root.data[key];
        if (record === undefined) {
            return undefined;
        }
        const ttl = this.__root.ttl[key];
        if (ttl && ((ttl.start + ttl.ttl) <= getTimestamp())) {
            this.__del(key);
            return undefined;
        }
        return record;
    }
    __del(key) {
        const path = getKeyPath(key);
        delete this.__root.data[key];
        delete this.__root.ttl[key];
        this.__root.keys.delete(key);
        if (path) {
            for (let folder of path) {
                const childFolder = this.__folders[folder];
                if (childFolder) {
                    delete childFolder.data[key];
                    childFolder.keys.delete(key);
                }
            }
        }
        return true;
    }
    del(key) {
        return this.__del(key);
    }
    keys(path) {
        if (path) {
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
        if (path) {
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