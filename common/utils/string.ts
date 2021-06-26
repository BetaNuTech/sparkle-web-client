export default {
  titleize(params: string): string {
    return params
      .split(' ')
      .map((s) => `${s.slice(0, 1).toUpperCase()}${s.slice(1)}`)
      .join(' ');
  }
};
