import sinon from 'sinon';
import { render, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Signature from './index';

const DOWNLOAD_URL = 'https://dummyimage.com/600x400/000/fff';

describe('Common | Inspection Item Control | Signature', () => {
  afterEach(() => sinon.restore());

  it('should not render image if there is no signature', () => {
    const props = {
      signatureDownloadURL: ''
    };

    render(<Signature {...props} />);

    const signatureImage = screen.queryByTestId('inspection-signature-image');
    expect(signatureImage).toBeNull();
  });

  it('should render image if there is signature', () => {
    const props = {
      signatureDownloadURL: DOWNLOAD_URL
    };

    render(<Signature {...props} />);

    const signatureImage = screen.queryByTestId('inspection-signature-image');
    expect(signatureImage).toBeTruthy();
    expect(signatureImage).toHaveAttribute('src', DOWNLOAD_URL);
  });

  it('should invoke click action when clicked', async () => {
    const expected = true;
    const onClick = sinon.spy();
    const props = {
      signatureDownloadURL: DOWNLOAD_URL,
      onClickSignatureInput: onClick
    };

    render(<Signature {...props} />);

    act(() => {
      const signatureImage = screen.queryByTestId(
        'inspection-signature-button'
      );
      userEvent.click(signatureImage);
    });

    const actual = onClick.called;
    expect(actual).toEqual(expected);
  });

  it('should not invoke click action when disabled', async () => {
    const expected = false;
    const onClick = sinon.spy();
    const props = {
      isDisabled: true,
      signatureDownloadURL: DOWNLOAD_URL,
      onClickSignatureInput: onClick
    };

    render(<Signature {...props} />);

    act(() => {
      const signatureImage = screen.queryByTestId(
        'inspection-signature-button'
      );
      userEvent.click(signatureImage);
    });

    const actual = onClick.called;
    expect(actual).toEqual(expected);
  });
});
