import React from 'react';
import { shallow } from 'enzyme';
import propertiesMock from '.../../../../../__mocks__/PropertiesPage/propertiesMock.json';
import { ProfileList } from '../../../../../components/Properties/ProfileList';

describe('ProfileList component', () => {
  describe('rendering', () => {
    let wrapper;

    beforeEach(() => {
      const props = {
        properties: propertiesMock
      };
      wrapper = shallow(<ProfileList {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
