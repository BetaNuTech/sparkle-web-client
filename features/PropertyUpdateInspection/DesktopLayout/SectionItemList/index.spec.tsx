import sinon from 'sinon';
import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import stubIntersectionObserver from '../../../../__tests__/helpers/stubIntersectionObserver';
import {
  unpublishedSignatureEntry,
  unselectedSignatureInputItem
} from '../../../../__mocks__/inspections';
import breakpoints from '../../../../config/breakpoints';
import SectionItemList from './index';

function render(ui: any, options: any = {}) {
  sinon.restore();

  const contextWidth = options.contextWidth || breakpoints.tablet.maxWidth;
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: contextWidth }}>
      {ui}
    </ResponsiveContext.Provider>,
    options
  );
}

describe('Unit | Features | Property Update Inspection | Desktop Layout', () => {
  it('should show unpublished signature', () => {
    stubIntersectionObserver();
    const inspectionItemsSignature = new Map();
    const inspectionItem = { ...unselectedSignatureInputItem, id: 'item-1' };
    inspectionItemsSignature.set('item-1', [unpublishedSignatureEntry]);
    const props = {
      item: inspectionItem,
      onInputChange: sinon.spy(),
      onClickOneActionNotes: sinon.spy(),
      onItemIsNAChange: sinon.spy(),
      onClickAttachmentNotes: sinon.spy(),
      onClickSignatureInput: sinon.spy(),
      onClickPhotos: sinon.spy(),
      inspectionItemsPhotos: new Map(),
      forceVisible: true,
      inspectionItemsSignature
    };

    render(<SectionItemList {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const signatureImage = screen.queryByTestId('inspection-signature-image');
    expect(signatureImage).toHaveAttribute(
      'src',
      unpublishedSignatureEntry.signature
    );
  });
});
