export function removeSwaggerEmptyValues(obj: Object) {
    if (!obj || typeof obj !== 'object') {
        return obj || {};
    }
    Object.keys(obj).forEach(key => {
        if (obj[key] === undefined || obj[key] === "") {
            delete obj[key];
        }
    });
}