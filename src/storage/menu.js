/**
 * @fileoverview This at first was an attempt to save config. of menu, but it's useful
 *               for other configurations as well.
 */

/**
 * Save a configuration of the menu/something passing a {key} and the {data} you want to save.
 * @param {String} key
 * @param {Object} data
 */
export function saveConfig(key, data) {
  localStorage.setItem(
    key,
    typeof data === 'object' ? JSON.stringify(data) : String(data),
  );
}

/**
 * @param {String} key The key that you wanna retrieve
 * @param {String} type The type of data that you will retrieve (Default is string, if you wanna retrieve an object pass object, if you wanna retrieve a number pass number)
 * @param {Object} defaultData The data that will return this function if it doesn't find the key in the local storage
 */
export function getConfig(key, type = 'string', defaultData = null) {
  const data = localStorage.getItem(key);
  if (data === 'undefined' || data === 'null' || !data) {
    return defaultData;
  }

  if (type === 'object') {
    return JSON.parse(data);
  }

  if (type === 'number') {
    return parseInt(data, 10);
  }

  return data;
}
