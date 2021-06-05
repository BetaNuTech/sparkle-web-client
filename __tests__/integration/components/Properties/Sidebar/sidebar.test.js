import React from 'react';
import { shallow } from 'enzyme';
import { Sidebar } from '../../../../../components/Properties/Sidebar';

describe('Sidebar component', () => {
  describe('rendering', () => {
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(<Sidebar />);
    });

    it('renders correctly', () => {
      expect(wrapper).toMatchSnapshot();
    });
  });
});
