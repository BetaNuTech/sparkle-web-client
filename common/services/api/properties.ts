import propertyModel from '../../models/property';

export default {
  update(propertyId: string, data: propertyModel): Promise<propertyModel> {
    return Promise.resolve(data);
  }
};
