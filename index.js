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

module.exports = {
  getSafe,
  getIPAddr,
  objectify,
};
