import sinon from 'sinon';
import { render as rtlRender } from '@testing-library/react';
import propertiesApi, {
  propertiesCollectionResult
} from '../../common/services/firestore/properties';
import teamsApi, {
  teamsCollectionResult
} from '../../common/services/firestore/teams';
import { admin } from '../../__mocks__/users';
import mockTeams from '../../__mocks__/PropertiesPage/teamsMock.json';
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
    const wrapper = render(<Properties user={admin} />);
    expect(wrapper).toMatchSnapshot();
  });
});
