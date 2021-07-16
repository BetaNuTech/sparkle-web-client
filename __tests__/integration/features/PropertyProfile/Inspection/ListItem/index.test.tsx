import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import moment from 'moment';
import { fullInspection } from '../../../../../../__mocks__/inspections';
import templateCategories from '../../../../../../__mocks__/templateCategories';
import ListItem from '../../../../../../features/PropertyProfile/Inspection/ListItem';
import breakpoints from '../../../../../../config/breakpoints';
import formats from '../../../../../../config/formats';
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
  it('renders', () => {
    const expected = 1;
    render(
      <ListItem
        inspection={fullInspection}
        templateCategories={templateCategories}
      />
    );
    const items: Array<HTMLElement> = screen.queryAllByTestId(
      'property-profile-inspection-list-item'
    );
    const actual = items.length;
    expect(actual).toEqual(expected);
  });

  it('defaults to Unknown inspector name', () => {
    const expected = 'Unknown';
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.inspectorName = '';

    render(
      <ListItem
        inspection={inspectionItem}
        templateCategories={templateCategories}
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

    render(
      <ListItem
        inspection={inspectionItem}
        templateCategories={templateCategories}
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

    render(
      <ListItem
        inspection={inspectionItem}
        templateCategories={templateCategories}
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

    render(
      <ListItem
        inspection={inspectionItem}
        templateCategories={templateCategories}
      />
    );

    const items: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-template-category'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('defaults to current date time if creation date not valid', () => {
    const expected = moment().format(formats.userDateTimeDisplay);
    const expectedLength = expected.length;
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.creationDate = 0;

    render(
      <ListItem
        inspection={inspectionItem}
        templateCategories={templateCategories}
      />
    );

    const items: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-creation-date'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
    expect(actual.length).toEqual(expectedLength);
  });

  it('defaults to current date time if update date not valid', () => {
    const expected = moment().format(formats.userDateTimeDisplay);
    const expectedLength = expected.length;
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.updatedAt = 0;

    render(
      <ListItem
        inspection={inspectionItem}
        templateCategories={templateCategories}
      />
    );

    const items: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-update-date'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
    expect(actual.length).toEqual(expectedLength);
  });

  it('score is colored red if inspection has deficiencies', () => {
    const expected = true;
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.deficienciesExist = true;

    render(
      <ListItem
        inspection={inspectionItem}
        templateCategories={templateCategories}
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

    render(
      <ListItem
        inspection={inspectionItem}
        templateCategories={templateCategories}
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
    const expected = `${Number(inspectionItem.score.toFixed(1))}%`;
    inspectionItem.inspectionCompleted = true;

    render(
      <ListItem
        inspection={inspectionItem}
        templateCategories={templateCategories}
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

    render(
      <ListItem
        inspection={inspectionItem}
        templateCategories={templateCategories}
      />
    );

    const item: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-score'
    );
    const actual = item ? item.textContent : '';
    expect(actual).toEqual(expected);
  });
});
