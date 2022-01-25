import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import { fullInspection } from '../../../../../../__mocks__/inspections';
import templateCategories from '../../../../../../__mocks__/templateCategories';
import ListItem from '../../../../../../features/PropertyProfile/Inspection/ListItem';
import breakpoints from '../../../../../../config/breakpoints';
import deepClone from '../../../../../helpers/deepClone';

function render(ui: any, options = {}) {
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: breakpoints.desktop.minWidth }}>
      {ui}
    </ResponsiveContext.Provider>,
    options
  );
}

describe('Integration | Features | Properties | Profile | Inspection | List Item', () => {
  beforeEach(() => {
    // IntersectionObserver isn't available in test environment
    const mockIntersectionObserver = jest.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  it('defaults to Unknown inspector name', () => {
    const expected = 'Unknown';
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.inspectorName = '';
    const forceVisible = true;

    render(
      <ListItem
        propertyId="property-1"
        inspection={inspectionItem}
        templateCategories={templateCategories}
        forceVisible={forceVisible}
      />
    );

    const items: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-creator'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('Adds initial caps to inspector name ', () => {
    const expected = 'Matt Jensen';
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.inspectorName = 'matt jensen';
    const forceVisible = true;

    render(
      <ListItem
        propertyId="property-1"
        inspection={inspectionItem}
        templateCategories={templateCategories}
        forceVisible={forceVisible}
      />
    );

    const items: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-creator'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('defaults to Unknown template name ', () => {
    const expected = 'Unknown';
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.templateName = '';
    const forceVisible = true;

    render(
      <ListItem
        propertyId="property-1"
        inspection={inspectionItem}
        templateCategories={templateCategories}
        forceVisible={forceVisible}
      />
    );

    const items: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-template'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('defaults to Uncategorized template category name ', () => {
    const expected = 'Uncategorized';
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.templateCategory = '';
    const forceVisible = true;

    render(
      <ListItem
        propertyId="property-1"
        inspection={inspectionItem}
        templateCategories={templateCategories}
        forceVisible={forceVisible}
      />
    );

    const items: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-template-category'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('defaults to -- if creation date not valid', () => {
    const expected = '--';
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.creationDate = 0;
    const forceVisible = true;

    render(
      <ListItem
        propertyId="property-1"
        inspection={inspectionItem}
        templateCategories={templateCategories}
        forceVisible={forceVisible}
      />
    );

    const items: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-creation-date'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('defaults to -- if update date not valid', () => {
    const expected = '--';
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.updatedAt = 0;
    const forceVisible = true;

    render(
      <ListItem
        propertyId="property-1"
        inspection={inspectionItem}
        templateCategories={templateCategories}
        forceVisible={forceVisible}
      />
    );

    const items: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-update-date'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('score is colored red if inspection has deficiencies', () => {
    const expected = true;
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.deficienciesExist = true;
    const forceVisible = true;

    render(
      <ListItem
        propertyId="property-1"
        inspection={inspectionItem}
        templateCategories={templateCategories}
        forceVisible={forceVisible}
      />
    );

    const item: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-score'
    );
    const actual = Boolean(item ? item.querySelector('.-c-red') : null);
    expect(actual).toEqual(expected);
  });

  it('score is colored blue if isnpection does not have deficiencies', () => {
    const expected = true;
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.deficienciesExist = false;
    const forceVisible = true;

    render(
      <ListItem
        propertyId="property-1"
        inspection={inspectionItem}
        templateCategories={templateCategories}
        forceVisible={forceVisible}
      />
    );

    const item: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-score'
    );
    const actual = Boolean(item ? item.querySelector('.-c-blue') : null);
    expect(actual).toEqual(expected);
  });

  it('score appears instead of progress if inspection is completed', () => {
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.inspectionCompleted = true;
    const expected = `${Number(inspectionItem.score.toFixed(1))}%`;
    const forceVisible = true;

    render(
      <ListItem
        propertyId="property-1"
        inspection={inspectionItem}
        templateCategories={templateCategories}
        forceVisible={forceVisible}
      />
    );

    const item: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-score'
    );
    const result = item ? item.textContent : '';
    const actual = result.replace(/score:/i, '').trim();
    expect(actual).toEqual(expected);
  });

  it('canvas with donught chart appears if inspection is not completed', () => {
    const inspectionItem = deepClone(fullInspection);
    const expected = '';
    inspectionItem.inspectionCompleted = false;
    const forceVisible = true;

    render(
      <ListItem
        propertyId="property-1"
        inspection={inspectionItem}
        templateCategories={templateCategories}
        forceVisible={forceVisible}
      />
    );

    const item: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-score'
    );
    const actual = item ? item.textContent : '';
    expect(actual).toEqual(expected);
  });
});
