import { render, screen } from '@testing-library/react';
import { yardiResidentOne } from '../../../../__mocks__/yardi/residents';
import Item from './index';

describe('Unit | Features | Property Residents | List | Item', () => {
  it('should show the first name, middle name, last name of the residence if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const [firstName, middleName, lastName] = [
      screen.queryByTestId('resindents-first-name'),
      screen.queryByTestId('resindents-middle-name'),
      screen.queryByTestId('resindents-last-name')
    ];
    expect(firstName).toBeTruthy();
    expect(middleName).toBeTruthy();
    expect(lastName).toBeTruthy();
  });

  it('should show the Lease unit and sort lease unit number if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const [leaseUnit, sortLeaseUnit] = [
      screen.queryByTestId('resindents-lease-unit'),
      screen.queryByTestId('resindents-sort-lease-unit')
    ];
    expect(leaseUnit).toBeTruthy();
    expect(sortLeaseUnit).toBeTruthy();
  });

  it('should show Email if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const email = screen.queryByTestId('resindents-email');
    expect(email).toBeTruthy();
  });

  it('should show Mobile Number if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const mobileNumber = screen.queryByTestId('resindents-mobile-number');
    expect(mobileNumber).toBeTruthy();
  });

  it('should show Lease From if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const leaseFrom = screen.queryByTestId('resindents-lease-from');
    expect(leaseFrom).toBeTruthy();
  });

  it('should show Lease To if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const leaseTo = screen.queryByTestId('resindents-lease-to');
    expect(leaseTo).toBeTruthy();
  });

  it('should show Move In if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const moveIn = screen.queryByTestId('resindents-move-in');
    expect(moveIn).toBeTruthy();
  });

  it('should show Office Number if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const officeNumber = screen.queryByTestId('resindents-office-number');
    expect(officeNumber).toBeTruthy();
  });

  it('should show Home Number if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const homeNumber = screen.queryByTestId('resindents-home-number');
    expect(homeNumber).toBeTruthy();
  });

  it('should show Yardi Status if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const yardiStatus = screen.queryByTestId('resindents-yardi-status');
    expect(yardiStatus).toBeTruthy();
  });

  it('should show Resident ID  if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const id = screen.queryByTestId('id');
    expect(id).toBeTruthy();
  });

  it('should show Payment Plan if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const paymentPlan = screen.queryByTestId('resindents-payment-plan');
    expect(paymentPlan).toBeTruthy();
  });
});
