import sinon from 'sinon';
import Router from 'next/router';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';
import propertiesApi from '../../../common/services/api/properties';
import propertyModel from '../../../common/models/property';
import currentUser from '../../../common/utils/currentUser';
import usePropertyForm from './usePropertyForm';

describe('Unit | Features | Property Edit | Hooks | Use Property Form', () => {
  afterEach(() => sinon.restore());

  test('should call the create property method of api', async () => {
    const expected = true;
    const sendNotification = sinon.spy();

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    // Creates spy for ajax method of jQuery lib
    const spyFunc = sinon.spy(propertiesApi, 'createProperty');
    sinon.stub(Router, 'push').returns();

    await act(async () => {
      const { result } = renderHook(() => usePropertyForm(sendNotification));
      result.current.propertyCreate({ name: 'test' } as propertyModel, null);
    });

    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });

  test('should call the update property method of api', async () => {
    const expected = true;
    const sendNotification = sinon.spy();

    sinon.stub(currentUser, 'getIdToken').callsFake(() => true);

    // Creates spy for ajax method of jQuery lib
    const spyFunc = sinon.spy(propertiesApi, 'updateProperty');

    await act(async () => {
      const { result } = renderHook(() => usePropertyForm(sendNotification));
      result.current.propertyUpdate(
        'property-1',
        {
          name: 'test'
        } as propertyModel,
        null
      );
    });

    const actual = spyFunc.called;
    expect(actual).toEqual(expected);
  });
});
