export default {
  // convert base64 file into file object
  dataURLtoFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    // eslint-disable-next-line no-plusplus
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  },

  // Approximate the size of
  // a base64 string (data URI)
  // based on SO Answer: https://stackoverflow.com/questions/17409496/what-is-a-base64-length-in-bytes#answer-39640087
  estimateBase64ByteSize(base64: string): number {
    return Math.round(base64.replace(/=/g, '').length * 0.75 || 0);
  }
};
