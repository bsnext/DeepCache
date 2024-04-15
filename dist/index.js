"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const events_1 = require("events");
const msgpack = require("@msgpack/msgpack");
const IsArray = Array.isArray;
const structuredClone = global.structuredClone;
let cachedTimestamp;
const updateTimestamp = () => {
    cachedTimestamp = Math.round(Date.now() / 1000);
};
updateTimestamp();
setInterval(updateTimestamp, 1000);
class DeepCache extends events_1.EventEmitter {
    constructor(options) {
        super();
        this.__folders = {};
        this.__root = { data: {}, ttl: {} };
        this.__ttl = (options === null || options === void 0 ? void 0 : options.ttl) && options.ttl > 0 ? Math.round(options.ttl) : 60;
        this.__ttc = (options === null || options === void 0 ? void 0 : options.ttc) && options.ttc > 0 ? Math.round(options.ttc) : 60;
        this.__dump = options === null || options === void 0 ? void 0 : options.dump;
        this.__separator = options === null || options === void 0 ? void 0 : options.separator;
        this.__cloning = options === null || options === void 0 ? void 0 : options.cloning;
        this.__events = options === null || options === void 0 ? void 0 : options.events;
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
                if (rootFolder.data[key] === value) {
                    return false;
                }
                rootFolder.data[key] = value;
                rootFolder.ttl[key] = { start: timestamp, ttl: ttl || this.__ttl };
                const path = getKeyPath(key);
                if (path !== false) {
                    for (let folder of path) {
                        if (this.__folders[folder] === undefined) {
                            this.__folders[folder] = {
                                data: {}
                            };
                        }
                        const childFolder = this.__folders[folder];
                        childFolder.data[key] = rootFolder.data[key];
                    }
                }
                if (this.__events) {
                    this.emit(`set`, key, value);
                }
                return true;
            };
            this.__del = function (key) {
                const rootFolder = this.__root;
                if (rootFolder.data[key] === undefined) {
                    return false;
                }
                ;
                delete rootFolder.data[key];
                const path = getKeyPath(key);
                if (path !== false) {
                    for (let folder of path) {
                        const childFolder = this.__folders[folder];
                        if (childFolder !== undefined) {
                            delete childFolder.data[key];
                        }
                    }
                }
                if (this.__events) {
                    this.emit(`del`, key);
                }
                return true;
            };
            if (this.__ttc) {
                this.__clean = function () {
                    const rootFolder = this.__root;
                    for (let i in rootFolder.ttl) {
                        let value = rootFolder.ttl[i];
                        if ((value.start + value.ttl) <= cachedTimestamp) {
                            const isExists = rootFolder.data[i] !== undefined;
                            delete rootFolder.data[i];
                            delete rootFolder.ttl[i];
                            const path = getKeyPath(i);
                            if (path !== false) {
                                for (let folder of path) {
                                    const childFolder = this.__folders[folder];
                                    if (childFolder !== undefined) {
                                        delete childFolder.data[i];
                                    }
                                }
                            }
                            if (this.__events && isExists) {
                                this.emit(`del`, i);
                                this.emit(`expired`, i);
                            }
                        }
                    }
                    return true;
                };
                setInterval(this.__clean.bind(this), this.__ttc * 1000);
            }
        }
        else {
            this.__set = function (key, value, ttl, ttlend, timestamp = cachedTimestamp) {
                const rootFolder = this.__root;
                if (rootFolder.data[key] === value) {
                    return false;
                }
                rootFolder.data[key] = value;
                rootFolder.ttl[key] = { start: timestamp, ttl: ttl || this.__ttl };
                if (this.__events) {
                    this.emit(`set`, key, value);
                }
                return true;
            };
            this.__del = function (key) {
                const rootFolder = this.__root;
                if (rootFolder.data[key] === undefined) {
                    return false;
                }
                delete rootFolder.data[key];
                if (this.__events) {
                    this.emit(`del`, key);
                }
                return true;
            };
            if (this.__ttc) {
                this.__clean = function () {
                    const rootFolder = this.__root;
                    for (let i in rootFolder.ttl) {
                        const value = rootFolder.ttl[i];
                        if ((value.start + value.ttl) <= cachedTimestamp) {
                            const isExists = rootFolder.data[i] !== undefined;
                            delete rootFolder.data[i];
                            delete rootFolder.ttl[i];
                            if (this.__events && isExists) {
                                this.emit(`del`, i);
                                this.emit(`expired`, i);
                            }
                        }
                    }
                    return true;
                };
                setInterval(this.__clean.bind(this), this.__ttc * 1000);
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
        (0, fs_1.writeFileSync)(this.__dump, msgpack.encode(dumpData));
        return true;
    }
    loadDump() {
        if (typeof this.__dump !== `string`) {
            throw new Error(`"dump" not configured for this cache instance`);
        }
        let file = (0, fs_1.readFileSync)(this.__dump);
        let content = msgpack.decode(file);
        if (!content) {
            return false;
        }
        let cache = content;
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
        if (this.__root.data[key] === undefined) {
            return false;
        }
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
            if (this.__events) {
                this.emit(`expired`, key);
            }
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
    values(path) {
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