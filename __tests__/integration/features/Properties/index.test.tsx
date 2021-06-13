import { Provider } from 'react-redux';
import {
  render as rtlRender,
  waitFor,
  act,
  screen
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import configureMockStore from 'redux-mock-store';
import { initialTeamsState } from '../../../../app/ducks/teams/reducer';
import { initialPropertiesState } from '../../../../app/ducks/properties/reducer';
import mockTeams from '../../../../__mocks__/PropertiesPage/teamsMock.json';
import mockPropertes from '../../../../__mocks__/PropertiesPage/propertiesMock.json';
import Properties from '../../../../features/Properties';
import { shuffle } from '../../../helpers/array';

const deepClone = (obj) => JSON.parse(JSON.stringify(obj));

// Setup redux store
const mockStore = configureMockStore([]);

function render(ui: void, options = {}) {
  const teamsStore = deepClone(initialTeamsState);
  const propertiesStore = deepClone(initialPropertiesState);
  teamsStore.items = options.teams || mockTeams;
  propertiesStore.items = options.properties || mockPropertes;
  const store = mockStore({
    teams: teamsStore,
    properties: propertiesStore
  });
  return rtlRender(<Provider store={store}>{ui}</Provider>, options);
}

describe('Integration | Features | Properties', () => {
  it('renders all properties', () => {
    const expected = mockPropertes.length;
    const { container } = render(<Properties />);
    const propertyItems: Array<HTMLElement> = Array.from(
      container.querySelectorAll('[data-testid=property-item]')
    );
    const actual = propertyItems.length;
    expect(actual).toEqual(expected);
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
      const { container } = render(<Properties />, {
        properties: shuffle(properties) // randomized properties
      });

      const sortSelect = container.querySelector('#properties-sort-by');
      userEvent.selectOptions(sortSelect, 'city');

      await waitFor(() => {
        const sortByLabel = screen.getByTestId('properties-active-sort-by');
        expect(sortByLabel.textContent).toContain('City');
      });
    });

    const propertyItems: Array<HTMLElement> =
      screen.queryAllByTestId('property-city');
    const actual = propertyItems
      .map((item) => item.textContent.trim().toLowerCase())
      .join(' | ');
    expect(actual).toEqual(expected);
  });
});
