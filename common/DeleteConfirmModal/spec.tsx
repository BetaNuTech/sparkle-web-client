import { shallow } from 'enzyme';
import DeleteConfirmModal from './index';

describe('DeleteConfirmModal component', () => {
  describe('rendering', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<DeleteConfirmModal />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
