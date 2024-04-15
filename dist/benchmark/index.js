"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const NodeCache = require("node-cache");
const __1 = require("..");
const Benchmark = require("benchmark");
const bench = new Benchmark.Suite();
let nodeCacheInst, deepCacheInstSimple, deepCacheInst;
nodeCacheInst = new NodeCache({ useClones: true });
deepCacheInstSimple = new __1.default({ cloning: true, events: true });
deepCacheInst = new __1.default({ separator: `:`, cloning: true, events: true });
let id = 0;
const existingKeys = [];
const notExistingKeys = [];
for (let i = 0; i < 100000; i++) {
    existingKeys.push(`exampleKeyId${i}:value${i}:value${i}:value${i}`);
    notExistingKeys.push(`exampleNotExistingKeyId${i}:value${i}:value${i}:value${i}`);
}
bench.add(`0) NodeCache.set`, function () {
    nodeCacheInst = new NodeCache({ useClones: true });
    id = 0;
    for (let i in existingKeys) {
        deepCacheInst.set(i, `exampleValue`);
        nodeCacheInst.set(`${i}/${++id}`, `exampleValue`);
    }
});
bench.add(`0) Simple DeepCache.set`, function () {
    deepCacheInstSimple = new __1.default({ cloning: true, events: true });
    nodeCacheInst = new NodeCache({ useClones: true });
    id = 0;
    for (let i in existingKeys) {
        deepCacheInst.set(i, `exampleValue`);
        deepCacheInstSimple.set(`${i}/${++id}`, `exampleValue`);
    }
});
bench.add(`0) Normal DeepCache.set`, function () {
    deepCacheInst = new __1.default({ separator: `:`, cloning: true, events: true });
    id = 0;
    for (let i in existingKeys) {
        deepCacheInst.set(i, `exampleValue`);
        deepCacheInst.set(`${i}/${++id}`, `exampleValue`);
    }
});
bench.add(`\n1) NodeCache.get Existing`, function () {
    for (let i in existingKeys) {
        const a = nodeCacheInst.get(i);
    }
});
bench.add(`1) Simple DeepCache.get Existing`, function () {
    for (let i in existingKeys) {
        const a = deepCacheInstSimple.get(i);
    }
});
bench.add(`1) Normal DeepCache.get Existing`, function () {
    for (let i in existingKeys) {
        const a = deepCacheInst.get(i);
    }
});
bench.add(`\n2) NodeCache.get Not-Existing`, function () {
    for (let i in notExistingKeys) {
        const a = nodeCacheInst.get(i);
    }
});
bench.add(`2) Simple DeepCache.get Not-Existing`, function () {
    for (let i in notExistingKeys) {
        const a = deepCacheInstSimple.get(i);
    }
});
bench.add(`2) Normal DeepCache.get Not-Existing`, function () {
    for (let i in notExistingKeys) {
        const a = deepCacheInst.get(i);
    }
});
bench.add(`\n3) NodeCache.has Existing`, function () {
    for (let i in existingKeys) {
        const a = nodeCacheInst.has(i);
    }
});
bench.add(`3) Simple DeepCache.has Existing`, function () {
    for (let i in existingKeys) {
        const a = deepCacheInstSimple.has(i);
    }
    { }
});
bench.add(`3) Normal DeepCache.has Existing`, function () {
    for (let i in existingKeys) {
        const a = deepCacheInst.has(i);
    }
});
bench.add(`\n4) NodeCache.has Not-Existing`, function () {
    for (let i in notExistingKeys) {
        const a = nodeCacheInst.has(i);
    }
});
bench.add(`4) Simple DeepCache.has Not-Existing`, function () {
    for (let i in notExistingKeys) {
        const a = deepCacheInstSimple.has(i);
    }
});
bench.add(`4) Normal DeepCache.has Not-Existing`, function () {
    for (let i in notExistingKeys) {
        const a = deepCacheInst.has(i);
    }
});
bench.add(`\n5) NodeCache.set + NodeCache.del`, function () {
    for (let i in existingKeys) {
        nodeCacheInst.set(i, `exampleValue`);
        nodeCacheInst.del(i);
    }
});
bench.add(`5) Simple DeepCache.set + DeepCache.del`, function () {
    for (let i in existingKeys) {
        deepCacheInstSimple.set(i, `exampleValue`);
        deepCacheInstSimple.del(i);
    }
});
bench.add(`5) Normal DeepCache.set + DeepCache.del`, function () {
    for (let i in existingKeys) {
        deepCacheInst.set(i, `exampleValue`);
        deepCacheInst.del(i);
    }
});
bench.on('cycle', function (e) {
    console.log(e.target.toString());
});
bench.run();
//# sourceMappingURL=index.js.map