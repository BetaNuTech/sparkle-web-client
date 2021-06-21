import { shallow } from 'enzyme';
import teamMock from '../../../../../../__mocks__/PropertiesPage/teamMock.json';
import propertiesMock from '../../../../../../__mocks__/PropertiesPage/propertiesMock.json';
import { TeamItem } from '../../../../../../features/Properties/MobileLayout/TeamItem';

const teamCalculatedValuesMock = {
  totalNumOfDeficientItems: 1,
  totalNumOfFollowUpActionsForDeficientItems: 2,
  totalNumOfRequiredActionsForDeficientItems: 3
};

describe('TeamItem component', () => {
  describe('rendering', () => {
    let wrapper;

    beforeEach(() => {
      const props = {
        properties: propertiesMock,
        team: teamMock,
        teamCalculatedValues: teamCalculatedValuesMock
      };
      wrapper = shallow(<TeamItem {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
