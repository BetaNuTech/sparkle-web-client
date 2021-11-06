import sinon from 'sinon';
import { FirebaseAppProvider } from 'reactfire';
import { render as rtlRender, screen, act } from '@testing-library/react';
import { ToastContainer } from 'react-toastify';
import userEvent from '@testing-library/user-event';
import { Context as ResponsiveContext } from 'react-responsive';
import firebaseConfig from '../../../../config/firebase';
import mockTeams from '../../../../__mocks__/teams';
import mockPropertes from '../../../../__mocks__/properties';
import { admin as user } from '../../../../__mocks__/users';
import stubIntersectionObserver from '../../../helpers/stubIntersectionObserver';
import Properties from '../../../../features/Properties';
import breakpoints from '../../../../config/breakpoints';
import deepClone from '../../../helpers/deepClone';
import { shuffle } from '../../../helpers/array';

const FORCE_VISIBLE = true;

function render(ui: any, options: any = {}) {
  sinon.restore();

  const contextWidth = options.contextWidth || breakpoints.desktop.minWidth;
  return rtlRender(
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <ResponsiveContext.Provider value={{ width: contextWidth }}>
        {ui}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
        />
      </ResponsiveContext.Provider>
    </FirebaseAppProvider>,
    options
  );
}

describe('Integration | Features | Properties', () => {
  beforeEach(() => stubIntersectionObserver());

  it('renders all mobile teams', () => {
    const expected = mockTeams.length;
    const { container } = render(
      <Properties
        user={user}
        forceVisible={FORCE_VISIBLE}
        properties={mockPropertes}
        propertiesMemo=""
        teams={mockTeams}
        teamsMemo=""
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );
    const teamItems: Array<HTMLElement> = Array.from(
      container.querySelectorAll('[data-testid=team-item]')
    );
    const actual = teamItems.length;
    expect(actual).toEqual(expected);
  });

  it('renders all desktop teams', () => {
    const expected = mockTeams.length;
    const { container } = render(
      <Properties
        user={user}
        forceVisible={FORCE_VISIBLE}
        properties={mockPropertes}
        propertiesMemo=""
        teams={mockTeams}
        teamsMemo=""
      />
    );
    const teamItems: Array<HTMLElement> = Array.from(
      container.querySelectorAll('[data-testid=team-item]')
    );
    const actual = teamItems.length;
    expect(actual).toEqual(expected);
  });

  it('renders all mobile properties', () => {
    const expected = mockPropertes.length;
    const { container } = render(
      <Properties
        user={user}
        forceVisible={FORCE_VISIBLE}
        properties={mockPropertes}
        propertiesMemo=""
        teams={mockTeams}
        teamsMemo=""
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );
    const propertyItems: Array<HTMLElement> = Array.from(
      container.querySelectorAll('[data-testid=property-item]')
    );
    const actual = propertyItems.length;
    expect(actual).toEqual(expected);
  });

  it('renders all desktop properties', () => {
    const expected = mockPropertes.length;
    const { container } = render(
      <Properties
        user={user}
        forceVisible={FORCE_VISIBLE}
        properties={mockPropertes}
        propertiesMemo=""
        teams={mockTeams}
        teamsMemo=""
      />
    );
    const propertyItems: Array<HTMLElement> = Array.from(
      container.querySelectorAll('[data-testid=property-item]')
    );
    const actual = propertyItems.length;
    expect(actual).toEqual(expected);
  });

  it('renders only mobile content for mobile devices', () => {
    render(
      <Properties
        user={user}
        forceVisible={FORCE_VISIBLE}
        properties={mockPropertes}
        propertiesMemo=""
        teams={mockTeams}
        teamsMemo=""
      />,
      {
        contextWidth: breakpoints.tablet.maxWidth
      }
    );
    const header = screen.queryByTestId('properties-header');
    const teamsSidebar = screen.queryByTestId('properties-teams-sidebar');
    const list = screen.queryByTestId('properties-list');
    const mobileHeader = screen.queryByTestId('mobile-properties-header');
    const mobileSortByLabel = screen.queryByTestId('properties-active-sort-by');
    const mobileList = screen.queryByTestId('mobile-properties-list');

    expect(header).toBeNull();
    expect(teamsSidebar).toBeNull();
    expect(list).toBeNull();
    expect(mobileHeader).toBeTruthy();
    expect(mobileSortByLabel).toBeTruthy();
    expect(mobileList).toBeTruthy();
  });

  it('renders only desktop content for desktop devices', () => {
    render(
      <Properties
        user={user}
        forceVisible={FORCE_VISIBLE}
        properties={mockPropertes}
        propertiesMemo=""
        teams={mockTeams}
        teamsMemo=""
      />,
      {
        contextWidth: breakpoints.desktop.minWidth
      }
    );
    const header = screen.queryByTestId('properties-header');
    const teamsSidebar = screen.queryByTestId('properties-teams-sidebar');
    const list = screen.queryByTestId('properties-list');
    const mobileHeader = screen.queryByTestId('mobile-properties-header');
    const mobileSortByLabel = screen.queryByTestId('properties-active-sort-by');
    const mobileList = screen.queryByTestId('mobile-properties-list');

    expect(header).toBeTruthy();
    expect(teamsSidebar).toBeTruthy();
    expect(list).toBeTruthy();
    expect(mobileHeader).toBeNull();
    expect(mobileSortByLabel).toBeNull();
    expect(mobileList).toBeNull();
  });

  it('do not show city if not set on property', () => {
    const properties = deepClone(mockPropertes);
    properties[0].city = '';
    render(
      <Properties
        user={user}
        forceVisible={FORCE_VISIBLE}
        properties={properties}
        propertiesMemo=""
        teams={mockTeams}
        teamsMemo=""
      />,
      {
        contextWidth: breakpoints.desktop.minWidth,
        properties
      }
    );
    const propertyList = screen.queryAllByTestId('property-item');
    const city = propertyList[0].querySelector('[data-testid=property-city]');

    expect(city).toBeNull();
  });

  it('does not show state if not set on property', () => {
    const properties = deepClone(mockPropertes);
    properties[0].state = '';
    render(
      <Properties
        user={user}
        forceVisible={FORCE_VISIBLE}
        properties={properties}
        propertiesMemo=""
        teams={mockTeams}
        teamsMemo=""
      />,
      {
        contextWidth: breakpoints.desktop.minWidth,
        properties
      }
    );
    const propertyList = screen.queryAllByTestId('property-item');
    const state = propertyList[0].querySelector('[data-testid=property-state]');

    expect(state).toBeNull();
  });

  it('automatically sorts by descending last inspection date for mobile users', async () => {
    const times = [1625244317, 1625244316, 1625244315, 1625244314, 1625244313];
    const expected = times.map((c) => `${c}`).join(' | ');
    const properties = deepClone(mockPropertes);
    shuffle(times).forEach((time, i) => {
      if (properties[i]) {
        properties[i].lastInspectionDate = time;
      }
    });

    await act(async () => {
      render(
        <Properties
          user={user}
          forceVisible={FORCE_VISIBLE}
          properties={properties}
          propertiesMemo=""
          teams={mockTeams}
          teamsMemo=""
        />,
        {
          properties: shuffle(properties), // randomized properties
          contextWidth: breakpoints.tablet.maxWidth // set to mobile UI
        }
      );

      // Click to score ftiler
      const sortbutton = screen.queryByTestId('mobile-properties-sort-by');
      await userEvent.click(sortbutton);
      await userEvent.click(sortbutton);
      await userEvent.click(sortbutton);
    });

    const propertyItems: Array<HTMLElement> = screen.queryAllByTestId(
      'property-last-inspection-date'
    );
    const actual = propertyItems
      .map((item) => item.textContent.trim().toLowerCase())
      .join(' | ');
    expect(actual).toEqual(expected);
  });

  it('automatically sorts by descending last inspection score for mobile users', async () => {
    const scores = [100, 80, 40, 20, 1];
    const expected = scores.map((c) => `${c}`).join(' | ');
    const properties = deepClone(mockPropertes);
    shuffle(scores).forEach((score, i) => {
      if (properties[i]) {
        properties[i].lastInspectionScore = score;
      }
    });

    await act(async () => {
      render(
        <Properties
          user={user}
          forceVisible={FORCE_VISIBLE}
          properties={properties}
          propertiesMemo=""
          teams={mockTeams}
          teamsMemo=""
        />,
        {
          properties: shuffle(properties), // randomized properties
          contextWidth: breakpoints.tablet.maxWidth // set to mobile UI
        }
      );

      // Click to score ftiler
      const sortbutton = screen.queryByTestId('mobile-properties-sort-by');
      await userEvent.click(sortbutton);
      await userEvent.click(sortbutton);
      await userEvent.click(sortbutton);
      await userEvent.click(sortbutton);
    });

    const propertyItems: Array<HTMLElement> =
      screen.queryAllByTestId('property-score');
    const actual = propertyItems
      .map((item) => item.textContent.trim().toLowerCase())
      .join(' | ');
    expect(actual).toEqual(expected);
  });
});
