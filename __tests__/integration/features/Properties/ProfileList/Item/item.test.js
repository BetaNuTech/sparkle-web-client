import { shallow } from 'enzyme';
import propertyMock from '../../../../../../__mocks__/PropertiesPage/propertyMock.json';
import { Item } from '../../../../../../features/Properties/ProfileList/Item';

describe('PropertyItem component', () => {
  describe('rendering', () => {
    let wrapper;

    beforeEach(() => {
      const props = {
        property: propertyMock
      };
      wrapper = shallow(<Item {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
