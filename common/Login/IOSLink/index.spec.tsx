import { render, screen } from '@testing-library/react';
import firebaseConfig from '../../../config/firebase';
import IOSLink from './index';

const { storageBucket, projectId } = firebaseConfig;
describe('Unit | Common | Login | IOSLink', () => {
  it('it links to the ios Plist file', () => {
    const url = encodeURIComponent(
      `https://firebasestorage.googleapis.com/v0/b/${storageBucket}/o/ios%2F${projectId}.plist?alt=media`
    );
    const expected = `itms-services://?action=download-manifest&url=${url}`;
    render(<IOSLink />);
    const linkEl = screen.queryByTestId('ios-link');
    expect(linkEl).toHaveAttribute('href', expected);
  });
});
