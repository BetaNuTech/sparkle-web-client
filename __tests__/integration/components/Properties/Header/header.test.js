import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { Header } from '../../../../../components/Properties/Header';

const mockStore = configureMockStore([]);

describe('Header component', () => {
  describe('rendering', () => {
    let wrapper;
    const store = mockStore({});

    beforeEach(() => {
      const props = {
        dispatch: jest.fn(),
        activeSort: {
          sortBy: 'name',
          orderBy: 'asc'
        }
      };
      wrapper = shallow(
        <Provider store={store}>
          <Header {...props} />
        </Provider>
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    // it('should render sortBy', () => {
    //   const mockOnSortChange = jest.fn();
    //   wrapper.find('select')[1].simulate('change', 1);
    //   expect(mockOnSortChange.mock.calls.length).toBe(1);
    // });
  });
});
