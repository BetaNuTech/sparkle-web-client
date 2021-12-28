import sinon from 'sinon';
import { act, render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Context as ResponsiveContext } from 'react-responsive';
import {
  originalMultiSection,
  addedMultiSecton
} from '../../../../__mocks__/inspections';
import breakpoints from '../../../../config/breakpoints';
import SectionHeader from './index';

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

describe('Unit | Features | Property Update Inspection | Sections | Header', () => {
  it('should not show add section button', () => {
    const props = {
      section: originalMultiSection,
      nextSectionTitle: '',
      collapsedSections: [],
      onAddSection: sinon.spy(),
      onRemoveSection: sinon.spy(),
      canEdit: false,
      isMobile: false
    };

    render(<SectionHeader {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const addSectionButton = screen.queryByTestId(
      'section-list-item-add-section'
    );
    const removeSectionButton = screen.queryByTestId(
      'section-list-item-remove-section'
    );
    expect(addSectionButton).toBeFalsy();
    expect(removeSectionButton).toBeFalsy();
  });

  it('should show add section and remove section button', () => {
    const props = {
      section: addedMultiSecton,
      nextSectionTitle: '',
      collapsedSections: [],
      onAddSection: sinon.spy(),
      onRemoveSection: sinon.spy(),
      canEdit: true,
      isMobile: false
    };

    render(<SectionHeader {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const addSectionButton = screen.queryByTestId(
      'section-list-item-add-section'
    );
    const removeSectionButton = screen.queryByTestId(
      'section-list-item-remove-section'
    );
    expect(addSectionButton).toBeTruthy();
    expect(removeSectionButton).toBeTruthy();
  });

  it('should request to add section on click on add button', () => {
    const onAddSection = sinon.spy();
    const props = {
      section: originalMultiSection,
      nextSectionTitle: '',
      collapsedSections: [],
      onAddSection,
      onRemoveSection: sinon.spy(),
      canEdit: true,
      isMobile: false
    };

    render(<SectionHeader {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const addSectionButton = screen.queryByTestId(
      'section-list-item-add-section'
    );
    act(() => {
      userEvent.click(addSectionButton);
    });
    expect(addSectionButton).toBeTruthy();
    expect(onAddSection.called).toBeTruthy();
  });

  it('should request to remove section on click on remove button', () => {
    const onRemoveSection = sinon.spy();
    const props = {
      section: addedMultiSecton,
      nextSectionTitle: '',
      collapsedSections: [],
      onRemoveSection,
      onAddSection: sinon.spy(),
      canEdit: true,
      isMobile: false
    };

    render(<SectionHeader {...props} />, {
      contextWidth: breakpoints.desktop.minWidth
    });

    const removeSectionButton = screen.queryByTestId(
      'section-list-item-remove-section'
    );
    act(() => {
      userEvent.click(removeSectionButton);
    });
    expect(removeSectionButton).toBeTruthy();
    expect(onRemoveSection.called).toBeTruthy();
  });
});
