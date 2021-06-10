import Link from 'next/link';
import { shallow } from 'enzyme';
import { Dropdown } from '../../../../../common/Dropdown';

describe('Dropdown component', () => {
  describe('rendering', () => {
    let wrapper;

    beforeEach(() => {
      // eslint-disable-next-line react/jsx-filename-extension
      wrapper = shallow(<Dropdown />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should has two <Links /> inside', () => {
      expect(wrapper.find(Link)).toHaveLength(2);
    });
  });
});
