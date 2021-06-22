import { render } from '@testing-library/react';
import teamsMock from '../../../__mocks__/teams';
import Sidebar from './index';

const teamCalculatedValuesMock = [
  {
    totalNumOfDeficientItems: 1,
    totalNumOfFollowUpActionsForDeficientItems: 2,
    totalNumOfRequiredActionsForDeficientItems: 3
  }
];

describe('Unit | Features | Properties | Sidebar', () => {
  it('matches prior snapshot', () => {
    const props = {
      teams: teamsMock,
      teamCalculatedValues: teamCalculatedValuesMock
    };
    const { container } = render(<Sidebar {...props} />);
    expect(container).toMatchSnapshot();
  });
});
