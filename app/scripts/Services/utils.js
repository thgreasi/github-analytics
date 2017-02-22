export function waitFor(ms) {
    return new Promise(function(resolve) {
        setTimeout(() => {
            resolve();
        }, ms);
    });
}

export function resolveAfter(value, ms) {
    return new Promise(function(resolve) {
        setTimeout(() => {
            resolve(value);
        }, ms);
    });
}
