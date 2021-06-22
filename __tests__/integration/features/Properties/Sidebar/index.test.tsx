import { render as rtlRender, screen } from '@testing-library/react';
import { Context as ResponsiveContext } from 'react-responsive';
import mockTeams from '../../../../../__mocks__/teams';
import PropertiesSidebar from '../../../../../features/Properties/Sidebar';
import breakpoints from '../../../../../config/breakpoints';
import { shuffle } from '../../../../helpers/array';

const defaultPropertyMeta = mockTeams.map(({ id }, i) => ({
  team: id,
  totalNumOfDeficientItems: 1 + i,
  totalNumOfFollowUpActionsForDeficientItems: 2 + i,
  totalNumOfRequiredActionsForDeficientItems: 3 + i
}));

function render(ui: any, options = {}) {
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: breakpoints.desktop.minWidth }}>
      {ui}
    </ResponsiveContext.Provider>,
    options
  );
}

describe('Integration | Features | Properties | Sidebar', () => {
  it('renders all teams', () => {
    const expected = mockTeams.length;
    render(
      <PropertiesSidebar
        teams={mockTeams}
        teamCalculatedValues={defaultPropertyMeta}
      />
    );
    const items: Array<HTMLElement> = screen.queryAllByTestId('team-item');
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
      <PropertiesSidebar
        teams={mockTeams}
        teamCalculatedValues={defaultPropertyMeta}
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
});
