import { render, screen } from '@testing-library/react';
import { yardiResidentOne } from '../../../../__mocks__/yardi/residents';
import stubIntersectionObserver from '../../../../__tests__/helpers/stubIntersectionObserver';
import Item from './index';

describe('Unit | Features | Property Residents | List | Item', () => {
  beforeEach(() => stubIntersectionObserver());
  it('should show the first name, middle name, last name of the residence if present', () => {
    render(<Item resident={yardiResidentOne} forceVisible />);
    const [firstName, middleName, lastName] = [
      screen.queryByTestId('residents-first-name'),
      screen.queryByTestId('residents-middle-name'),
      screen.queryByTestId('residents-last-name')
    ];
    expect(firstName).toBeTruthy();
    expect(middleName).toBeTruthy();
    expect(lastName).toBeTruthy();
  });

  it('should show the Lease unit and sort lease unit number if present', () => {
    render(<Item resident={yardiResidentOne} forceVisible />);
    const [leaseUnit, sortLeaseUnit] = [
      screen.queryByTestId('residents-lease-unit'),
      screen.queryByTestId('residents-sort-lease-unit')
    ];
    expect(leaseUnit).toBeTruthy();
    expect(sortLeaseUnit).toBeTruthy();
  });

  it('should show Email if present', () => {
    render(<Item resident={yardiResidentOne} forceVisible />);
    const email = screen.queryByTestId('residents-email');
    expect(email).toBeTruthy();
  });

  it('should show Mobile Number if present', () => {
    render(<Item resident={yardiResidentOne} forceVisible />);
    const mobileNumber = screen.queryByTestId('residents-mobile-number');
    expect(mobileNumber).toBeTruthy();
  });

  it('should show Lease From if present', () => {
    render(<Item resident={yardiResidentOne} forceVisible />);
    const leaseFrom = screen.queryByTestId('residents-lease-from');
    expect(leaseFrom).toBeTruthy();
  });

  it('should show Lease To if present', () => {
    render(<Item resident={yardiResidentOne} forceVisible />);
    const leaseTo = screen.queryByTestId('residents-lease-to');
    expect(leaseTo).toBeTruthy();
  });

  it('should show Move In if present', () => {
    render(<Item resident={yardiResidentOne} forceVisible />);
    const moveIn = screen.queryByTestId('residents-move-in');
    expect(moveIn).toBeTruthy();
  });

  it('should show Office Number if present', () => {
    render(<Item resident={yardiResidentOne} forceVisible />);
    const officeNumber = screen.queryByTestId('residents-office-number');
    expect(officeNumber).toBeTruthy();
  });

  it('should show Home Number if present', () => {
    render(<Item resident={yardiResidentOne} forceVisible />);
    const homeNumber = screen.queryByTestId('residents-home-number');
    expect(homeNumber).toBeTruthy();
  });

  it('should show Yardi Status if present', () => {
    render(<Item resident={yardiResidentOne} forceVisible />);
    const yardiStatus = screen.queryByTestId('residents-yardi-status');
    expect(yardiStatus).toBeTruthy();
  });

  it('should show Resident ID  if present', () => {
    render(<Item resident={yardiResidentOne} forceVisible />);
    const id = screen.queryByTestId('residents-id');
    expect(id).toBeTruthy();
  });

  it('should show Payment Plan if present', () => {
    render(<Item resident={yardiResidentOne} forceVisible />);
    const paymentPlan = screen.queryByTestId('residents-payment-plan');
    expect(paymentPlan).toBeTruthy();
  });
});
