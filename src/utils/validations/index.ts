export const isArrayEmpty = (array: Array<any>) => {
    if (typeof array !== 'object') return true;
    if (array && array.length <= 0) return true;
    return false;
}