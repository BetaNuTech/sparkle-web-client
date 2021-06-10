import { shallow } from 'enzyme';
import teamMock from '../../../../../../__mocks__/PropertiesPage/teamMock.json';
import { TeamItem } from '../../../../../../features/Properties/Sidebar/TeamItem';

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
        team: teamMock,
        teamCalculatedValues: teamCalculatedValuesMock
      };
      wrapper = shallow(<TeamItem {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render name', () => {
      const name = wrapper.find('a').text();
      expect(name).toBe('Team Two');
    });
  });
});
