import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { Properties } from '../../../../features/Properties';

const mockStore = configureMockStore([]);

describe('Properties component', () => {
  describe('rendering', () => {
    let wrapper;
    const store = mockStore({});

    beforeEach(() => {
      wrapper = shallow(
        <Provider store={store}>
          <Properties />
        </Provider>
      );
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
