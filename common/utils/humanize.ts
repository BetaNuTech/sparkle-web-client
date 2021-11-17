const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
});

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

// Convert a number-like to a formatted USD money string
export function moneyUsd(src: number | string, decimals = true): string {
  let val = src;

  if (typeof src === 'string') {
    val = parseFloat(src);
  }

  const result = USD.format(val as number);

  if (!decimals) {
    return result.split('.')[0];
  }

  return result;
}
