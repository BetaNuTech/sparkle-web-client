import { useState } from 'react';
import propertiesApi from '../../../common/services/api/properties';
import propertyModel from '../../../common/models/property';

const PREFIX = 'features: EditProperty: hooks: usePropertyForm:';
export interface PropertyApiResult {
  isLoading: boolean;
  statusCode: number;
  response: any;
}

interface usePropertyFormResult {
  apiState: PropertyApiResult;
  createProperty(property: propertyModel): Promise<PropertyApiResult>;
  updateProperty(
    propertyId: string,
    property: propertyModel
  ): Promise<PropertyApiResult>;
  error: Error;
}

export default function usePropertyForm(): usePropertyFormResult {
  const [apiState, setApiState] = useState({
    isLoading: false,
    statusCode: 0,
    response: null
  });
  const [error, setError] = useState(null);

  const createProperty = async (
    property: propertyModel
  ): Promise<PropertyApiResult> => {
    setApiState({
      isLoading: true,
      statusCode: 0,
      response: null
    });

    let res = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      res = await propertiesApi.createRecord(property);
    } catch (err) {
      setError(Error(`${PREFIX} createProperty: request failed: ${err}`));
    }

    let json = null;
    try {
      json = await res.json();
    } catch (err) {
      setError(Error(`${PREFIX} createProperty: failed to parse JSON: ${err}`));
    }

    // API State does not sync right away
    const result = {
      isLoading: false,
      statusCode: res ? res.status : 0,
      response: json
    };
    setApiState(result);
    return result;
  };

  const updateProperty = async (
    propertyId: string,
    property: propertyModel
  ): Promise<PropertyApiResult> => {
    setApiState({
      isLoading: true,
      statusCode: 0,
      response: null
    });

    let res = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      res = await propertiesApi.updateRecord(propertyId, property);
    } catch (err) {
      setError(Error(`${PREFIX} updateProperty: request failed: ${err}`));
    }

    let json = null;
    try {
      json = await res.json();
    } catch (err) {
      setError(Error(`${PREFIX} updateProperty: failed to parse JSON: ${err}`));
    }

    // API State does not sync right away
    const result = {
      isLoading: false,
      statusCode: res ? res.status : 0,
      response: json
    };
    setApiState(result);
    return result;
  };

  return { apiState, createProperty, updateProperty, error };
}
