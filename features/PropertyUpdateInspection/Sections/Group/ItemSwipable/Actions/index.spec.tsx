import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Actions from './index';

describe('Unit | Features | Property Update Inspection | Sections | Group | Item Swipable | Actions', () => {
  it('should be able to request to make an inapplicable item applicable again', async () => {
    const onChangeItemNA = sinon.spy();
    const props = {
      isItemNA: true,
      onChangeItemNA
    };

    render(<Actions {...props} />);

    const isItemNAAddBtn = screen.queryByTestId('button-change-NA-add');

    userEvent.click(isItemNAAddBtn);
    const actual = onChangeItemNA.called
      ? onChangeItemNA.getCall(0).args[0]
      : {};

    expect(isItemNAAddBtn).toBeTruthy();
    expect(actual).toBeFalsy();
  });

  it('should be able to request to make an item not applicable', async () => {
    const onChangeItemNA = sinon.spy();
    const props = {
      isItemNA: false,
      onChangeItemNA
    };

    render(<Actions {...props} />);

    const isItemNABtn = screen.queryByTestId('button-change-NA');

    userEvent.click(isItemNABtn);
    const actual = onChangeItemNA.called
      ? onChangeItemNA.getCall(0).args[0]
      : {};

    expect(isItemNABtn).toBeTruthy();
    expect(actual).toBeTruthy();
  });
});
