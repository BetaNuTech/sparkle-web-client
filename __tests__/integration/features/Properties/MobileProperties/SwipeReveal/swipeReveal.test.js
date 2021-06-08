import React from 'react';
import { shallow } from 'enzyme';
import { SwipeReveal } from '../../../../../../features/Properties/MobileProperties/SwipeReveal';

describe('SwipeRevealcomponent', () => {
  describe('rendering', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<SwipeReveal />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
