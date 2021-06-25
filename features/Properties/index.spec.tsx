import sinon from 'sinon';
import { render as rtlRender } from '@testing-library/react';
import { FirebaseAppProvider } from 'reactfire';
import { ToastProvider } from 'react-toast-notifications';
import propertiesApi, {
  propertiesCollectionResult
} from '../../common/services/firestore/properties';
import teamsApi, {
  teamsCollectionResult
} from '../../common/services/firestore/teams';
import firebaseConfig from '../../config/firebase';
import { admin } from '../../__mocks__/users';
import mockTeams from '../../__mocks__/teams';
import mockPropertes from '../../__mocks__/properties';
import Properties from './index';

function render(ui: any, options: any = {}) {
  sinon.restore();

  // Stub all properties requests
  const propertiesPayload: propertiesCollectionResult = {
    status: 'success',
    error: null,
    data: mockPropertes
  };
  sinon.stub(propertiesApi, 'findAll').returns(propertiesPayload);

  // Stub all teams requests
  const teamsPayload: teamsCollectionResult = {
    status: 'success',
    error: null,
    data: mockTeams
  };
  sinon.stub(teamsApi, 'findAll').returns(teamsPayload);
  return rtlRender(ui, options);
}

describe('Unit | Features | Properties | Snapshot', () => {
  it('matches prior snapshot', () => {
    const wrapper = render(
      <FirebaseAppProvider firebaseConfig={firebaseConfig}>
        <ToastProvider>
          <Properties user={admin} />
        </ToastProvider>
      </FirebaseAppProvider>
    );
    expect(wrapper).toMatchSnapshot();
  });
});
