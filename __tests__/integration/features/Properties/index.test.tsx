import sinon from 'sinon';
import { Provider } from 'react-redux';
import { render as rtlRender, act, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';
import { Context as ResponsiveContext } from 'react-responsive';
import { initialPropertiesState } from '../../../../app/ducks/properties/reducer';
import mockTeams from '../../../../__mocks__/PropertiesPage/teamsMock.json';
import mockPropertes from '../../../../__mocks__/PropertiesPage/propertiesMock.json';
import { admin as user } from '../../../../__mocks__/users';
import teamsApi, {
  teamsCollectionResult
} from '../../../../common/services/firestore/teams';
import Properties from '../../../../features/Properties';
import breakpoints from '../../../../config/breakpoints';
import { shuffle } from '../../../helpers/array';

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Setup redux store
const mockStore = configureMockStore([]);

function render(ui: any, options: any = {}) {
  sinon.restore();
  const propertiesStore = deepClone(initialPropertiesState);
  propertiesStore.items = options.properties || mockPropertes;
  const store = mockStore({
    properties: propertiesStore
  });

  // Stub all teams requests
  const teamsPayload: teamsCollectionResult = {
    status: options.teamsStatus || 'success',
    error: options.teamsError || null,
    data: options.teams || mockTeams
  };
  sinon.stub(teamsApi, 'findAll').returns(teamsPayload);
  // TODO add other requests

  const contextWidth = options.contextWidth || breakpoints.desktop.minWidth;
  return rtlRender(
    <ResponsiveContext.Provider value={{ width: contextWidth }}>
      <Provider store={store}>{ui}</Provider>
    </ResponsiveContext.Provider>,
    options
  );
}

describe('Integration | Features | Properties', () => {
  it('renders all mobile teams', () => {
    const expected = mockTeams.length;
    const { container } = render(<Properties user={user} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });
    const teamItems: Array<HTMLElement> = Array.from(
      container.querySelectorAll('[data-testid=team-item]')
    );
    const actual = teamItems.length;
    expect(actual).toEqual(expected);
  });

  it('renders all desktop teams', () => {
    const expected = mockTeams.length;
    const { container } = render(<Properties user={user} />);
    const teamItems: Array<HTMLElement> = Array.from(
      container.querySelectorAll('[data-testid=team-item]')
    );
    const actual = teamItems.length;
    expect(actual).toEqual(expected);
  });

  it('renders all mobile properties', () => {
    const expected = mockPropertes.length;
    const { container } = render(<Properties user={user} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });
    const propertyItems: Array<HTMLElement> = Array.from(
      container.querySelectorAll('[data-testid=property-item]')
    );
    const actual = propertyItems.length;
    expect(actual).toEqual(expected);
  });

  it('renders all desktop properties', () => {
    const expected = mockPropertes.length;
    const { container } = render(<Properties user={user} />);
    const propertyItems: Array<HTMLElement> = Array.from(
      container.querySelectorAll('[data-testid=property-item]')
    );
    const actual = propertyItems.length;
    expect(actual).toEqual(expected);
  });

  it('renders only mobile content for mobile devices', () => {
    render(<Properties user={user} />, {
      contextWidth: breakpoints.tablet.maxWidth
    });
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
    render(<Properties user={user} />, {
      contextWidth: breakpoints.desktop.minWidth
    });
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

  it('sorts properties by city', async () => {
    const cities = ['Acapuco', 'Bermuda', 'Cape Cod', 'Washington', 'Zanzibar'];
    const expected = cities.map((c) => c.toLowerCase()).join(' | ');
    const properties = deepClone(mockPropertes);
    cities.forEach((city, i) => {
      if (properties[i]) {
        properties[i].city = city;
      }
    });

    await act(async () => {
      const { container } = render(<Properties user={user} />, {
        properties: shuffle(properties) // randomized properties
      });

      const sortSelect = container.querySelector('#properties-sort-by');
      userEvent.selectOptions(sortSelect, 'city');
    });

    const propertyItems: Array<HTMLElement> =
      screen.queryAllByTestId('property-city');
    const actual = propertyItems
      .map((item) => item.textContent.trim().toLowerCase())
      .join(' | ');
    expect(actual).toEqual(expected);
  });
});
