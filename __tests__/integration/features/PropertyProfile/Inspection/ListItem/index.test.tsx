import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import moment from 'moment';
import { fullInspection } from '../../../../../../__mocks__/inspections';
import templateCategories from '../../../../../../__mocks__/templateCategories';
import ListItem from '../../../../../../features/PropertyProfile/Inspection/ListItem';
import breakpoints from '../../../../../../config/breakpoints';
import formats from '../../../../../../config/formats';

function render(ui: any, options = {}) {
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: breakpoints.desktop.minWidth }}>
      {ui}
    </ResponsiveContext.Provider>,
    options
  );
}

describe('Integration | Features | Properties | Profile | Inspection | List Item', () => {
  it('renders property profile inspection list item', () => {
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

  it('renders property profile inspection list item with Unknown inspector name', () => {
    const expected = 'Unknown';
    const inspectionItem = { ...fullInspection };
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

  it('renders property profile inspection list item with initial caps inspector name ', () => {
    const expected = 'Matt Jensen';
    const inspectionItem = { ...fullInspection };
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

  it('renders property profile inspection list item with Unknown template name ', () => {
    const expected = 'Unknown';
    const inspectionItem = { ...fullInspection };
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

  it('renders property profile inspection list item with Uncategorized template category name ', () => {
    const expected = 'Uncategorized';
    const inspectionItem = { ...fullInspection };
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

  it('renders property profile inspection list item with current date time if creation date not valid', () => {
    const expected = moment().format(formats.userDateDisplayFormat);
    const expectedLength = expected.length;
    const inspectionItem = { ...fullInspection };
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

  it('renders property profile inspection list item with current date time if update date not valid', () => {
    const expected = moment().format(formats.userDateDisplayFormat);
    const expectedLength = expected.length;
    const inspectionItem = { ...fullInspection };
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

  it('renders property profile inspection list item with red color if deficiencies exists', () => {
    const expected = '-c-red';
    const inspectionItem = { ...fullInspection };
    inspectionItem.deficienciesExist = true;

    render(
      <ListItem
        inspection={inspectionItem}
        templateCategories={templateCategories}
      />
    );

    const items: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-score'
    );
    const actual = items.className;
    expect(actual).toEqual(expected);
  });

  it('renders property profile inspection list item with blue color if deficiencies exists', () => {
    const expected = '-c-blue';
    const inspectionItem = { ...fullInspection };
    inspectionItem.deficienciesExist = false;

    render(
      <ListItem
        inspection={inspectionItem}
        templateCategories={templateCategories}
      />
    );

    const items: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-score'
    );
    const actual = items.className;
    expect(actual).toEqual(expected);
  });

  it('renders property profile inspection list item with score if inspection is completed', () => {
    const inspectionItem = { ...fullInspection };
    const expected = `${Number(inspectionItem.score.toFixed(1))}%`;
    inspectionItem.inspectionCompleted = true;

    render(
      <ListItem
        inspection={inspectionItem}
        templateCategories={templateCategories}
      />
    );

    const items: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-score'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('renders property profile inspection list item with score percentage if inspection is not completed', () => {
    const inspectionItem = { ...fullInspection };
    const expected = `${Number(
      (
        (inspectionItem.itemsCompleted / inspectionItem.totalItems) *
        100
      ).toFixed(2)
    )}%`;
    inspectionItem.inspectionCompleted = false;

    render(
      <ListItem
        inspection={inspectionItem}
        templateCategories={templateCategories}
      />
    );

    const items: HTMLElement = screen.queryByTestId(
      'property-profile-inspection-list-item-score'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });
});
