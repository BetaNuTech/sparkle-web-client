import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import customValues from '../../../../__mocks__/yardi/customValues';
import { getReasons } from '../../utils/customValues';
import CancelPrompt from './index';

const cancelReasons = getReasons(customValues, 'Canceled');
const holdReasons = getReasons(customValues, 'On Hold');

describe('Unit | Features | Property Work Orders | Work Order Edit | Cancel Prompt', () => {
  it('should confirm without a reason when none are required', () => {
    const onConfirm = sinon.spy();
    render(
      <CancelPrompt
        isVisible
        onClose={() => null}
        workOrderId="42"
        reasons={cancelReasons}
        onConfirm={onConfirm}
      />
    );
    const confirm = screen.getByTestId('cancel-work-order-confirm');
    expect(confirm).not.toBeDisabled();
    userEvent.click(confirm);
    expect(onConfirm.firstCall.args).toEqual(['']);
  });

  it('should pass the selected reason when confirming', () => {
    const onConfirm = sinon.spy();
    render(
      <CancelPrompt
        isVisible
        onClose={() => null}
        workOrderId="42"
        reasons={cancelReasons}
        onConfirm={onConfirm}
      />
    );
    userEvent.selectOptions(
      screen.getByTestId('cancel-work-order-reason'),
      'Duplicate'
    );
    userEvent.click(screen.getByTestId('cancel-work-order-confirm'));
    expect(onConfirm.firstCall.args).toEqual(['Duplicate']);
  });

  it('should not allow confirming until a required reason is chosen', () => {
    render(
      <CancelPrompt
        isVisible
        onClose={() => null}
        workOrderId="42"
        reasons={holdReasons}
        onConfirm={() => null}
      />
    );
    const confirm = screen.getByTestId('cancel-work-order-confirm');
    expect(confirm).toBeDisabled();
    userEvent.selectOptions(
      screen.getByTestId('cancel-work-order-reason'),
      'Awaiting parts'
    );
    expect(confirm).not.toBeDisabled();
  });

  it('should hide the reason picker when yardi has no reasons for cancelling', () => {
    render(
      <CancelPrompt
        isVisible
        onClose={() => null}
        workOrderId="42"
        reasons={[]}
        onConfirm={() => null}
      />
    );
    expect(screen.queryByTestId('cancel-work-order-reason')).toBeNull();
  });
});
