export const isObject = (o: any) => {
  return o != null && o.constructor.name === "Object";
};

/**
 * @example pick({a: 1, b: 2}, ["a"]); // {a: 1}
 * @see source https://stackoverflow.com/a/56162151/13536765
 */
export function pick<T extends object, U extends keyof T>(
  obj: T,
  paths: Array<U>
): Pick<T, U> {
  const ret = Object.create(null);
  for (const k of paths) {
    ret[k] = obj[k];
  }
  return ret;
}

/**
 * @example omit({ a: 1, b: 2, c: 3 }, ["a"]); // {b: 1, c: 3}
 */
export function omit<T extends object, U extends keyof T>(
  obj: T,
  keys: Array<U>
): Omit<T, U> {
  let result = keys.reduce((a: any, e) => {
    const { [e]: omit, ...rest } = a;
    return rest;
  }, obj);

  return result;
}
