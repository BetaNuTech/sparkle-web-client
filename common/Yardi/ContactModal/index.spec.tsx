import { render, screen } from '@testing-library/react';
import sinon from 'sinon';
import createResident from '../../../__tests__/helpers/createResident';
import ContactModal from './index';

describe('Unit | features | Property Residents | Contact Modal', () => {
  afterEach(() => sinon.restore());

  it('should render contact details with correct hyperlinks', () => {
    const resident = createResident('1', {});
    const { email, homeNumber, officeNumber, mobileNumber } = resident;
    const expectedEmailHref = `mailto:${email}`;
    const expectedPhoneHrefs = `tel:${homeNumber} | tel:${officeNumber} | tel:${mobileNumber}`;
    render(
      <ContactModal
        onClose={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        data={resident}
      />
    );

    const emailEl = screen.queryByTestId('property-residents-contact-email');
    const phoneEls = screen.queryAllByTestId(
      'property-residents-contact-phone'
    );

    const actualPhoneHrefs = phoneEls
      .map((item) => item.getAttribute('href'))
      .join(' | ');

    expect(emailEl).toHaveAttribute('href', expectedEmailHref);
    expect(actualPhoneHrefs).toEqual(expectedPhoneHrefs);
  });
});
