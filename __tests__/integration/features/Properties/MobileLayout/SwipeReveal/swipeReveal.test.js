import { shallow } from 'enzyme';
import { SwipeReveal } from '../../../../../../features/Properties/MobileLayout/SwipeReveal';

describe('SwipeRevealcomponent', () => {
  describe('rendering', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<SwipeReveal />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
