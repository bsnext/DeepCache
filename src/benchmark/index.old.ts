import NodeCache = require("node-cache");
import DeepCache from "..";
import * as EugeneCache from "../../dist/benchmark/kek.js"

////////////////////////////////

import * as Benchmarkify from "benchmarkify";

const benchmark = new Benchmarkify("test",
    {
        drawChart: false
    }
).printHeader();

////////////////////////////////

let deepcache = new DeepCache({ ttl: 60 * 10, dump: `./kek.dmp`, simple: false}); 
let nodecache = new NodeCache({ stdTTL: 60 * 10 }) 
let eugenecache = EugeneCache();

////////////////////////////////

const randomInt = function(start, end) {
    return start + Math.round(Math.random() * (end - start))
}

////////////////////////////////

let iter;
let start = 0;

////////////////////////////////

void async function() { 
    iter = start;

    // await benchmark.createSuite("Cache Set Testing (Disabled Separators)", {time: 500})
    //     .add("DeepCache", 
    //         function() {
    //             deepcache.set("ebeni" + (iter++) + ":keys" + (iter++), "sasi" + (iter++));
    //         }
    //     )
    //     .add("NodeCache", 
    //         function() {
    //             nodecache.set("ebeni" + (iter++) + ":keys" + (iter++), "sasi" + (iter++));
    //         }
    //     )
    //     .add("EugeneCache", 
    //         function() {
    //             eugenecache.cacheSet("ebeni" + (iter++) + ":keys" + (iter++), "sasi" + (iter++));
    //         }
    //     )
    //     .run();

    ////////////////
    
    // iter = start;

    // await benchmark.createSuite("Cache Get Testing (Disabled Separators)", {time: 500})
    //     .add("DeepCache", 
    //         function() {
    //             deepcache.get("ebeni" + (iter++) + ":keys" + (iter++));
    //         }
    //     )
    //     .add("NodeCache", 
    //         function() {
    //             nodecache.get("ebeni" + (iter++) + ":keys" + (iter++));
    //         }
    //     )
    //     .add("EugeneCache", 
    //         function() {
    //             eugenecache.cacheGet("ebeni" + (iter++) + ":keys" + (iter++));
    //         }
    //     )
    //     .run();
    
    ////////////////

    // deepcache = new DeepCache({ ttl: 60 * 10, dump: `./kek.dmp`, separator: `:`, simple: false}); 
    // eugenecache = EugeneCache();

    ////////////////

    // start = iter * 2;
    // iter = start;   

    await benchmark.createSuite("Cache Set (2-Deep-Level) Testing (Enabled Separators)", {time: 500})
        .add("DeepCache", 
            function() {
                deepcache.set("ebeni" + (iter++) + "keys" + (iter++), "sasi" + (iter++));
            }
        )
        .add("EugeneCache", 
            function() {
                eugenecache.cacheSet("ebeni" + (iter++) + "keys" + (iter++), "sasi" + (iter++));
            }
        )
        .run();

    ////////////////
    
    // iter = start;   

    await benchmark.createSuite("Cache Get (2-Deep-Level) Testing (Enabled Separators)", {time: 500})
        .add("DeepCache", 
            function() {
                deepcache.get("ebeni" + (iter++) + "keys" + (iter++));
            }
        )
        .add("EugeneCache", 
            function() {
                eugenecache.cacheGet("ebeni" + (iter++) + "keys" + (iter++));
            }
        )
        .run();

    ////////////////

    // start = iter * 2;
    // iter = start;   

    await benchmark.createSuite("Cache Set (4-Deep-Level) Testing (Enabled Separators)", {time: 500})
        .add("DeepCache", 
            function() {
                deepcache.set("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++), "sasi" + (iter++));
            }
        )
        .add("EugeneCache", 
            function() {
                eugenecache.cacheSet("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++), "sasi" + (iter++));
            }
        )
        .run();

    ////////////////
    
    // iter = start;   

    await benchmark.createSuite("Cache Get (4-Deep-Level) Testing (Enabled Separators)", {time: 500})
        .add("DeepCache", 
            function() {
                deepcache.get("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++));
            }
        )
        .add("EugeneCache", 
            function() {
                eugenecache.cacheGet("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++));
            }
        )
        .run();

    ////////////////
    
    // iter = start;   

    await benchmark.createSuite("Cache Has Exists (4-Deep-Level) Testing (Enabled Separators)", {time: 500})
        .add("DeepCache", 
            function() {
                deepcache.has("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++));
            }
        )
        .add("EugeneCache", 
            function() {
                eugenecache.cacheHas("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++));
            }
        )
        .run();

    ////////////////
    
    // iter = start;   

    await benchmark.createSuite("Cache Del Exists (4-Deep-Level) Testing (Enabled Separators)", {time: 500})
        .add("DeepCache", 
            function() {
                deepcache.del("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++));
            }
        )
        .add("EugeneCache", 
            function() {
                eugenecache.cacheDel("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++));
            }
        )
        .run();

    ////////////////
    
    // iter = start;   

    await benchmark.createSuite("Cache Has Not-Exists (4-Deep-Level) Testing (Enabled Separators)", {time: 500})
        .add("DeepCache", 
            function() {
                deepcache.has("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++));
            }
        )
        .add("EugeneCache", 
            function() {
                eugenecache.cacheHas("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++));
            }
        )
        .run();

    ////////////////
    
    // iter = start;   

    await benchmark.createSuite("Cache Del Not-Exists (4-Deep-Level) Testing (Enabled Separators)", {time: 500})
        .add("DeepCache", 
            function() {
                deepcache.del("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++));
            }
        )
        .add("EugeneCache", 
            function() {
                eugenecache.cacheDel("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++));
            }
        )
        .run();
}()

void async function() {
    let a = {};
    let b = new Map();

    let iter = 0;

    await benchmark.createSuite("Write", {time: 500})
        .add("Object{}", 
            function() {
                a["ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++)] = `uaaaaaaaaaaaa`;
            }
        )
        .add("Map()", 
            function() {
                b.set("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++), `uaaaaaaaaaaaa`);
            }
        )
        .run();

    iter = 0;

    await benchmark.createSuite("Read", {time: 500})
        .add("Object{}", 
            function() {
                let c = a["ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++)] + `-pizdets`;
                return c
            }
        )
        .add("Map()", 
            function() {
                let c = b.get("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++)) + `-pizdets`;
                return c
            }
        )
        .run();
}

void async function() {
    let iter;
    
    const way1 = function(key) {
        const delimiterIndex = key.lastIndexOf(':');

        if (delimiterIndex === -1) {
            return false;
        }

        const path = key.substring(0, delimiterIndex + 1);

        const pathValues = path.split(':')
            .filter(Boolean)
            .map((_, index, arr) => `${arr.slice(0, index + 1).join(':')}:*`);

        return pathValues;
    }
    
    const way2 = function(key) {
        const delimiterIndex = key.lastIndexOf(':');

        if (delimiterIndex === -1) {
            return false;
        }        

        const a = key.split(':')
        a.pop();

        const pathValues = a.map(
            function (_, index, arr) {
                return `${arr.slice(0, index + 1).join(':')}:*`
            }
        );

        return pathValues;
    }    
    
    const way3 = function(key) {
        const delimiterIndex = key.lastIndexOf(':');

        if (delimiterIndex === -1) {
            return false;
        }        

        const pathSteps = key.split(':')
        const pathLength = pathSteps.length;

        const tempPathElements: any[] = [];

        for (let i = 0; i < pathLength - 1; i++) {
            tempPathElements.push(pathSteps[i]);
            pathSteps[i] = `${tempPathElements.join(':')}:*`;
        }

        pathSteps.pop();

        return pathSteps;
    }
    
    const way4 = function(key) {
        const delimiterIndex = key.lastIndexOf(':');

        if (delimiterIndex === -1) {
            return false;
        }        

        const path = key.substring(0, delimiterIndex + 1);

        const pathSteps = path.split(':');
        const pathStepsLength = pathSteps.length;

        let lastPath = ``;

        for (let i = 0; i < pathStepsLength; i++) {
            if (lastPath === ``) {
                lastPath = pathSteps[i]
            } else {
                lastPath = `${lastPath}:${pathSteps[i]}`                
            }

            pathSteps[i] = `${lastPath}:*`;
        }

        pathSteps.pop();

        return pathSteps;
    }
    
    const cachedKeyPath: {[key: string]: string[]} = {};

    const way5 = function(key) {
        const delimiterIndex = key.lastIndexOf(':');

        if (delimiterIndex === -1) {
            return false;
        }        

        const path = key.substring(0, delimiterIndex + 1);

        const cachedPath = cachedKeyPath[path];

        if (cachedPath) {
            return cachedPath;
        }
        
        const pathSteps = path.split(':');
        const pathStepsLength = pathSteps.length;

        let lastPath = ``;

        for (let i = 0; i < pathStepsLength; i++) {
            if (lastPath === ``) {
                lastPath = pathSteps[i]
            } else {
                lastPath = `${lastPath}:${pathSteps[i]}`                
            }

            pathSteps[i] = `${lastPath}:*`;
        }

        pathSteps.pop();
        
        cachedKeyPath[path] = pathSteps;

        return pathSteps;
    }
    
    const way6 = function(key) {
        const delimiterIndex = key.lastIndexOf(':');

        if (delimiterIndex === -1) {
            return false;
        }        

        const pathSteps = key.split(':');
        const pathStepsLength = pathSteps.length;
        let lastPath = ``;

        for (let i = 0; i < pathStepsLength - 1; i++) {
            if (lastPath === ``) {
                lastPath = pathSteps[i]
            } else {
                lastPath = `${lastPath}:${pathSteps[i]}`                
            }

            pathSteps[i] = `${lastPath}:*`;
        }

        return pathSteps;
    }

    iter = 0;
    console.log(way1("ebeni:feni:feni:feni:feni:feni"))
    
    iter = 0;
    console.log(way2("ebeni:feni:feni:feni:feni:feni"))
    
    iter = 0;
    console.log(way3("ebeni:feni:feni:feni:feni:feni"))
    
    iter = 0;
    console.log(way4("ebeni:feni:feni:feni:feni:feni"))
    
    iter = 0;
    console.log(way5("ebeni:feni:feni:feni:feni:feni"))
    
    iter = 0;
    console.log(way6("ebeni:feni:feni:feni:feni:feni"))

    await benchmark.createSuite("Write", {time: 100})
        .setup(
            function() {
                iter = 0;
            }
        )
        .add("Way 6", 
            function() {
                way6("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++));
            }
        )
        .setup(
            function() {
                iter = 0;
            }
        )
        .add("Way 4", 
            function() {
                way4("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++));
            }
        )
        .setup(
            function() {
                iter = 0;
            }
        )
        .add("Way 3", 
            function() {
                way3("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++));
            }
        )
        .setup(
            function() {
                iter = 0;
            }
        )
        .add("Way 1", 
            function() {
                way1("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++));
            }
        )
        .setup(
            function() {
                iter = 0;
            }
        )
        .add("Way 5", 
            function() {
                way5("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++));
            }
        )
        .setup(
            function() {
                iter = 0;
            }
        )
        .add("Way 2",  
            function() {
                way2("ebeni" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++) + ":keys" + (iter++));
            }
        )
        .run();
}

void async function() { 
    deepcache = new DeepCache({ ttl: 60 * 10, dump: `./kek.dmp`, separator: `:`}); 
    eugenecache = EugeneCache();

    ////////////////

    start = 0;

    await benchmark.createSuite("__set", {time: 750})
        .setup(
            function() {
                iter = start;
            }
        )
        .add("DeepCache", 
            function() {
                deepcache.set("ebeni" + (iter++) + ":keys" + (iter++), "sasi" + (iter++));
            }
        )

        .setup(
            function() {
                iter = start;
            }
        )
        .add("EugeneCache", 
            function() {
                eugenecache.cacheSet("ebeni" + (iter++) + ":keys" + (iter++), "sasi" + (iter++));
            }
        )
        .run();
}

void async function() { 
    deepcache = new DeepCache({ ttl: 60 * 10, dump: `./kek.dmp`, separator: `:`}); 
    eugenecache = EugeneCache();

    ////////////////

    start = 0;

    class a {
        public ttl: any;
        public number: any;
        public float: any;

        constructor(a: string, b: number, c: number) {
            this.ttl = a;
            this.number = a;
            this.float = a;
        }
    }

    await benchmark.createSuite("__set", {time: 500})
        .setup(
            function() {
                iter = start;
            }
        )
        .add("Way 1", 
            function() {
                return {ttl: `kek`, number: 123, float: 123.13123};
            }
        )

        .setup(
            function() {
                iter = start;
            }
        )
        .add("Way 2", 
            function() {
                return new a(`kek`, 123, 123.13123)
            }
        )
        .run();
}

void async function() { 
    const a = {ebek: 228}
    await benchmark.createSuite("hui", {time: 1500})
        .add("Way 1", 
            function() {
                return a.hasOwnProperty(`ebek`);
            }
        )
        .add("Way 1-1", 
            function() {
                return a[`ebek`] ? true : false;
            }
        )
        .add("Way 2", 
            function() {
                return `ebek` in a;
            }
        )
        .add("Way 3", 
            function() {
                return a.hasOwnProperty(`ebek`);
            }
        )
        .run();
}

////////////////////////////////

void async function () {
    const cache = new DeepCache({ ttl: 60 * 10, dump: `./kek.dmp`, separator: `:`}); // 
    let time;

    time = performance.now();
    for (let z = 1; z < 20; z++) {
        for (let i = 1; i < 100000; i++) {
            cache.set("ebeni" + z + ":keys" + i, "sasi" + i);
        }
    }    
    console.log(`STEP 1: `, performance.now() - time)

    // time = performance.now();
    // for (let z = 1; z < 20; z++) {
    //     for (let i = 1; i < 100000; i++) {
    //         a.set("ebeni" + z + ":keys" + i, "sasi" + i);
    //     } 
    // }    
    // console.log(`STEP 1-2: `, performance.now() - time)

    // // time = performance.now();
    // // for (let z = 1; z < 20; z++) {
    // //     for (let i = 1; i < 100000; i++) {
    // //         b.cacheSet("ebeni" + z + ":keys" + i, "sasi" + i); 
    // //     }
    // // }    
    // // console.log(`STEP 1-3: `, performance.now() - time)
 
    // time = performance.now();
    // for (let z = 1; z < 20; z++) {
    //     for (let i = 1; i < 100000; i++) {
    //         cache.keys("ebeni" + z + ":*");
    //     }
    // }
    // console.log(`STEP 2: `, performance.now() - time)

    // time = performance.now();
    // for (let z = 1; z < 20; z++) {
    //     for (let i = 1; i < 100000; i++) {
    //         cache.has("ebeni" + z + ":key" + i);
    //     }
    // }
    // console.log(`STEP 3: `, performance.now() - time)

    // time = performance.now();
    // for (let z = 1; z < 20; z++) {
    //     for (let i = 1; i < 100000; i++) {
    //         cache.get("ebeni" + z + ":key" + i);
    //     }
    // }
    // console.log(`STEP 4: `, performance.now() - time)

    // time = performance.now();
    // for (let z = 1; z < 20; z++) {
    //     for (let i = 1; i < 100000; i++) {
    //         a.get("ebeni" + z + ":key" + i);
    //     }
    // }
    // console.log(`STEP 4-2: `, performance.now() - time)

    // // time = performance.now();
    // // for (let z = 1; z < 20; z++) {
    // //     for (let i = 1; i < 100000; i++) {
    // //         b.cacheGet("ebeni" + z + ":key" + i);
    // //     }
    // // }
    // // console.log(`STEP 4-3: `, performance.now() - time)

    // time = performance.now();
    // for (let z = 1; z < 20; z++) {
    //     for (let i = 1; i < 100000; i++) {
    //         cache.del("key" + i);
    //     }
    // }
    // console.log(`STEP 5: `, performance.now() - time)

    // time = performance.now();
    // for (let z = 1; z < 20; z++) {
    //     for (let i = 1; i < 100000; i++) {
    //         cache.del("ebeni" + z + ":key" + i);
    //     }
    // }
    // console.log(`STEP 6: `, performance.now() - time)

    // time = performance.now();
    // for (let z = 1; z < 20; z++) {
    //     for (let i = 1; i < 100000; i++) {
    //         cache.has("ebeni" + z + ":key" + i);
    //     }
    // }
    // console.log(`STEP 7: `, performance.now() - time)

    // time = performance.now();
    // for (let z = 1; z < 20; z++) {
    //     for (let i = 1; i < 100000; i++) {
    //         cache.get("ebeni" + z + ":key" + i);
    //     }
    // }
    // console.log(`STEP 8: `, performance.now() - time)

    // time = performance.now();
    // for (let z = 1; z < 20; z++) {
    //     for (let i = 1; i < 100000; i++) {
    //         cache.keys("ebeni" + z + ":*");
    //     }
    // }
    // console.log(`STEP 9: `, performance.now() - time)

    // time = performance.now();
    // for (let z = 1; z < 20; z++) {
    //     for (let i = 1; i < 100000; i++) {
    //         cache.values("ebeni" + z + ":*");
    //     }
    // }
    // console.log(`STEP 10: `, performance.now() - time)

    // console.log(cache.set("mykey", "hueta"))
    // console.log(cache.values())

    // cache.saveDump();

    // cache.loadDump();
    // console.log(cache.get("mykey"))
}