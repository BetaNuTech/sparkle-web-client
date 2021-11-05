// Functional mixin factory
/* eslint-disable */
export default (...fns: any[]) =>
  (o: any, ...args: any[]): any =>
    fns.reduce((x, fn: any) => fn(x, ...args), o);
/* eslint-enable */
