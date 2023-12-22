import DeepCache from "..";

////////////////////

let cache = new DeepCache({ ttl: 30, dump: `./test.dmp`, separator: `:` });

////////////////////

console.log(`key get`, cache.get("key"))
console.log(`key set`, cache.set("key", "value"))
console.log(`key get`, cache.get("key"))
console.log(`key has`, cache.has("key"))
// console.log(`keys()`, cache.keys())
console.log(`values()`, cache.values())

console.log(`-----------`)

console.log(`folder:key:ebey get`, cache.get("folder:key:ebey"))
console.log(`folder:key:ebey set`, cache.set("folder:key:ebey", "value"))
console.log(`folder:key:ebey get`, cache.get("folder:key:ebey"))
console.log(`folder:key:ebey has`, cache.has("folder:key:ebey"))
console.log(`folder:key:ebey del`, cache.del("folder:key:ebey"))
console.log(`folder:key:ebey has`, cache.has("folder:key:ebey"))
// console.log(`keys(folder:key:*)`, cache.keys("folder:key:*"))
// console.log(`values(folder:key:*)`, cache.values("folder:key:*"))

console.log(`-----------`)

console.log(`folder:key get`, cache.get("folder:key"))
console.log(`folder:key set`, cache.set("folder:key", "value"))
console.log(`folder:key get`, cache.get("folder:key"))
console.log(`folder:key has`, cache.has("folder:key"))
// console.log(`keys(folder:*)`, cache.keys("folder:*"))
// console.log(`values(folder:*)`, cache.values("folder:*"))

console.log(`-----------`)

console.log(`folder2:key set`, cache.set("folder2:key", {
    name: "sanya",
    perks: ["elektrik", "poesher"],
    info: {
        age: "dohuya",
        real_age: 33,
        old: true
    }
}))

console.log(`-----------`)

// console.log(`keys()`, cache.keys())
console.log(`values()`, cache.values())

console.log(`saveDump()`, cache.saveDump())

console.log(`-----------`)

////////////////////

let cache2 = new DeepCache({ ttl: 30, dump: `./test.dmp`, separator: `:`, cloning: true, simple: true});

////////////////////

console.log(`loadDump()`, cache2.loadDump())

console.log(`-----------`)

// console.log(`keys()`, cache2.keys())
console.log(`values()`, cache2.values())

console.log(`-----------`)

console.log(`folder:key get`, cache2.get("folder:key"))
console.log(`folder:key has`, cache2.has("folder:key"))
// console.log(`keys(folder:*)`, cache2.keys("folder:*"))
// console.log(`values(folder:*)`, cache2.values("folder:*"))
