function isObject(obj) {
    return obj !== null && typeof obj === 'object'
}

function isPrimitive(value) {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        // $flow-disable-line
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    )
}

function isUndef(v) {
    return v === undefined || v === null
}

function isDef(v) {
    return v !== undefined && v !== null
}

function isTrue(v) {
    return v === true
}

function isFalse(v) {
    return v === false
}

function isArray(v) {
    return Array.isArray(v)
}

function immune(v) {
    if (isUndef(v) || isPrimitive(v)) {
        return v
    }
    if (isArray(v)) {
        return [...v]
    }
    if (isObject(v)) {
        return Object.assign({}, v)
    }

    return v
}

export {
    isObject, isPrimitive, isUndef,
    isDef, isTrue, isFalse,
    isArray, immune
}