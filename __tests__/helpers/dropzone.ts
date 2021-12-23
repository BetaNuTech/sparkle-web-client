import { act, fireEvent, waitFor } from '@testing-library/react';

// eslint-disable-next-line
export async function flushPromises(rerender: (el: any) => void, ui: any) {
  await act(() => waitFor(() => rerender(ui)));
}

// Publish dropzone event
export function dispatchEvent(
  node: Document | Node | Element | Window,
  type: string,
  data: any // eslint-disable-line
): void {
  const event = new Event(type, { bubbles: true });
  Object.assign(event, data);
  fireEvent(node, event);
}

// Wrap files in drag and drop event payload
export function mockFiles(files: any[]): any {
  return {
    dataTransfer: {
      files,
      items: files.map((file) => ({
        kind: 'file',
        type: file.type,
        getAsFile: () => file
      })),
      types: ['Files']
    }
  };
}
