import sinon from 'sinon';
import { renderHook } from '@testing-library/react-hooks';
import useProperties from './useProperties';
import propertiesApi from '../../../common/services/firestore/properties';
import {
  admin,
  corporate,
  teamLead,
  propertyMember,
  noAccess
} from '../../../__mocks__/users';
import * as userUtils from '../../../common/utils/userPermissions';
import errorReports from '../../../common/services/api/errorReports';

const emptyCollectionResult = {
  status: 'success',
  error: null,
  data: []
};

describe('Unit | Features | Properties | Hooks | Use Properties', () => {
  afterEach(() => sinon.restore());

  test('should request all properties for an admin user', () => {
    const expected = [true, false];
    const findAll = sinon
      .stub(propertiesApi, 'findAll')
      .returns(emptyCollectionResult);
    const queryRecords = sinon
      .stub(propertiesApi, 'queryRecords')
      .returns(emptyCollectionResult);
    renderHook(() => useProperties({}, admin));

    const actual = [findAll.called, queryRecords.called];
    expect(actual).toEqual(expected);
  });

  test('should request all properties for corporate users', () => {
    const expected = [true, false];
    const findAll = sinon
      .stub(propertiesApi, 'findAll')
      .returns(emptyCollectionResult);
    const queryRecords = sinon
      .stub(propertiesApi, 'queryRecords')
      .returns(emptyCollectionResult);
    renderHook(() => useProperties({}, corporate));

    const actual = [findAll.called, queryRecords.called];
    expect(actual).toEqual(expected);
  });

  test('should not request all properties for corporate team leads', () => {
    const expected = false;
    const findAll = sinon
      .stub(propertiesApi, 'findAll')
      .returns(emptyCollectionResult);
    renderHook(() => useProperties({}, teamLead));

    const actual = findAll.called;
    expect(actual).toEqual(expected);
  });

  test('should not request any properties for users without access', () => {
    const expected = [false, false];
    const findAll = sinon
      .stub(propertiesApi, 'findAll')
      .returns(emptyCollectionResult);
    const queryRecords = sinon
      .stub(propertiesApi, 'queryRecords')
      .returns(emptyCollectionResult);
    renderHook(() => useProperties({}, noAccess));

    const actual = [findAll.called, queryRecords.called];
    expect(actual).toEqual(expected);
  });

  test('should request assigned properties for team lead user', () => {
    const expected = userUtils.getProperties(teamLead.properties); // eslint-disable-line
    const queryRecords = sinon
      .stub(propertiesApi, 'queryRecords')
      .callThrough();
    renderHook(() => useProperties({}, teamLead));

    const result = queryRecords.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
  });

  test('should request assigned properties for property user', () => {
    const expected = userUtils.getProperties(propertyMember.properties); // eslint-disable-line
    const queryRecords = sinon
      .stub(propertiesApi, 'queryRecords')
      .callThrough();
    renderHook(() => useProperties({}, propertyMember));

    const result = queryRecords.firstCall || { args: [] };
    const actual = result.args[1];
    expect(actual).toEqual(expected);
    expect(actual).toEqual(expected);
  });

  test('should send error report if more than 10 records propreties accessed by property user', () => {
    const expected = true;
    const propertyUser = JSON.parse(JSON.stringify(propertyMember)); // deep clone
    propertyUser.properties = {
      'property-1': true,
      'property-2': true,
      'property-3': true,
      'property-4': true,
      'property-5': true,
      'property-6': true,
      'property-7': true,
      'property-8': true,
      'property-9': true,
      'property-10': true,
      'property-11': true
    };
    const findAll = sinon.stub(propertiesApi, 'queryRecords').callThrough();
    const sendErrorReport = sinon
      .stub(errorReports, 'send')
      .callsFake(() => true);
    sinon.stub(console, 'warn').callsFake(() => true);

    renderHook(() => useProperties({}, propertyUser));

    const actual = findAll.called;
    expect(actual).toEqual(expected);
    expect(sendErrorReport.called).toEqual(expected);
  });
});
