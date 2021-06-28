import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { fullProperty } from '../../../../../__mocks__/properties';
import inspectionsMock from '../../../../../__mocks__/inspections';
import Overview from '../../../../../features/PropertyProfile/Overview';
import breakpoints from '../../../../../config/breakpoints';

function render(ui: any, options = {}) {
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: breakpoints.desktop.minWidth }}>
      {ui}
    </ResponsiveContext.Provider>,
    options
  );
}

describe('Integration | Features | Properties | Profile | Overview', () => {
  it('renders property profile overview for desktop', () => {
    const expected = 1;
    render(
      <Overview
        property={fullProperty}
        inspections={inspectionsMock}
        isYardiConfigured={false}
      />
    );
    const items: Array<HTMLElement> = screen.queryAllByTestId(
      'property-profile-overview'
    );
    const actual = items.length;
    expect(actual).toEqual(expected);
  });

  it('plural lables when property has plural meta data', () => {
    const property = { ...fullProperty };
    property.numOfDeficientItems = 5;
    property.numOfRequiredActionsForDeficientItems = 5;
    property.numOfFollowUpActionsForDeficientItems = 5;
    property.numOfOverdueDeficientItems = 0;

    render(
      <Overview
        property={property}
        inspections={inspectionsMock}
        isYardiConfigured={false}
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

    expect(deficientItem.textContent).toEqual('5Deficient Items');
    expect(deficientItemAction.textContent).toEqual('5Actions Required');
    expect(deficientItemFollowup.textContent).toEqual('5Follow Ups');
  });

  it('plural lables when property has plural meta data with overdue text', () => {
    const property = { ...fullProperty };
    property.numOfDeficientItems = 5;
    property.numOfRequiredActionsForDeficientItems = 5;
    property.numOfFollowUpActionsForDeficientItems = 5;
    property.numOfOverdueDeficientItems = 2;

    render(
      <Overview
        property={property}
        inspections={inspectionsMock}
        isYardiConfigured={false}
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

    expect(deficientItem.textContent).toEqual('5Deficient Items');
    expect(deficientItemAction.textContent).toEqual(
      '5Actions Required2 Overdue'
    );
    expect(deficientItemFollowup.textContent).toEqual('5Follow Ups');
  });

  it('singular lables when property has singular meta data', () => {
    const property = { ...fullProperty };
    property.numOfDeficientItems = 0;
    property.numOfRequiredActionsForDeficientItems = 0;
    property.numOfFollowUpActionsForDeficientItems = 0;
    property.numOfOverdueDeficientItems = 0;

    render(
      <Overview
        property={property}
        inspections={inspectionsMock}
        isYardiConfigured={false}
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

    expect(deficientItem.textContent).toEqual('0Deficient Item');
    expect(deficientItemAction.textContent).toEqual('0Action Required');
    expect(deficientItemFollowup.textContent).toEqual('0Follow Up');
  });

  it('renders yardi buttons if yardi is configured', () => {
    const expected = 1;
    render(
      <Overview
        property={fullProperty}
        inspections={inspectionsMock}
        isYardiConfigured
      />
    );
    const items: Array<HTMLElement> = screen.queryAllByTestId(
      'property-profile-yardi-button'
    );
    const actual = items.length;
    expect(actual).toEqual(expected);
  });

  it('renders logo url of property profile overview', () => {
    const property = { ...fullProperty };
    const expected = property.logoURL;
    render(
      <Overview
        property={property}
        inspections={inspectionsMock}
        isYardiConfigured={false}
      />
    );
    const items: HTMLElement = screen.queryByTestId(
      'property-profile-overview-logo'
    );
    const heading: Array<HTMLElement> = screen.queryAllByTestId(
      'property-profile-overview-heading'
    );
    const actual = items.getAttribute('src');
    // Check if url is same
    expect(actual).toEqual(expected);

    // Check if title was not rendered
    expect(heading.length).toEqual(0);
  });

  it('renders banner url of property profile overview', () => {
    const property = { ...fullProperty };
    const expected = property.bannerPhotoURL;
    property.logoURL = '';
    render(
      <Overview
        property={property}
        inspections={inspectionsMock}
        isYardiConfigured={false}
      />
    );
    const items: HTMLElement = screen.queryByTestId(
      'property-profile-overview-logo'
    );
    const heading: Array<HTMLElement> = screen.queryAllByTestId(
      'property-profile-overview-heading'
    );
    const actual = items.getAttribute('src');
    // Check if url is same
    expect(actual).toEqual(expected);

    // Check if title was not rendered
    expect(heading.length).toEqual(0);
  });

  it('renders title of property profile overview if logo or banner url not present', () => {
    const property = { ...fullProperty };
    const expected = 0;
    property.bannerPhotoURL = '';
    property.logoURL = '';
    render(
      <Overview
        property={property}
        inspections={inspectionsMock}
        isYardiConfigured={false}
      />
    );
    const items: Array<HTMLElement> = screen.queryAllByTestId(
      'property-profile-overview-logo'
    );
    const heading: HTMLElement = screen.queryByTestId(
      'property-profile-overview-heading'
    );
    const actual = items.length;
    // Check if image was not rendered
    expect(actual).toEqual(expected);

    // Check if title was rendered
    expect(heading).toBeTruthy();

    // Check if text matches the name of property
    expect(heading.textContent).toEqual(property.name);
  });
});
