// Generates an RFC4122 version 4 unique ID
export default function uuidv4(len = 36): string {
  // eslint-disable-next-line
  if (typeof len !== 'number' || len !== len || len < 1 || len > 36) {
    throw Error('utils: uuidv4: invalid length argument');
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    .slice(-1 * len)
    .replace(/[xy]/g, generate);
}

export function uuid(len = 20): string {
  // eslint-disable-next-line
  if (typeof len !== 'number' || len !== len || len < 1) {
    throw Error('utils: uuid: invalid length argument');
  }
  return [...Array(len)]
    .map(() => 'x')
    .join('')
    .replace(/[x]/g, generate);
}

/* eslint-disable */
function generate(c: string): string {
  const r = (Math.random() * 16) | 0;
  const v = c == 'x' ? r : (r & 0x3) | 0x8;
  return v.toString(16);
}
/* eslint-enable */
