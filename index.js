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

/**
 * filter object have spacific keys
 * @param {Array} arr - source array
 * @param {Array} keys - expected key
 * @param {Boolean} exact - exact match or not
 * ([{a: '10', b: '20', c: '30'}, {a: '11', b: '22'}, {a: '12', b:'23'}], ['a', 'b']) -> [ { a: '11', b: '22' }, { a: '12', b: '23' } ]
 * ([{a: '10', b: '20', c: '30'}, {a: '11', b: '22'}, {a: '12', b:'23'}], ['a', 'b', 'c']) -> [ { a: '10', b: '20', c: '30' } ]
 * ([{a: '10', b: '20', c: '30'}, {a: '11', b: '22'}, {a: '12', b:'23'}], ['a', 'b'], false) -> [ [ { a: '10' }, { b: '20' } ], [ { a: '11' }, { b: '22' } ], [ { a: '12' }, { b: '23' } ] ]
 * ([{a: '10', b: '20', c: '30'}, {a: '11', b: '22'}, {a: '12', b:'23'}], ['a', 'b', 'c'], false) -> [ [ { a: '10' }, { b: '20' }, { c: '30' } ], [ { a: '11' }, { b: '22' }, { c: undefined } ], [ { a: '12' }, { b: '23' }, { c: undefined } ] ]
 */
const objectFilter = (arr, keys, exact = true) => {
  try {
    if (!Array.isArray(arr)) return undefined;
    if (arr.length === 0) return [];
    if (!keys) return new Error('keys is required');

    if (exact) return arr.filter((value) => arrayCompare(Object.keys(value), keys))
    return arr.map((value) => keys.map(key => ({ [key]: value[key] })))
  } catch (error) {
    throw error;
  }
}

/**
 * random pick some value from array
 * @param {Array} posible
 */
const arrayPickup = (posible) => posible[Math.floor(Math.random() * posible.length)];

/**
 * random pick key with weight value
 * @param {Object} posible
 */
const posibilityPickup = (posible = { a: 1, b: 1, c: 2 }) => {
  const populatedPosible = []
  Object.keys(posible).forEach(key => {
    const weight = posible[key];
    for (let i = 0; i < weight; i++) {
      populatedPosible.push(key);
    }
  });
  return arrayPickup(populatedPosible)
}

/**
 * parallel async with limit thread amount
 * @param {[Function]} array - Array of async functions
 * @param {Number} pSize - thread amount default is 10
 */
const parallel = async (array, pSize = 10) => {
  const res = []
  for (let i = 0; i < Math.ceil(array.length / pSize); i++) {
    const start = i * pSize
    const stop = (i + 1) * pSize > array.length ? array.length : (i + 1) * pSize
    const asyncRes = []
    for (let j = start; j < stop; j++) {
      asyncRes.push(array[j]())
    }
    res.push(...(await Promise.all(asyncRes)))
  }
  return res
}

/**
 * search string is exist
 * @param {String} string
 * @param {String} search
 */
const stringSearch = (string = '', search = '') =>
  string.toLocaleUpperCase().indexOf(search.toLocaleUpperCase()) !== -1;

/**
 * format number
 * @param {Number} n
 * @param {Number} f - floating point length
 */
const formatNumber = (n, f = 0) =>
  Number(n).toLocaleString('th', { maximumFractionDigits: f, minimumFractionDigits: f });

/**
 * get plus number prefix
 * @param {Number} n
 */
const getNumberPrefix = n => (n > 0 ? '+' : '');

module.exports = {
  getSafe,
  arrayCompare,
  getIPAddr,
  objectify,
  objectSplit,
  objectFilter,
  arrayPickup,
  posibilityPickup,
  parallel,
  stringSearch,
  formatNumber,
  getNumberPrefix,
};
