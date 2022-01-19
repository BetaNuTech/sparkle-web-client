import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SectionItemDropdown from './index';

describe('Unit | Features | Property Update Inspection | Sections | Group | Item | Dropdown', () => {
  it('should call method to change item applicability to false ', async () => {
    const onChangeItemNA = sinon.spy();
    const props = {
      isItemNA: true,
      onChangeItemNA
    };

    render(<SectionItemDropdown {...props} />);

    const isItemNAAddBtn = screen.queryByTestId('button-change-NA-add');

    userEvent.click(isItemNAAddBtn);
    const actual = onChangeItemNA.called
      ? onChangeItemNA.getCall(0).args[0]
      : {};

    expect(isItemNAAddBtn).toBeTruthy();
    expect(actual).toBeFalsy();
  });

  it('should call method to change item applicability to true', async () => {
    const onChangeItemNA = sinon.spy();
    const props = {
      isItemNA: false,
      onChangeItemNA
    };

    render(<SectionItemDropdown {...props} />);

    const isItemNABtn = screen.queryByTestId('button-change-NA');

    userEvent.click(isItemNABtn);
    const actual = onChangeItemNA.called
      ? onChangeItemNA.getCall(0).args[0]
      : {};

    expect(isItemNABtn).toBeTruthy();
    expect(actual).toBeTruthy();
  });
});
