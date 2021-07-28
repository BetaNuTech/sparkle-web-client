import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { fullProperty } from '../../../../../__mocks__/properties';
import Header from '../../../../../features/PropertyProfile/Header';
import breakpoints from '../../../../../config/breakpoints';

function render(ui: any, options = {}) {
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: breakpoints.desktop.minWidth }}>
      {ui}
    </ResponsiveContext.Provider>,
    options
  );
}

describe('Integration | Features | Properties | Profile | Header', () => {
  it('renders', () => {
    const expected = 1;
    render(
      <Header
        canUserAccessJob={false}
        property={fullProperty}
        isYardiConfigured={false}
        activeInspectionSortFilter={() => ''}
      />
    );
    const items: Array<HTMLElement> = screen.queryAllByTestId(
      'property-profile-header'
    );
    const footer: Array<HTMLElement> = screen.queryAllByTestId(
      'property-profile-mobile-footer'
    );
    const actual = items.length;
    expect(actual).toEqual(expected);

    // For desktop it should not be visible
    const actualFooter = footer.length;
    expect(actualFooter).toEqual(0);
  });

  it('shows mobile UI to mobile users', () => {
    const expected = 1;
    render(
      <Header
        canUserAccessJob={false}
        property={fullProperty}
        isMobile
        isYardiConfigured={false}
        activeInspectionSortFilter={() => ''}
      />
    );
    const items: Array<HTMLElement> = screen.queryAllByTestId(
      'property-profile-header-mobile'
    );
    const footer: Array<HTMLElement> = screen.queryAllByTestId(
      'property-profile-mobile-footer'
    );
    const actual = items.length;
    expect(actual).toEqual(expected);

    // For mobile it should be visible
    const actualFooter = footer.length;
    expect(actualFooter).toEqual(expected);
  });

  it('shows property name if it does not have a usable photo', () => {
    const expected = 1;
    const property = { ...fullProperty };
    property.photoURL = null;

    render(
      <Header
        canUserAccessJob={false}
        property={property}
        isMobile
        isYardiConfigured={false}
        activeInspectionSortFilter={() => ''}
      />
    );
    const items: Array<HTMLElement> = screen.queryAllByTestId(
      'property-profile-name'
    );
    const actual = items.length;
    expect(actual).toEqual(expected);
  });

  it('shows yardi buttons when property is configured for yardi', () => {
    const expected = 1;
    const property = { ...fullProperty };
    property.code = 'code';

    render(
      <Header
        canUserAccessJob={false}
        property={property}
        isMobile
        isYardiConfigured
        activeInspectionSortFilter={() => ''}
      />
    );
    const items: Array<HTMLElement> = screen.queryAllByTestId(
      'property-profile-yardi-button'
    );
    const actual = items.length;
    expect(actual).toEqual(expected);
  });

  it('hides yardi buttons when property is not configured for yardi', () => {
    const expected = 0;
    const property = { ...fullProperty };
    property.code = '';

    render(
      <Header
        canUserAccessJob={false}
        property={property}
        isMobile
        isYardiConfigured={false}
        activeInspectionSortFilter={() => ''}
      />
    );
    const items: Array<HTMLElement> = screen.queryAllByTestId(
      'property-profile-yardi-button'
    );
    const actual = items.length;
    expect(actual).toEqual(expected);
  });

  it('has plural labels when property has lots of meta data', () => {
    const property = { ...fullProperty };
    property.numOfDeficientItems = 5;
    property.numOfRequiredActionsForDeficientItems = 5;
    property.numOfFollowUpActionsForDeficientItems = 5;

    render(
      <Header
        canUserAccessJob={false}
        property={property}
        isMobile
        isYardiConfigured={false}
        activeInspectionSortFilter={() => ''}
      />
    );
    const deficientItem: HTMLElement = screen.queryByTestId(
      'property-profile-deficient-item'
    );
    const deficientItemAction: HTMLElement = screen.queryByTestId(
      'property-profile-deficient-item-actions'
    );
    const deficientItemFollowup: HTMLElement = screen.queryByTestId(
      'property-profile-deficient-item-followups'
    );

    expect(deficientItem.textContent).toEqual('5 Deficient Items');
    expect(deficientItemAction.textContent).toEqual('5 Actions Required');
    expect(deficientItemFollowup.textContent).toEqual('5 Follow Ups');
  });

  it('singular lables when property has singular meta data', () => {
    const property = { ...fullProperty };
    property.numOfDeficientItems = 0;
    property.numOfRequiredActionsForDeficientItems = 0;
    property.numOfFollowUpActionsForDeficientItems = 0;

    render(
      <Header
        canUserAccessJob={false}
        property={property}
        isMobile
        isYardiConfigured={false}
        activeInspectionSortFilter={() => ''}
      />
    );
    const deficientItem: HTMLElement = screen.queryByTestId(
      'property-profile-deficient-item'
    );
    const deficientItemAction: HTMLElement = screen.queryByTestId(
      'property-profile-deficient-item-actions'
    );
    const deficientItemFollowup: HTMLElement = screen.queryByTestId(
      'property-profile-deficient-item-followups'
    );

    expect(deficientItem.textContent).toEqual('0 Deficient Item');
    expect(deficientItemAction.textContent).toEqual('0 Action Required');
    expect(deficientItemFollowup.textContent).toEqual('0 Follow Up');
  });

  it('renders jobs page link for mobile if user is permitted to access job', () => {
    const property = { ...fullProperty };
    const expectedLink = `/properties/${property.id}/jobs`;
    render(
      <Header
        canUserAccessJob
        property={property}
        isMobile
        isYardiConfigured={false}
        activeInspectionSortFilter={() => ''}
      />
    );
    const jobLink: HTMLElement = screen.queryByTestId(
      'property-profile-view-jobs'
    );
    const linkTagName = jobLink.tagName;
    const cancelLink = jobLink.getAttribute('href');

    // Check cancel is a link
    expect(linkTagName).toEqual('A');

    // Check link is correct
    expect(cancelLink).toEqual(expectedLink);
  });

  it('does not renders jobs page link for mobile if user is not permitted to access job', () => {
    const property = { ...fullProperty };
    render(
      <Header
        canUserAccessJob={false}
        property={property}
        isMobile
        isYardiConfigured={false}
        activeInspectionSortFilter={() => ''}
      />
    );

    const jobLink: HTMLElement = screen.queryByTestId(
      'property-profile-view-jobs'
    );

    expect(jobLink).toBeNull();
  });
});
