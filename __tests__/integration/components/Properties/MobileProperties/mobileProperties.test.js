import React from 'react';
import { shallow } from 'enzyme';
import teamsMock from '../../../../../__mocks__/PropertiesPage/teamsMock.json';
import propertiesMock from '../../../../../__mocks__/PropertiesPage/propertiesMock.json';
import { MobileProperties } from '../../../../../components/Properties/MobileProperties';

const teamCalculatedValuesMock = [
  {
    totalNumOfDeficientItems: 1,
    totalNumOfFollowUpActionsForDeficientItems: 2,
    totalNumOfRequiredActionsForDeficientItems: 3
  }
];

describe('MobileProperties component', () => {
  describe('rendering', () => {
    let wrapper;

    beforeEach(() => {
      const props = {
        properties: propertiesMock,
        teams: teamsMock,
        teamCalculatedValues: teamCalculatedValuesMock
      };
      wrapper = shallow(<MobileProperties {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
