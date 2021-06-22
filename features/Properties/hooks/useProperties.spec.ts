import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useProperties from './useProperties';
import propertiesApi from '../../../common/services/firestore/properties';
import { admin, corporate, teamLead } from '../../../__mocks__/users';

describe('Unit | Features | Properties | Hooks | Use Properties', () => {
  afterEach(() => sinon.restore());

  test('should request all teams for an admin user', () => {
    const expected = true;
    const findAll = sinon.stub(propertiesApi, 'findAll').callThrough();
    renderHook(() => useProperties(admin));

    const actual = findAll.called;
    expect(actual).toEqual(expected);
  });

  test('should request all teams for corporate users', () => {
    const expected = true;
    const findAll = sinon.stub(propertiesApi, 'findAll').callThrough();
    renderHook(() => useProperties(corporate));

    const actual = findAll.called;
    expect(actual).toEqual(expected);
  });

  test('should not request all teams for corporate team leads', () => {
    const expected = false;
    const findAll = sinon.stub(propertiesApi, 'findAll').callThrough();
    renderHook(() => useProperties(teamLead));

    const actual = findAll.called;
    expect(actual).toEqual(expected);
  });

  test('should not request any teams for users without access', () => {
    const expected = [false];
    const findAll = sinon.stub(propertiesApi, 'findAll').callThrough();
    // TODO all query methods
    renderHook(() => useProperties(teamLead));

    const actual = [findAll.called];
    expect(actual).toEqual(expected);
  });
});
