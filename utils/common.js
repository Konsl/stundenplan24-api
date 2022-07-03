export function isEmptyObject(obj) {
    return obj.constructor === Object && Object.entries(obj).length === 0;
}

export function mapObject(obj, cb){
    return Object.keys(obj).reduce((r, key) => {
        r[key] = cb(key, r[key]);
        return r;
    }, {});
}