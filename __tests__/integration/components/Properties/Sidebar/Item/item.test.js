import React from 'react';
import { shallow } from 'enzyme';
import { Item } from '../../../../../../components/Properties/Sidebar/Item';

describe('Item component', () => {
  describe('rendering', () => {
    let wrapper;
    beforeEach(() => {
      const props = {
        name: 'teamOne'
      };
      wrapper = shallow(<Item {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });

    it('should render name', () => {
      const name = wrapper.find('a').text();
      expect(name).toBe('teamOne');
    });
  });
});
