"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const uvu_1 = require("uvu");
const assert = require("uvu/assert");
const __1 = require("..");
(0, uvu_1.test)('Test #1 (Set, Get, Del, Has)', async () => {
    const cache = new __1.default();
    cache.set("test_key", "test_value");
    assert.equal(cache.get("test_key"), "test_value");
    assert.equal(cache.has("test_key"), true);
    assert.equal(cache.del("test_key"), true);
    assert.equal(cache.has("test_key"), false);
    assert.equal(cache.get("test_key"), undefined);
    assert.equal(cache.del("test_key"), false);
});
(0, uvu_1.test)('Test #2 (Values, Keys)', async () => {
    const cache = new __1.default();
    cache.set("test_key_1", "test_value_1");
    assert.equal(cache.keys(), new Set(["test_key_1"]));
    assert.equal(cache.values(), { test_key_1: `test_value_1` });
    cache.set("test_key_2", "test_value_2");
    assert.equal(cache.keys(), new Set([`test_key_1`, "test_key_2"]));
    assert.equal(cache.values(), { test_key_1: `test_value_1`, test_key_2: `test_value_2` });
    assert.equal(cache.del("test_key_1"), true);
    assert.equal(cache.keys(), new Set(["test_key_2"]));
    assert.equal(cache.values(), { test_key_2: `test_value_2` });
});
(0, uvu_1.test)('Test #3 (Separator)', async () => {
    const cache = new __1.default({ separator: `:`, ttl: 90 });
    cache.set("hehe:test_key_1", "test_value_1");
    assert.equal(cache.keys(), new Set(["hehe:test_key_1"]));
    assert.equal(cache.values(), { [`hehe:test_key_1`]: `test_value_1` });
    cache.set("test_key_2", "test_value_2");
    assert.equal(cache.keys(), new Set([`hehe:test_key_1`, "test_key_2"]));
    assert.equal(cache.values(), { [`hehe:test_key_1`]: `test_value_1`, test_key_2: `test_value_2` });
    assert.equal(cache.keys(`hehe:*`), new Set(["hehe:test_key_1"]));
    assert.equal(cache.values(`hehe:*`), { [`hehe:test_key_1`]: `test_value_1` });
    assert.equal(cache.del("hehe:test_key_1"), true);
    assert.equal(cache.keys(`hehe:*`), new Set());
    assert.equal(cache.values(`hehe:*`), {});
    assert.equal(cache.keys(), new Set(["test_key_2"]));
    assert.equal(cache.values(), { test_key_2: `test_value_2` });
});
uvu_1.test.run();
//# sourceMappingURL=index.js.map