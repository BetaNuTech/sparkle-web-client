import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { FolderSortButton } from '../../../../../components/Properties/FolderSortButton';

const mockStore = configureMockStore([]);

describe('FolderSortButton component', () => {
  describe('rendering', () => {
    let wrapper;
    const store = mockStore({});

    beforeEach(() => {
      wrapper = shallow(
        <Provider store={store}>
          <FolderSortButton />
        </Provider>
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
