/**
 * execute statement without program crash if statement crash will return undefined
 * `getSafe(() => look.up.too.deep.object)`
 * @param fn function or statement to execute
 */
export const getSafe = <T>(fn: () => T): T|undefined => {
  try {
    return fn()
  } catch (error) {
    return undefined
  }
}

/**
 * execute async statement without program crash if statement crash will return undefined
 * @param fn async function or statement to execute
 */
export const asyncSafe = async <T>(fn: () => Promise<T>): Promise<T|undefined> => {
  try {
    return await fn()
  } catch (error) {
    return undefined
  }
}

/**
 * Compare two array
 * @param arr1
 * @param arr2
 */
export const arrayCompare = (arr1: any[], arr2: any[]): boolean => {
  if (!Array.isArray(arr1) || !Array.isArray(arr2)) return false
  if (arr1.length !== arr2.length) return false
  for (let i = 0; i < arr1.length; i++) {
    if (arr1[i] !== arr2[i]) return false
  }
  return true
}

const objectKeysCaster = (o: Record<string, any>, lower = false): Record<string, any> => {
  const keys = Object.keys(o)
  if (keys.length === 0) return o
  const newO: Record<string, any> = {}
  keys.forEach((key) => {
    const value = (typeof o[key] !== 'object' || o[key] == null) ? o[key] : objectKeysCasterHead(o[key], lower)
    lower ? newO[key.toLowerCase()] = value : newO[key.toUpperCase()] = value
  })
  return newO
}

const objectKeysCasterHead = (o: Record<string, any>, lower = false): Record<string, any> => {
  if (o == null) return o
  if (typeof o !== 'object') return o
  if (Array.isArray(o)) return o.map((a) => objectKeysCaster(a, lower))
  return objectKeysCaster(o, lower)
}

export const objectLowerKeys = (o: Record<string, any>): Record<string, any> => objectKeysCasterHead(o, true)
export const objectUpperKeys = (o: Record<string, any>): Record<string, any> => objectKeysCasterHead(o, false)

/**
 * random pick some value from array
 * @param {Array} posible
 */
const arrayPickup = (posible: any[]): any => posible[Math.floor(Math.random() * posible.length)]

/**
 * random pick key with weight value
 * @param posible
 */
export const posibilityPickup = (posible: Record<string, any>): any => {
  const populatedPosible: any[] = []
  Object.keys(posible).forEach(key => {
    const weight = posible[key]
    for (let i = 0; i < weight; i++) {
      populatedPosible.push(key)
    }
  })
  return arrayPickup(populatedPosible)
}

/**
 * parallel async with limit thread amount
 * @param array - Array of async functions
 * @param pSize - thread amount default is 10
 */
export const parallel = async <T>(array: Array<() => T>, pSize: number = 10): Promise<T[]> => {
  const res = []
  for (let i = 0; i < Math.ceil(array.length / pSize); i++) {
    const start = i * pSize
    const stop = (i + 1) * pSize > array.length ? array.length : (i + 1) * pSize
    const asyncRes = []
    for (let j = start; j < stop; j++) {
      const fn = array[j]
      if (fn != null) asyncRes.push(fn())
    }
    res.push(...(await Promise.all(asyncRes)))
  }
  return res
}
