import { render, screen } from '@testing-library/react';
import customValues from '../../../../__mocks__/yardi/customValues';
import {
  yardiWorkOrderOne,
  yardiWorkOrderTwo
} from '../../../../__mocks__/yardi/workOrders';
import Details from './index';

describe('Unit | Features | Property Work Orders | Work Order Edit | Details', () => {
  it('should show the custom values casing of lowercased picker values', () => {
    const workOrder = {
      ...yardiWorkOrderOne,
      status: 'on hold',
      priority: 'high',
      category: 'plumbing',
      subCategory: 'Leak'
    };
    render(<Details workOrder={workOrder} customValues={customValues} />);
    expect(screen.getByTestId('work-order-detail-status').textContent).toEqual(
      'On Hold'
    );
    expect(
      screen.getByTestId('work-order-detail-priority').textContent
    ).toEqual('High');
    expect(
      screen.getByTestId('work-order-detail-category').textContent
    ).toEqual('Plumbing / Leak');
  });

  it('should omit attributes the work order does not have', () => {
    render(
      <Details workOrder={yardiWorkOrderTwo} customValues={customValues} />
    );
    expect(screen.queryByTestId('work-order-detail-status')).toBeNull();
    expect(screen.queryByTestId('work-order-detail-category')).toBeNull();
    expect(screen.queryByTestId('work-order-detail-requestor-name')).toBeNull();
    expect(screen.queryByTestId('work-order-detail-unit')).toBeTruthy();
  });

  it('should link requestor contact details', () => {
    render(
      <Details workOrder={yardiWorkOrderOne} customValues={customValues} />
    );
    expect(
      screen.getByTestId('work-order-detail-requestor-email')
    ).toHaveAttribute('href', `mailto:${yardiWorkOrderOne.requestorEmail}`);
    expect(
      screen.getByTestId('work-order-detail-requestor-phone')
    ).toHaveAttribute('href', `tel:${yardiWorkOrderOne.requestorPhone}`);
  });
});
