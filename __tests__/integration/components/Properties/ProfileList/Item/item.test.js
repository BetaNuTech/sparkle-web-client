import React from 'react';
import { shallow } from 'enzyme';
import propertyMock from '../../../../../../__mocks__/propertyMock.json';
import { Item } from '../../../../../../components/Properties/ProfileList/Item';

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