import React from 'react';
import { shallow } from 'enzyme';
import propertiesMock from '../../../../../__mocks__/propertiesMock.json';
import { MobileProperties } from '../../../../../components/Properties/MobileProperties';

describe('MobileProperties component', () => {
  describe('rendering', () => {
    let wrapper;

    beforeEach(() => {
      const props = {
        properties: propertiesMock
      };
      wrapper = shallow(<MobileProperties {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
