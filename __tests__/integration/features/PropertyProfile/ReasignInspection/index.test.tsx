import sinon from 'sinon';
import { render as rtlRender, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FirebaseAppProvider } from 'reactfire';
import { ToastContainer } from 'react-toastify';
import { admin as user } from '../../../../../__mocks__/users';
import mockProperties, { propertyB } from '../../../../../__mocks__/properties';
import mockTeams from '../../../../../__mocks__/teams';
import { fullInspection } from '../../../../../__mocks__/inspections';
import ReasingInspection from '../../../../../features/PropertyProfile/ReasignInspection';
import firebaseConfig from '../../../../../config/firebase';

function render(ui: any, options: any = {}) {
  return rtlRender(
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      {ui}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
      />
    </FirebaseAppProvider>,
    options
  );
}

describe('Integration | Features | Properties | Reasign Inspection', () => {
  afterEach(() => sinon.restore());

  it('should not render current property in list of assignable properties', async () => {
    const expected = [true, false];
    const props = {
      user,
      property: propertyB,
      properties: mockProperties,
      inspection: fullInspection,
      teams: mockTeams,
      isLoaded: true
    };
    render(<ReasingInspection {...props} />);

    const Property1 = Boolean(screen.getByTestId('checkbox-item-property-1'));
    const currentProperty = Boolean(
      screen.queryByTestId('checkbox-item-property-2')
    );
    const actual = [Property1, currentProperty];
    expect(actual).toEqual(expected);
  });

  it('should display property name when selected', async () => {
    const expected = 'A1400 Chestnut';
    const props = {
      user,
      property: propertyB,
      properties: mockProperties,
      inspection: fullInspection,
      teams: mockTeams,
      isLoaded: true
    };
    render(<ReasingInspection {...props} />);

    const property1 = screen.getByTestId('checkbox-item-property-1');
    userEvent.click(property1);

    const selectedProperty: HTMLElement = screen.queryByTestId(
      'reasign-inspection-selected-property'
    );

    const actual = selectedProperty.textContent;
    expect(actual).toEqual(expected);
  });
});
