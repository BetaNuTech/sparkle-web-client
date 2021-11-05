// Replace an object's contense with a new object
// Source: https://github.com/a7ul/replace-object-content/blob/master/index.js
// eslint-disable-next-line
export function replaceContent(oldObject: any, newObject: any): any {
  const oldKeys = Object.keys(oldObject);
  const newKeys = Object.keys(newObject);
  oldKeys.forEach((eachKey) => {
    delete oldObject[eachKey];
  });
  newKeys.forEach((eachKey) => {
    oldObject[eachKey] = newObject[eachKey];
  });
  return oldObject;
}
