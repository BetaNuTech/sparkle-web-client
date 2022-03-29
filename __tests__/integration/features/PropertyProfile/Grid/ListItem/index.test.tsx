import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import moment from 'moment';
import { admin, teamMember } from '../../../../../../__mocks__/users';
import templateCategories from '../../../../../../__mocks__/templateCategories';
import { fullInspection } from '../../../../../../__mocks__/inspections';
import stubIntersectionObserver from '../../../../../helpers/stubIntersectionObserver';
import ListItem from '../../../../../../features/PropertyProfile/Grid/ListItem';
import breakpoints from '../../../../../../config/breakpoints';
import deepClone from '../../../../../helpers/deepClone';
import formats from '../../../../../../config/formats';

function render(ui: any, options = {}) {
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: breakpoints.desktop.minWidth }}>
      {ui}
    </ResponsiveContext.Provider>,
    options
  );
}

describe('Integration | Features | Properties | Profile | Inspection | Grid | List Item', () => {
  beforeEach(() => stubIntersectionObserver());

  it('should render 6 column for user without having inspection rights', () => {
    const expected = 6;

    const props = {
      user: teamMember,
      inspection: deepClone(fullInspection),
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const header: HTMLElement = screen.queryByTestId(
      'inspection-grid-listitem'
    );
    const actual = header.children.length;
    expect(actual).toEqual(expected);
  });

  it('should render 7 column for user without having inspection rights', () => {
    const expected = 7;

    const props = {
      user: admin,
      inspection: deepClone(fullInspection),
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const header: HTMLElement = screen.queryByTestId(
      'inspection-grid-listitem'
    );
    const actual = header.children.length;
    expect(actual).toEqual(expected);
  });

  it('Adds initial caps to inspector name ', () => {
    const expected = 'Matt Jensen';
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.inspectorName = 'matt jensen';

    const props = {
      user: admin,
      inspection: inspectionItem,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const items: HTMLElement = screen.queryByTestId(
      'inspection-grid-list-item-creator'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('defaults to -- if creation name not valid', () => {
    const expected = '--';
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.inspectorName = '';

    const props = {
      user: admin,
      inspection: inspectionItem,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const items: HTMLElement = screen.queryByTestId(
      'inspection-grid-list-item-creator'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('defaults to -- if creation date not valid', () => {
    const expected = '--';
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.creationDate = 0;

    const props = {
      user: admin,
      inspection: inspectionItem,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const items: HTMLElement = screen.queryByTestId(
      'inspection-grid-list-item-creation-date'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('defaults to -- if update date not valid', () => {
    const expected = '--';
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.updatedAt = 0;

    const props = {
      user: admin,
      inspection: inspectionItem,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const items: HTMLElement = screen.queryByTestId(
      'inspection-grid-list-item-update-date'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('should render double dash if template name not present', () => {
    const expected = '--';
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.templateName = '';

    const props = {
      user: admin,
      inspection: inspectionItem,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const items: HTMLElement = screen.queryByTestId(
      'inspection-grid-list-item-template'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('should render Uncategorized if template name not present ', () => {
    const expected = 'Uncategorized';
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.templateCategory = '';

    const props = {
      user: admin,
      inspection: inspectionItem,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const items: HTMLElement = screen.queryByTestId(
      'inspection-grid-list-item-template-cat'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('score is colored red if inspection has existing deficiencies', () => {
    const expected = '-c-red';
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.deficienciesExist = true;

    const props = {
      user: admin,
      inspection: inspectionItem,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const items: HTMLElement = screen.queryByTestId(
      'inspection-grid-list-item-score'
    );
    const actual = items.className;
    expect(actual).toEqual(expected);
  });

  it('score is colored blue if isnpection does not have deficiencies', () => {
    const expected = '-c-blue';
    const inspectionItem = deepClone(fullInspection);
    inspectionItem.deficienciesExist = false;

    const props = {
      user: admin,
      inspection: inspectionItem,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const items: HTMLElement = screen.queryByTestId(
      'inspection-grid-list-item-score'
    );
    const actual = items.className;
    expect(actual).toEqual(expected);
  });

  it('score appears instead of progress if inspection is completed', () => {
    const inspectionItem = deepClone(fullInspection);
    const expected = `${Number(inspectionItem.score.toFixed(1))}%`;
    inspectionItem.inspectionCompleted = true;

    const props = {
      user: admin,
      inspection: inspectionItem,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const items: HTMLElement = screen.queryByTestId(
      'inspection-grid-list-item-score'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('canvas with donught chart appears if inspection is not completed', () => {
    const inspectionItem = deepClone(fullInspection);
    const expected = '';
    inspectionItem.inspectionCompleted = false;

    const props = {
      user: admin,
      inspection: inspectionItem,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const items: HTMLElement = screen.queryByTestId(
      'inspection-grid-list-item-score'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('should show creation date as per the system date time', () => {
    const inspectionItem = deepClone(fullInspection);
    const formattedDate = moment
      .unix(fullInspection.creationDate)
      .format(formats.userDateDisplay);
    const formattedTime = moment
      .unix(fullInspection.creationDate)
      .format(formats.userTimeDisplay);
    const expected = `${formattedDate}${formattedTime}`;

    const props = {
      user: admin,
      inspection: inspectionItem,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const items: HTMLElement = screen.queryByTestId(
      'inspection-grid-list-item-creation-date'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('should show update date as per the system date time', () => {
    const inspectionItem = deepClone(fullInspection);
    const formattedDate = moment
      .unix(fullInspection.updatedAt)
      .format(formats.userDateDisplay);
    const formattedTime = moment
      .unix(fullInspection.updatedAt)
      .format(formats.userTimeDisplay);
    const expected = `${formattedDate}${formattedTime}`;

    const props = {
      user: admin,
      inspection: inspectionItem,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const items: HTMLElement = screen.queryByTestId(
      'inspection-grid-list-item-update-date'
    );
    const actual = items.textContent;
    expect(actual).toEqual(expected);
  });

  it('should show dropdown actions if user has permission', () => {
    const expected = 1;

    const props = {
      user: admin,
      inspection: fullInspection,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const items: Array<HTMLElement> = screen.queryAllByTestId(
      'inspection-grid-list-item-actions'
    );
    const actual = items.length;
    expect(actual).toEqual(expected);
  });

  it('should not show dropdown actions if user has permission', () => {
    const expected = 0;

    const props = {
      user: teamMember,
      inspection: fullInspection,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const items: Array<HTMLElement> = screen.queryAllByTestId(
      'inspection-grid-list-item-actions'
    );
    const actual = items.length;
    expect(actual).toEqual(expected);
  });

  it('should show dropdown with button and link if user has permission', () => {
    const expected = 2;

    const props = {
      user: admin,
      inspection: fullInspection,
      templateCategories,
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      openInspectionDeletePrompt: () => {},
      propertyId: 'property-1',
      forceVisible: true
    };

    render(<ListItem {...props} />);

    const items: HTMLElement = screen.queryByTestId(
      'inspection-grid-list-item-actions'
    );

    const buttons = items.querySelectorAll('button');
    expect(buttons.length).toEqual(expected);
  });
});
