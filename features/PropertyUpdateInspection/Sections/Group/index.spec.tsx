import sinon from 'sinon';
import { act, render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Context as ResponsiveContext } from 'react-responsive';
import {
  originalMultiSection,
  emptyTextInputItem
} from '../../../../__mocks__/inspections';
import breakpoints from '../../../../config/breakpoints';
import stubIntersectionObserver from '../../../../__tests__/helpers/stubIntersectionObserver';
import Group from './index';

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

describe('Unit | Features | Property Update Inspection | Sections | Group', () => {
  beforeEach(() => stubIntersectionObserver());

  it('should request to add section on click on add button', () => {
    const sectionItems = new Map();
    sectionItems.set(originalMultiSection.id, [emptyTextInputItem]);

    const onSectionCollapseToggle = sinon.spy();
    const props = {
      forceVisible: true,
      onMainInputChange: sinon.spy(),
      onTextInputChange: sinon.spy(),
      onClickOneActionNotes: sinon.spy(),
      onItemIsNAChange: sinon.spy(),
      onClickAttachmentNotes: sinon.spy(),
      onClickSignatureInput: sinon.spy(),
      onClickPhotos: sinon.spy(),
      inspectionItemsPhotos: new Map(),
      inspectionItemsSignature: new Map(),
      section: originalMultiSection,
      nextSectionTitle: '',
      collapsedSections: [],
      onAddSection: sinon.spy(),
      onRemoveSection: sinon.spy(),
      onSectionCollapseToggle,
      canEdit: true,
      isMobile: false,
      inspectionItemDeficientIds: [],
      completedItems: [],
      sectionItems
    };

    render(<Group {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const sectionItemList = screen.queryByTestId('section-list-item');

    act(() => {
      userEvent.click(sectionItemList);
    });
    expect(sectionItemList).toBeTruthy();
    const sectionCollapseToggleId = (
      onSectionCollapseToggle.getCall(0).args[0] || {}
    ).id;
    expect(onSectionCollapseToggle.called).toBeTruthy();
    expect(sectionCollapseToggleId).toEqual(originalMultiSection.id);
  });
});
