import sinon from 'sinon';
import { FunctionComponent, ChangeEvent, useState } from 'react';
import {
  fireEvent,
  act,
  render,
  screen,
  waitFor
} from '@testing-library/react';
import useStorage from './useStorage';
import storageApi from '../services/storage';

const Test: FunctionComponent = () => {
  const { uploadFileToStorage } = useStorage();
  const [result, setResult] = useState('');

  const onFileChange = async (evt: ChangeEvent<HTMLInputElement>) => {
    try {
      const { fileUrl } = await uploadFileToStorage(
        '/test.png',
        evt.target.files[0]
      );
      setResult(fileUrl);
    } catch (err) {
      setResult('fail');
    }
  };
  return (
    <>
      <input data-testid="input" type="file" onChange={onFileChange} />
      <div data-testid="result">{result}</div>
    </>
  );
};

describe('Unit | Common | Hooks | Use Storage', () => {
  afterEach(() => sinon.restore());

  test('should reject when there is a failure to get file URL', async () => {
    const expected = 'fail';
    let called = false;
    sinon.stub(storageApi, 'getFileUrl').rejects(Error('failure'));
    sinon.stub(storageApi, 'createUploadTask').returns({
      snapshot: { ref: 'test' },
      on(evt, onStart, onError, onComplete) {
        onComplete();
        called = true;
      }
    });

    render(<Test />);

    act(() => {
      const input = screen.getByTestId('input');
      fireEvent.change(input, {
        target: {
          files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
        }
      });
    });

    await waitFor(() => called);

    const result = screen.getByTestId('result');
    const actual = result.textContent;
    expect(actual).toEqual(expected);
  });

  test('should resolve a file URL', async () => {
    const expected = '/test/test.png';
    let called = false;
    sinon.stub(storageApi, 'getFileUrl').resolves(expected);
    sinon.stub(storageApi, 'createUploadTask').returns({
      snapshot: { ref: 'test' },
      on(evt, onStart, onError, onComplete) {
        onComplete();
        called = true;
      }
    });

    render(<Test />);

    act(() => {
      const input = screen.getByTestId('input');
      fireEvent.change(input, {
        target: {
          files: [new File(['(⌐□_□)'], 'test.png', { type: 'image/png' })]
        }
      });
    });

    await waitFor(() => called);

    const result = screen.getByTestId('result');
    const actual = result.textContent;
    expect(actual).toEqual(expected);
  });
});
