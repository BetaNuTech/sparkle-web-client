import React from 'react';
import { shallow } from 'enzyme';
import { TeamItem } from '../../../../../../components/Properties/MobileProperties/TeamItem';

describe('TeamItem component', () => {
  describe('rendering', () => {
    let wrapper;

    beforeEach(() => {
      const props = {
        name: 'TeamOne'
      };
      wrapper = shallow(<TeamItem {...props} />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
