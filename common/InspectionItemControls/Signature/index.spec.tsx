import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import Signature from './index';

describe('Common | Inspection Item Control | Signature', () => {
  afterEach(() => sinon.restore());

  it('should not render image if there is no signature', async () => {
    const props = {
      signatureDownloadURL: ''
    };

    render(<Signature {...props} />);

    const signatureImage = screen.queryByTestId('inspection-signature-image');
    expect(signatureImage).toBeNull();
  });

  it('should render image if there is signature', async () => {
    const signatureDownloadURL = 'https://dummyimage.com/600x400/000/fff';
    const props = {
      signatureDownloadURL
    };

    render(<Signature {...props} />);

    const signatureImage = screen.queryByTestId('inspection-signature-image');
    expect(signatureImage).toBeTruthy();
    expect(signatureImage).toHaveAttribute('src', signatureDownloadURL);
  });
});
