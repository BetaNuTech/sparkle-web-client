import { shallow } from 'enzyme';
import propertyMock from '../../../../../../__mocks__/PropertiesPage/propertyMock.json';
import { PropertyItem } from '../../../../../../features/Properties/MobileLayout/PropertyItem';

describe('PropertyItem component', () => {
  describe('rendering', () => {
    let wrapper;

    beforeEach(() => {
      const props = {
        property: propertyMock
      };
      wrapper = shallow(<PropertyItem {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
