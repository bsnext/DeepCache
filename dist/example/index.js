"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const __1 = require("..");
let cache = new __1.default({ ttl: 30, dump: `./test.dmp`, separator: `:` });
console.log(`key get`, cache.get("key"));
console.log(`key set`, cache.set("key", "value"));
console.log(`key get`, cache.get("key"));
console.log(`key has`, cache.has("key"));
console.log(`values()`, cache.values());
console.log(`-----------`);
console.log(`folder:key:ebey get`, cache.get("folder:key:ebey"));
console.log(`folder:key:ebey set`, cache.set("folder:key:ebey", "value"));
console.log(`folder:key:ebey get`, cache.get("folder:key:ebey"));
console.log(`folder:key:ebey has`, cache.has("folder:key:ebey"));
console.log(`folder:key:ebey del`, cache.del("folder:key:ebey"));
console.log(`folder:key:ebey has`, cache.has("folder:key:ebey"));
console.log(`-----------`);
console.log(`folder:key get`, cache.get("folder:key"));
console.log(`folder:key set`, cache.set("folder:key", "value"));
console.log(`folder:key get`, cache.get("folder:key"));
console.log(`folder:key has`, cache.has("folder:key"));
console.log(`-----------`);
console.log(`folder2:key set`, cache.set("folder2:key", {
    name: "sanya",
    perks: ["elektrik", "poesher"],
    info: {
        age: "dohuya",
        real_age: 33,
        old: true
    }
}));
console.log(`-----------`);
console.log(`values()`, cache.values());
console.log(`saveDump()`, cache.saveDump());
console.log(`-----------`);
let cache2 = new __1.default({ ttl: 30, dump: `./test.dmp`, separator: `:`, cloning: true, simple: true });
console.log(`loadDump()`, cache2.loadDump());
console.log(`-----------`);
console.log(`values()`, cache2.values());
console.log(`-----------`);
console.log(`folder:key get`, cache2.get("folder:key"));
console.log(`folder:key has`, cache2.has("folder:key"));
//# sourceMappingURL=index.js.map