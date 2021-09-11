import sinon from 'sinon';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import propertiesApi from '../../../common/services/api/properties';
import propertyModel from '../../../common/models/property';
import currentUser from '../../../common/utils/currentUser';
import usePropertyForm from './usePropertyForm';

describe('Unit | Features | Property Edit | Hooks | Use Property Form', () => {
  afterEach(() => sinon.restore());

  test('should call the create record method of api', async () => {
    const expected = true;

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    // Creates spy for ajax method of jQuery lib
    const spyFunc = sinon.spy(propertiesApi, 'createRecord');

    await act(async () => {
      const { result } = renderHook(() => usePropertyForm());
      result.current.createProperty({} as propertyModel);
    });

    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });

  test('should call the update record method of api', async () => {
    const expected = true;

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    // Creates spy for ajax method of jQuery lib
    const spyFunc = sinon.spy(propertiesApi, 'updateRecord');

    await act(async () => {
      const { result } = renderHook(() => usePropertyForm());
      result.current.updateProperty('property-1', {} as propertyModel);
    });

    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });
});
