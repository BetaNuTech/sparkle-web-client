export default {
  // Captialize the first letter of each word in given string
  titleize(params: string): string {
    return params
      .split(' ')
      .map((s) => `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`)
      .join(' ');
  },

  // Converts string into array of keywords of lowercase.
  //  It breaks the string on space, also excludes the empty string tokens
  getSearchKeywords(input: string): Array<string> {
    return input
      .toLowerCase()
      .split(' ')
      .filter((str) => str.trim().length > 0);
  },

  // Converts number into comma separated currency
  getFormattedCurrency(input: number): string {
    return String(Number(input.toFixed(2))).replace(/(.)(?=(\d{3})+$)/g, '$1,');
  }
};
