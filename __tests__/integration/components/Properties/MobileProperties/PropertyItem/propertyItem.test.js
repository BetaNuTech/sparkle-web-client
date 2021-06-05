import React from 'react';
import { shallow } from 'enzyme';
import propertyMock from '../../../../../../__mocks__/propertyMock.json';
import { PropertyItem } from '../../../../../../components/Properties/MobileProperties/PropertyItem';

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
