import sinon from 'sinon';
import { render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Context as ResponsiveContext } from 'react-responsive';
import mockTeams from '../../../../../__mocks__/teams';
import mockPropertes from '../../../../../__mocks__/properties';
import PropertiesMobileLayout from '../../../../../features/Properties/MobileLayout';
import breakpoints from '../../../../../config/breakpoints';
import stubIntersectionObserver from '../../../../helpers/stubIntersectionObserver';
import { shuffle } from '../../../../helpers/array';
import deepClone from '../../../../helpers/deepClone';

const defaultPropertyMeta = mockTeams.map(({ id }, i) => ({
  team: id,
  totalNumOfDeficientItems: 1 + i,
  totalNumOfFollowUpActionsForDeficientItems: 2 + i,
  totalNumOfRequiredActionsForDeficientItems: 3 + i
}));

function render(ui: any, options = {}) {
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: breakpoints.mobile.maxWidth }}>
      {ui}
    </ResponsiveContext.Provider>,
    options
  );
}

const FORCE_VISIBLE = true;

describe('Integration | Features | Properties | Mobile Layout', () => {
  beforeEach(() => stubIntersectionObserver());
  it('renders all teams', () => {
    const expected = mockTeams.length;
    render(
      <PropertiesMobileLayout
        properties={mockPropertes}
        teams={mockTeams}
        teamCalculatedValues={defaultPropertyMeta}
        activePropertiesSortFilter={() => ''}
        forceVisible={FORCE_VISIBLE}
      />
    );
    const items: Array<HTMLElement> = screen.queryAllByTestId('team-item');
    const actual = items.length;

    expect(actual).toEqual(expected);
  });

  it('renders all properties', () => {
    const expected = mockPropertes.length;
    render(
      <PropertiesMobileLayout
        properties={mockPropertes}
        teams={mockTeams}
        teamCalculatedValues={defaultPropertyMeta}
        activePropertiesSortFilter={() => ''}
        forceVisible={FORCE_VISIBLE}
      />
    );
    const items: Array<HTMLElement> = screen.queryAllByTestId('property-item');
    const actual = items.length;

    expect(actual).toEqual(expected);
  });

  it('renders a teams associated property meta data', () => {
    const teamId = shuffle([...mockTeams])[0].id;
    const [teamsPropMetaData] = defaultPropertyMeta.filter(
      ({ team }) => team === teamId
    );
    const expected = `${teamsPropMetaData.totalNumOfDeficientItems} | ${teamsPropMetaData.totalNumOfRequiredActionsForDeficientItems} | ${teamsPropMetaData.totalNumOfFollowUpActionsForDeficientItems}`; // eslint-disable-line
    const { container } = render(
      <PropertiesMobileLayout
        properties={mockPropertes}
        teams={mockTeams}
        teamCalculatedValues={defaultPropertyMeta}
        activePropertiesSortFilter={() => ''}
        forceVisible={FORCE_VISIBLE}
      />
    );

    const teamRow = container.querySelector(`[data-team="${teamId}"]`);
    expect(teamRow).toBeTruthy();
    const numberOfDeficientItems = teamRow.querySelector(
      '[data-testid=num-of-deficient-items]'
    ).textContent;
    const numberOfRequired = teamRow.querySelector(
      '[data-testid=num-of-required-actions]'
    ).textContent;
    const numberOfFollowUps = teamRow.querySelector(
      '[data-testid=num-of-follow-up-actions]'
    ).textContent;
    const actual = `${numberOfDeficientItems} | ${numberOfRequired} | ${numberOfFollowUps}`;

    expect(actual).toEqual(expected);
  });

  it('does not show address line 1 if not set on property', () => {
    const properties = deepClone(mockPropertes);
    properties[0].addr1 = '';
    const { container } = render(
      <PropertiesMobileLayout
        properties={properties}
        teams={mockTeams}
        teamCalculatedValues={defaultPropertyMeta}
        isDeletePropertyPromptVisible={false}
        activePropertiesSortFilter={() => ''}
        forceVisible={FORCE_VISIBLE}
      />
    );
    const propertyList = container.querySelectorAll(
      '[data-testid=property-item]'
    );
    const actual = propertyList[0].querySelector(
      '[data-testid=property-addr1]'
    );
    expect(actual).toBeNull();
  });

  it('does not show city if not set on property', () => {
    const properties = deepClone(mockPropertes);
    properties[0].city = '';
    const { container } = render(
      <PropertiesMobileLayout
        properties={properties}
        teams={mockTeams}
        teamCalculatedValues={defaultPropertyMeta}
        isDeletePropertyPromptVisible={false}
        activePropertiesSortFilter={() => ''}
        forceVisible={FORCE_VISIBLE}
      />
    );
    const propertyList = container.querySelectorAll(
      '[data-testid=property-item]'
    );
    const actual = propertyList[0].querySelector('[data-testid=property-city]');
    expect(actual).toBeNull();
  });

  it('does not show state if not set on property', () => {
    const properties = deepClone(mockPropertes);
    properties[0].state = '';
    const { container } = render(
      <PropertiesMobileLayout
        properties={properties}
        teams={mockTeams}
        teamCalculatedValues={defaultPropertyMeta}
        isDeletePropertyPromptVisible={false}
        activePropertiesSortFilter={() => ''}
        forceVisible={FORCE_VISIBLE}
      />
    );
    const propertyList = container.querySelectorAll(
      '[data-testid=property-item]'
    );
    const actual = propertyList[0].querySelector(
      '[data-testid=property-state]'
    );
    expect(actual).toBeNull();
  });

  it('does not show zip if not set on property', () => {
    const properties = deepClone(mockPropertes);
    properties[0].zip = '';
    const { container } = render(
      <PropertiesMobileLayout
        properties={properties}
        teams={mockTeams}
        teamCalculatedValues={defaultPropertyMeta}
        isDeletePropertyPromptVisible={false}
        activePropertiesSortFilter={() => ''}
        forceVisible={FORCE_VISIBLE}
      />
    );
    const propertyList = container.querySelectorAll(
      '[data-testid=property-item]'
    );
    const actual = propertyList[0].querySelector('[data-testid=property-zip]');
    expect(actual).toBeNull();
  });

  it('does not show last inspection entry if property has no inspections', () => {
    const properties = deepClone(mockPropertes);
    properties[0].numOfInspections = 0;
    const { container } = render(
      <PropertiesMobileLayout
        properties={properties}
        teams={mockTeams}
        teamCalculatedValues={defaultPropertyMeta}
        isDeletePropertyPromptVisible={false}
        activePropertiesSortFilter={() => ''}
        forceVisible={FORCE_VISIBLE}
      />
    );
    const propertyList = container.querySelectorAll(
      '[data-testid=property-item]'
    );
    const actual = propertyList[0].querySelector(
      '[data-testid=property-last-inspection-entry]'
    );
    expect(actual).toBeNull();
  });

  it('sort function should be called from mobile header', () => {
    const onClickSpy = sinon.spy();
    render(
      <PropertiesMobileLayout
        properties={mockPropertes}
        teams={mockTeams}
        teamCalculatedValues={defaultPropertyMeta}
        isDeletePropertyPromptVisible={false}
        activePropertiesSortFilter={() => ''}
        nextPropertiesSort={onClickSpy}
        forceVisible={FORCE_VISIBLE}
      />
    );
    const button = screen.queryByTestId('mobile-properties-sort-by');
    if (button) userEvent.click(button);

    const actual = onClickSpy.called;
    expect(actual).toEqual(true);
  });

  it('should only show create button when mobile user has permission to create a team or a property', () => {
    const expected = true;
    const props = {
      canAddTeam: false,
      canAddProperty: true,
      properties: mockPropertes,
      teams: mockTeams,
      teamCalculatedValues: defaultPropertyMeta,
      isDeletePropertyPromptVisible: false,
      activePropertiesSortFilter: () => '',
      forceVisible: FORCE_VISIBLE
    };
    render(<PropertiesMobileLayout {...props} />);

    const actual = Boolean(screen.queryByTestId('property-list-create'));
    expect(actual).toEqual(expected);
  });

  it('should not show create button when mobile user has no permission to create a team and property', () => {
    const expected = false;
    const props = {
      canAddTeam: false,
      canAddProperty: false,
      properties: mockPropertes,
      teams: mockTeams,
      teamCalculatedValues: defaultPropertyMeta,
      isDeletePropertyPromptVisible: false,
      activePropertiesSortFilter: () => '',
      forceVisible: FORCE_VISIBLE
    };
    render(<PropertiesMobileLayout {...props} />);

    const actual = Boolean(screen.queryByTestId('property-list-create'));
    expect(actual).toEqual(expected);
  });
});
