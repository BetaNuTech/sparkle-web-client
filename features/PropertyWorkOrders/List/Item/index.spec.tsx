import { render, screen } from '@testing-library/react';
import {
  yardiWorkOrderOne,
  yardiWorkOrderTwo
} from '../../../../__mocks__/yardi/workOrders';
import Item from './index';
import workOrderModel from '../../../../common/models/yardi/workOrder';

describe('Unit | Features | Property Work Orders | List | Item', () => {
  it('should show work order id, request date, and status of the order if present', () => {
    render(<Item workOrder={yardiWorkOrderTwo} />);
    const [idElement, dateElement, statusElement] = [
      screen.queryByTestId('order-id'),
      screen.queryByTestId('request-date'),
      screen.queryByTestId('order-status')
    ];
    expect(idElement).toBeDefined();
    expect(dateElement).toBeDefined();
    expect(statusElement).toBeNull();
  });

  it('should show the unit number of the work order if present', () => {
    const workOrder = {
      ...yardiWorkOrderTwo,
      permissionToEnter: undefined
    } as workOrderModel;
    render(<Item workOrder={workOrder} />);
    const unitElement = screen.queryByTestId('work-order-unit');
    expect(unitElement).toBeDefined();
  });

  it('should show updatedAt and updated by in the work order if present', () => {
    render(<Item workOrder={yardiWorkOrderTwo} />);
    const [updatedAtElement, updatedByElement] = [
      screen.queryByTestId('updated-at'),
      screen.queryByTestId('updated-by')
    ];
    expect(updatedAtElement).toBeDefined();
    expect(updatedByElement).toBeNull();
  });

  it('should show order description if present', () => {
    render(<Item workOrder={yardiWorkOrderOne} />);
    const descriptionElement = screen.queryByTestId('order-description');
    expect(descriptionElement).toBeDefined();
  });

  it('should not show order category', () => {
    render(<Item workOrder={yardiWorkOrderTwo} />);
    const categoryElement = screen.queryByTestId('order-category');
    expect(categoryElement).toBeNull();
  });

  it('should show problem notes if present', () => {
    render(<Item workOrder={yardiWorkOrderTwo} />);
    const problemElement = screen.queryByTestId('problem-notes');
    expect(problemElement).toBeDefined();
  });

  it('should not show technician notes', () => {
    render(<Item workOrder={yardiWorkOrderTwo} />);
    const technicianElement = screen.queryByTestId('technician-notes');
    expect(technicianElement).toBeNull();
  });

  it('should show Yes or No when tenant caused is present', () => {
    render(<Item workOrder={yardiWorkOrderOne} />);
    const technicianElement = screen.queryByTestId('tenant-caused');
    expect(technicianElement).toBeDefined();
    expect(technicianElement.textContent).toEqual('Tenant Caused: NO');
  });

  it('should not show permission to enter when not set', () => {
    const workOrder = {
      ...yardiWorkOrderTwo,
      permissionToEnter: undefined
    } as workOrderModel;
    render(<Item workOrder={workOrder} />);
    const permissionElement = screen.queryByTestId('permission-enter');
    expect(permissionElement).toBeNull();
  });

  it('should not redner the row for the requestor data if all the data is missing', () => {
    render(<Item workOrder={yardiWorkOrderTwo} />);
    const requestorData = [
      screen.queryByTestId('requestor-name'),
      screen.queryByTestId('requestor-email'),
      screen.queryByTestId('requestor-phone')
    ];
    expect(requestorData.every((data) => data === null)).toBe(true);
  });

  it('should show origin of work order if present', () => {
    render(<Item workOrder={yardiWorkOrderOne} />);
    const originElement = screen.queryByTestId('order-origin');
    expect(originElement).toBeDefined();
  });
});
