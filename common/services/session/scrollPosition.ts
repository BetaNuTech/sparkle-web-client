// get and return previously
// saved scroll position
// for particular key
const getScrollPosition = (sessionKey: string): number =>
  Number(sessionStorage.getItem(sessionKey) || 0);

// set scroll position
// for particular key
const setItem = (sessionKey: string, scrollPosition: number): number => {
  sessionStorage.setItem(sessionKey, scrollPosition.toString());
  return scrollPosition;
};

// remove scroll position
// for particular key
const removeItem = (sessionKey: string): number => {
  sessionStorage.removeItem(sessionKey);
  return -1;
};

export default {
  getScrollPosition,
  setItem,
  removeItem
};
