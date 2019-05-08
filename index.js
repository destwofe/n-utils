/**
 * execute statement without program crash if statement crash will return undefined
 * `getSafe(() => look.up.too.deep.object)`
 * @param {function} fn function or statement to execute
 */
const getSafe = fn => {
  try {
    return fn();
  } catch (error) {
    return undefined;
  }
};

/**
 * Compare two array
 * @param {Array} arr1
 * @param {Array} arr2
 */
const arrayCompare = (arr1, arr2) => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false;
  if (arr1.length !== arr2.length) return false;
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false;
  }
  return true;
}

/**
 * get request remote ip address
 * @param {Request} req
 */
const getIPAddr = req => req.headers['x-forwarded-for'] || req.connection.remoteAddress;

/**
 * parse an error to json object
 * @param {Error} err javascript error
 */
const objectify = err =>
  err.message && err.name && err.stack
    ? { name: err.name, message: err.message, stack: err.stack, ...err }
    : err;

/**
 * split array of object to array of array of object
 * ex [{a: 1, b:1}, {a: 2, b: 2}, {c: 3}, {d: 1, e: 1}] ->
 * [[{a: 1, b:1}, {a: 2, b: 2}], [{c: 2}], [{d: 1, e: 1}]]
 * @param {Array} arr
 */
const objectSplit = (arr) => {
  try {
    if (!Array.isArray(arr)) return undefined;
    if (arr.length === 0) return [];
    const tables = [];
    let tableIndex = -1;
    let previousKeys = null;
    arr.forEach(obj => {
      const keys = Object.keys(obj);
      if (!arrayCompare(previousKeys, keys)) {
        tables.push([obj]);
        tableIndex += 1;
      } else {
        tables[tableIndex].push(obj);
      }
      previousKeys = keys;
    })
    return tables;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getSafe,
  arrayCompare,
  getIPAddr,
  objectify,
  objectSplit,
};
