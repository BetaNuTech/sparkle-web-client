import sinon from 'sinon';
import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import stubIntersectionObserver from '../../../__tests__/helpers/stubIntersectionObserver';
import {
  fullInspection,
  inspectionB,
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
  it('should hide edit button and disable complete button if inspection not completed', () => {
    const props = {
      property: fullProperty,
      inspection: inspectionB,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true
    };

    render(<MobileLayout {...props} />);

    const editButton = screen.queryByTestId('header-edit-button');
    const completeButton = screen.queryByTestId('header-complete-button');

    expect(editButton).toBeNull();
    expect(completeButton).toBeDisabled();
  });

  it('should hide edit button if inspection is completed but user is not admin', () => {
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true,
      canEnableEditMode: false
    };

    render(<MobileLayout {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const editButton = screen.queryByTestId('header-edit-button');

    expect(editButton).toBeNull();
  });

  it('should show edit button if inspection completed and current user is admin', () => {
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      canEnableEditMode: true
    };

    render(<MobileLayout {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const editButton = screen.queryByTestId('header-edit-button');

    expect(editButton).toBeTruthy();
  });

  it('should enable complete button if inspection completed', () => {
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true
    };

    render(<MobileLayout {...props} />);

    const completeButton = screen.queryByTestId('header-complete-button');

    expect(completeButton).not.toBeDisabled();
  });

  it('should disable save button if no updates to the inspection are publishable', () => {
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true,
      hasUpdates: false,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSaveInspection: () => {}
    };

    render(<MobileLayout {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const saveButton = screen.queryByTestId('header-save-button');
    expect(saveButton).toBeDisabled();
  });

  it('should disable save button if user is offline', () => {
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: false,
      hasUpdates: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSaveInspection: () => {}
    };

    render(<MobileLayout {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const saveButton = screen.queryByTestId('header-save-button');
    expect(saveButton).toBeDisabled();
  });

  it('should enable save button if user is online and we have publishable updates', () => {
    const props = {
      property: fullProperty,
      inspection: fullInspection,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onShareAction: () => {},
      isOnline: true,
      hasUpdates: true,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onSaveInspection: () => {}
    };

    render(<MobileLayout {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const saveButton = screen.queryByTestId('header-save-button');
    expect(saveButton).not.toBeDisabled();
  });

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
