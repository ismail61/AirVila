import validator from 'validator'
export default (obj) => {
    if (Object.keys(obj).length === 0 && obj.constructor === Object) return;
    for (const property in obj) {
        obj[property] =  validator?.escape(String(obj[property]))
    }
    return obj;
}