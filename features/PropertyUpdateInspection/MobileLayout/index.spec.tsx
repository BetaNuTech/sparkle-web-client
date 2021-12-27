import sinon from 'sinon';
import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import stubIntersectionObserver from '../../../__tests__/helpers/stubIntersectionObserver';
import {
  fullInspection,
  unpublishedSignatureEntry,
  unselectedSignatureInputItem,
  singleSection
} from '../../../__mocks__/inspections';
import { fullProperty } from '../../../__mocks__/properties';
import breakpoints from '../../../config/breakpoints';
import MobileLayout from './index';

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

describe('Unit | Features | Property Update Inspection | Mobile Layout', () => {
  it('should show unpublished signature', () => {
    stubIntersectionObserver();
    const sectionItems = new Map();
    const inspectionItemsSignature = new Map();
    const inspectionItem = { ...unselectedSignatureInputItem, id: 'item-1' };
    inspectionItemsSignature.set('item-1', [unpublishedSignatureEntry]);
    sectionItems.set('section-1', [inspectionItem]);
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true,
      hasUpdates: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSaveInspection: () => {},
      collapsedSections: [],
      inspectionItemsPhotos: new Map(),
      templateSections: [singleSection],
      forceVisible: true,
      sectionItems,
      inspectionItemsSignature
    };

    render(<MobileLayout {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const signatureImage = screen.queryByTestId('inspection-signature-image');
    expect(signatureImage).toHaveAttribute(
      'src',
      unpublishedSignatureEntry.signature
    );
  });
});
