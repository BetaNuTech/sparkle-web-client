// Source: https://github.com/sindresorhus/copy-text-to-clipboard/blob/main/index.js
/* eslint-disable */
export default function copyTextToClipboard(
  input: string,
  { target = document.body } = {}
): boolean {
  const element = document.createElement('textarea');
  const previouslyFocusedElement = document.activeElement as HTMLElement;

  element.value = input;

  // Prevent keyboard from showing on mobile
  element.setAttribute('readonly', '');

  element.style.setProperty('contain', 'strict');
  element.style.setProperty('position', 'absolute');
  element.style.setProperty('left', '-9999px');
  element.style.setProperty('fontSize', '12pt'); // Prevent zooming on iOS

  const selection = document.getSelection();
  let originalRange: any = false;
  if (selection.rangeCount > 0) {
    originalRange = selection.getRangeAt(0);
  }

  target.append(element);
  element.select();

  // Explicit selection workaround for iOS
  element.selectionStart = 0;
  element.selectionEnd = input.length;

  let isSuccess = false;
  try {
    isSuccess = document.execCommand('copy');
  } catch {}

  element.remove();

  if (originalRange) {
    selection.removeAllRanges();
    selection.addRange(originalRange);
  }

  // Get the focus back on the previously focused element, if any
  if (previouslyFocusedElement) {
    previouslyFocusedElement.focus();
  }

  return isSuccess;
}
/* eslint-enable */
