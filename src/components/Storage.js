/* eslint-disable no-console */
export function getFromStorage(key) {
  if (!key) {
    return null;
  }

  try {
    const valueStr = localStorage.getItem(key);
    if (valueStr) {
      return JSON.parse(valueStr);
    }
  } catch (err) {
    return null;
  }
  return null;
}

export function setInStorage(key, obj) {
  if (!key) {
    console.log('Error: Key is missing');
  }

  try {
    localStorage.setItem(key, JSON.stringify(obj));
  } catch (err) {
    console.log(err);
  }
}

export function removeFromStorage(key, obj) {
  if (!key) {
    console.log('Error: Key is missing');
  }

  try {
    localStorage.removeItem(key, JSON.stringify(obj));
  } catch (err) {
    console.log(err);
  }
}
