import React from 'react';
import { shallow } from 'enzyme';
import teamsMock from '../../../../../__mocks__/PropertiesPage/teamsMock.json';
import { Sidebar } from '../../../../../features/Properties/Sidebar';

const teamCalculatedValuesMock = [
  {
    totalNumOfDeficientItems: 1,
    totalNumOfFollowUpActionsForDeficientItems: 2,
    totalNumOfRequiredActionsForDeficientItems: 3
  }
];

describe('Sidebar component', () => {
  describe('rendering', () => {
    let wrapper;

    beforeEach(() => {
      const props = {
        teams: teamsMock,
        teamCalculatedValues: teamCalculatedValuesMock
      };
      wrapper = shallow(<Sidebar {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
