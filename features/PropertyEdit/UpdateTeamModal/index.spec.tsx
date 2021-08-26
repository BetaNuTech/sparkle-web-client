import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  teamWithoutProperties,
  teamWithProperties
} from '../../../__mocks__/teams';
import UpdateTeamModal from './index';

describe('Unit | Features | Property Edit | Update Team Modal', () => {
  afterEach(() => sinon.restore());

  it('checks team when it is selected', () => {
    const expected = true;
    const onClose = sinon.spy();
    const props = {
      teams: [teamWithoutProperties],
      onClose,
      selectedTeamId: 'team-2',
      isVisible: true,
      changeTeamSelection: sinon.spy()
    };
    render(<UpdateTeamModal {...props} />);

    const item = screen.getByTestId('checkbox-item-team-2') as HTMLInputElement;

    const actual = item.checked;
    expect(actual).toEqual(expected);
  });

  it('unchecks team when it is reselected', () => {
    const expected = '';
    const onClose = sinon.spy();
    const changeTeamSelection = sinon.stub().returns(true);
    const props = {
      teams: [teamWithProperties],
      onClose,
      selectedTeamId: 'team-1',
      isVisible: true,
      changeTeamSelection
    };
    render(<UpdateTeamModal {...props} />);

    const item = screen.getByTestId('checkbox-item-team-1') as HTMLInputElement;
    userEvent.click(item);

    const result = changeTeamSelection.firstCall || { args: [] };
    const actual = result.args[0];
    expect(actual).toEqual(expected);
  });

  it('invokes on close action when on close button clicked', () => {
    const expected = true;
    const onClose = sinon.spy();
    const props = {
      teams: [],
      onClose,
      selectedTeamId: '',
      isVisible: true,
      changeTeamSelection: () => true
    };
    render(<UpdateTeamModal {...props} />);

    const closeButton = screen.queryByTestId('close');
    userEvent.click(closeButton);
    const actual = onClose.called;
    expect(actual).toEqual(expected);
  });
});
