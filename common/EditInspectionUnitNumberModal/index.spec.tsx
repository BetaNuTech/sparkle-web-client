import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import deepClone from '../../__tests__/helpers/deepClone';
import { fullInspection } from '../../__mocks__/inspections';
import EditUnitNumberModal from './index';

describe('Unit | Common | Edit Inspection Unit Number Modal', () => {
  afterEach(() => sinon.restore());

  it('should prefill input with the inspection current unit number', () => {
    const expected = 'A12';
    const inspection = deepClone(fullInspection);
    inspection.unitNumber = expected;

    const props = {
      isVisible: true,
      onClose: sinon.spy(),
      inspection,
      onConfirm: sinon.spy(),
      isUpdating: false
    };

    render(<EditUnitNumberModal {...props} />);

    const input = screen.queryByTestId(
      'edit-unit-number-input'
    ) as HTMLInputElement;
    expect(input).toBeTruthy();
    expect(input.value).toEqual(expected);
  });

  it('should disable save until the unit number is changed', () => {
    const inspection = deepClone(fullInspection);
    inspection.unitNumber = 'A12';

    const props = {
      isVisible: true,
      onClose: sinon.spy(),
      inspection,
      onConfirm: sinon.spy(),
      isUpdating: false
    };

    render(<EditUnitNumberModal {...props} />);

    const saveButton = screen.queryByTestId(
      'edit-unit-number-confirm'
    ) as HTMLButtonElement;
    expect(saveButton.disabled).toEqual(true);

    const input = screen.queryByTestId('edit-unit-number-input');
    userEvent.clear(input);
    userEvent.type(input, 'B4');

    expect(saveButton.disabled).toEqual(false);
  });

  it('should confirm with the trimmed unit number', () => {
    const expected = 'B4';
    const onConfirm = sinon.spy();
    const inspection = deepClone(fullInspection);
    delete inspection.unitNumber;

    const props = {
      isVisible: true,
      onClose: sinon.spy(),
      inspection,
      onConfirm,
      isUpdating: false
    };

    render(<EditUnitNumberModal {...props} />);

    const input = screen.queryByTestId('edit-unit-number-input');
    userEvent.type(input, ' B4 ');

    const saveButton = screen.queryByTestId('edit-unit-number-confirm');
    act(() => {
      userEvent.click(saveButton);
    });

    expect(onConfirm.called).toBeTruthy();
    expect(onConfirm.firstCall.args[0]).toEqual(expected);
  });

  it('should allow clearing an existing unit number', () => {
    const expected = '';
    const onConfirm = sinon.spy();
    const inspection = deepClone(fullInspection);
    inspection.unitNumber = 'A12';

    const props = {
      isVisible: true,
      onClose: sinon.spy(),
      inspection,
      onConfirm,
      isUpdating: false
    };

    render(<EditUnitNumberModal {...props} />);

    const input = screen.queryByTestId('edit-unit-number-input');
    userEvent.clear(input);

    const saveButton = screen.queryByTestId('edit-unit-number-confirm');
    act(() => {
      userEvent.click(saveButton);
    });

    expect(onConfirm.called).toBeTruthy();
    expect(onConfirm.firstCall.args[0]).toEqual(expected);
  });
});
