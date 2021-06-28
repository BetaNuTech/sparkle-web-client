// eslint-disable-next-line
const deepClone = (obj: any): any => {
  if (!obj && typeof obj !== 'object') {
    throw TypeError('deepClone requires an object or array');
  }

  return JSON.parse(JSON.stringify(obj));
};

export default deepClone;
