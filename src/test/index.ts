import { test } from 'uvu';
import * as assert from 'uvu/assert';

////////////////////////////////

import DeepCache from '..';

////////////////////////////////

export function delay(time) {
    return new Promise(
        function (resolve) {
            setTimeout(resolve, time, void 0);
        }
    );
}

////////////////////////////////

test('Test #1 (Set, Get, Del, Has)', async () => {
    const cache = new DeepCache({ events: true });

    cache.set("test_key", "test_value");

    assert.equal(cache.get("test_key"), "test_value");
    assert.equal(cache.has("test_key"), true);
    assert.equal(cache.del("test_key"), true);
    assert.equal(cache.has("test_key"), false);
    assert.equal(cache.get("test_key"), undefined);
    assert.equal(cache.del("test_key"), false);
});

test('Test #1.5 (Events)', async () => {
    const cache = new DeepCache({ events: true });

    let cacheSetted = false;

    cache.on(`set`,
        function (key, value) {
            cacheSetted = true;
        }
    );

    cache.set("test_key", "test_value");
    assert.equal(cacheSetted, true);

    
    let cacheDeleted = false;
    cache.on(`del`,
        function (key, value) {
            cacheDeleted = true;
        }
    );

    cache.del("test_key");
    assert.equal(cacheDeleted, true);
});

test('Test #2 (Values)', async () => {
    const cache = new DeepCache();

    assert.equal(cache.set("test_key_1", "test_value_1"), true);
    assert.equal(cache.values(), { test_key_1: `test_value_1` });
    assert.equal(cache.set("test_key_1", "test_value_1"), false);

    assert.equal(cache.set("test_key_2", "test_value_2"), true);
    assert.equal(cache.values(), { test_key_1: `test_value_1`, test_key_2: `test_value_2` });
    assert.equal(cache.set("test_key_2", "test_value_2"), false);

    assert.equal(cache.del("test_key_1"), true);
    assert.equal(cache.del("test_key_1"), false);
    assert.equal(cache.values(), { test_key_2: `test_value_2` });
});

test('Test #3 (Separator)', async () => {
    const cache = new DeepCache({ separator: `:`, ttl: 90 });

    cache.set("hehe:test_key_1", "test_value_1");
    assert.equal(cache.values(), { [`hehe:test_key_1`]: `test_value_1` });

    cache.set("test_key_2", "test_value_2");
    assert.equal(cache.values(), { [`hehe:test_key_1`]: `test_value_1`, test_key_2: `test_value_2` });

    assert.equal(cache.values(`hehe:*`), { [`hehe:test_key_1`]: `test_value_1` });

    assert.equal(cache.del("hehe:test_key_1"), true);
    assert.equal(cache.values(`hehe:*`), {});

    assert.equal(cache.values(), { test_key_2: `test_value_2` });
});

test('Test #4 (TTL)', async () => {
    const cache = new DeepCache({ ttl: 5, ttc: 600 });

    cache.set("test_key_1", "test_value_1");
    assert.equal(cache.has("test_key_1"), true);

    await delay(5000 + 1000);

    assert.equal(cache.has("test_key_1"), false);
});

////////////////////////////////

test.run();