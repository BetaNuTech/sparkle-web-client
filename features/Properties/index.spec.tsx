import { shallow } from 'enzyme';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import Properties from './index';

const mockStore = configureMockStore([]);
const store = mockStore({});

describe('Unit | Features | Properties', () => {
  it('matches prior snapshot', () => {
    const wrapper = shallow(
      <Provider store={store}>
        <Properties />
      </Provider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
