// Convert a phone number a human readable form
// with (area-code), spacing, and common dashes
export function phoneNumber(src: string): string {
  // Strip out unwanted characters
  const parsed = `${src}`.replace(/[+|\-|(|)|\s]+/gi, '').slice(-10);
  const areaCode = parsed.slice(0, 3);
  const geoCode = parsed.slice(3, 6);
  const homeCode = parsed.slice(6);
  return `(${areaCode}) ${geoCode}-${homeCode}`.replace(/[-|\s]$/gi, '');
}
