import { render, screen } from '@testing-library/react';
import { yardiResidentOne } from '../../../../__mocks__/yardi/residents';
import Item from './index';

describe('Unit | Features | Property Residents | List | Item', () => {
  it('should show the first name, middle name, last name of the residence if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const [firstName, middleName, lastName] = [
      screen.queryByTestId('firstName'),
      screen.queryByTestId('middleName'),
      screen.queryByTestId('lastName')
    ];
    expect(firstName).toBeDefined();
    expect(middleName).toBeDefined();
    expect(lastName).toBeDefined();
  });

  it('should show the Lease unit and sort lease unit number if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const [leaseUnit, sortLeaseUnit] = [
      screen.queryByTestId('leaseUnit'),
      screen.queryByTestId('sortLeaseUnit')
    ];
    expect(leaseUnit).toBeDefined();
    expect(sortLeaseUnit).toBeDefined();
  });

  it('should show Email if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const email = screen.queryByTestId('email');
    expect(email).toBeDefined();
  });

  it('should show Mobile Number if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const mobileNumber = screen.queryByTestId('mobileNumber');
    expect(mobileNumber).toBeDefined();
  });

  it('should show Lease From if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const leaseFrom = screen.queryByTestId('leaseFrom');
    expect(leaseFrom).toBeDefined();
  });

  it('should show Lease To if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const leaseTo = screen.queryByTestId('leaseTo');
    expect(leaseTo).toBeDefined();
  });

  it('should show Move In if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const moveIn = screen.queryByTestId('moveIn');
    expect(moveIn).toBeDefined();
  });

  it('should show Office Number if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const officeNumber = screen.queryByTestId('officeNumber');
    expect(officeNumber).toBeDefined();
  });

  it('should show Home Number if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const homeNumber = screen.queryByTestId('homeNumber');
    expect(homeNumber).toBeDefined();
  });

  it('should show Yardi Status if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const yardiStatus = screen.queryByTestId('yardiStatus');
    expect(yardiStatus).toBeDefined();
  });

  it('should show Resident ID  if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const id = screen.queryByTestId('id');
    expect(id).toBeDefined();
  });

  it('should show Payment Plan if present', () => {
    render(<Item resident={yardiResidentOne} />);
    const paymentPlan = screen.queryByTestId('paymentPlan');
    expect(paymentPlan).toBeDefined();
  });
});
