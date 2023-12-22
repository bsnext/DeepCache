const getTimestamp = function(date) {
    if (date) {
        return Math.round((new Date(date).getTime()) / 1000);
    };

    return Math.round((new Date().getTime()) / 1000);
};

let separator = `:`;
let ttl = 3600;
let ttc = 1800;


let storage = {};


const getPathKey = function(path) {
    let folder = `default`;
    
    let path_array = path.split(separator);

    if (path_array.length < 2 || path_array[0].length < 1) {
        return {
            folder: folder,
            key: path
        };
    };

    folder = path_array[0];
    key = path_array.splice(1).join();

    if (key.length < 1) {
        return {
            folder: folder
        };
    };

    return {
        folder: folder,
        key: key
    };
};


const set = function(keys, value, key_ttl = ttl) {
    if (!Array.isArray(keys)) {
        keys = [keys];
    };

    let data;

    if (typeof value === `object` && !Array.isArray(value) && value !== null) {
        let copied_object = structuredClone(value);

        data = {
            value: copied_object,
            expire: getTimestamp() + key_ttl
        };
    } else {
        data = {
            value: value,
            expire: getTimestamp() + key_ttl
        };
    };

    for (let i = 0; i < keys.length; i++) {
        const { key, folder } = getPathKey(keys[i]);

        if (storage[folder]) {
            storage[folder][key] = data;
        } else {
            storage[folder] = {
                [key]: data
            };
        };
    };

    return value;
};

const get = function(path) {
    let { key, folder } = getPathKey(path);

    if (!storage[folder]) {
        return null;
    };

    if (!key) {
        return storage[folder];
    };

    let data = storage[folder][key];

    if (data === undefined) {
        return null;
    };

    if (getTimestamp() > data.expire) {
        delete storage[folder][key];
        return null;
    };

    if (typeof data.value === `object` && !Array.isArray(data.value) && data.value !== null) {
        return structuredClone(data.value);
    };

    return data.value;
};

const has = function(path) {
    let { key, folder } = getPathKey(path);

    if (!storage[folder]) {
        return false;
    };

    if (!key) {
        return true;
    };

    let data = storage[folder][key];

    if (data === undefined) {
        return false;
    };

    if (getTimestamp() > data.expire) {
        delete storage[folder][key];
        return false;
    };

    return true;
};

const del = function(path_arr, delete_duplicates = false) {
    if (typeof path_arr !== `object`) {
        path_arr = [path_arr];
    };

    for (const path of path_arr) {
        let { key, folder } = getPathKey(path);

        if (!storage[folder]) {
            continue;
        };

        if (!key) {
            delete storage[folder];
            continue;
        };

        if (delete_duplicates) {
            let deleted_value = storage[folder][key];

            for (let [folder, keys] of Object.entries(storage)) {
                for (let [key, data] of Object.entries(keys)) {
                    if (deleted_value === data) {
                        delete storage[folder][key];
                    };
                };
            };
        } else {
            delete storage[folder][key];
        };

        if (Object.keys(storage[folder]).length < 1) {
            delete storage[folder];
        };
    };
    
    return true;
};


const clean = function() {
    for (const [folder, keys] of Object.entries(storage)) {
        for (const [key, key_data] of Object.entries(keys)) {
            if (getTimestamp() > key_data.expire) {
                delete storage[folder][key];

                if (Object.keys(keys).length < 1) {
                    delete storage[folder];
                };
            };
        }
    };
};

let cleaner = setInterval(clean, ttc * 1000);


module.exports = function(settings = {}) {
    if (settings.ttc && settings.ttc !== ttc) {
        clearInterval(cleaner);
        cleaner = setInterval(clean, settings.ttc * 1000);
    };

    separator = settings.separator || separator;
    ttl = settings.ttl || ttl;
    ttc = settings.ttc || ttc;

    return {
        cacheSet: set,
        cacheGet: get,
        cacheHas: has,
        cacheDel: del
    };
};