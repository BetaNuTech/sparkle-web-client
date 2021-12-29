import sinon from 'sinon';
import inspectionTemplateUpdates from './inspectionTemplateUpdates';
import inspectionTemplateItemModel from '../../models/inspectionTemplateItem';
import inspectionTemplateModel from '../../models/inspectionTemplate';
import {
  unselectedCheckmarkItem,
  unselectedThumbsItem
} from '../../../__mocks__/inspections';

describe('Unit | Services | indexedDB | Inspection Template Updates', () => {
  afterEach(() => sinon.restore());

  test('should call get and return template updates data for inspection from indexedDB ', async () => {
    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionTemplateUpdates.getRecord('inspection-1');
    } catch (err) {
      result = err;
    }
    expect(result).toBeUndefined();
  });

  test('should call method to add inspection template update and return last inserted id', async () => {
    const updatedTemplate = {
      items: {
        [unselectedCheckmarkItem.id]: {
          mainInputSelection: 0,
          mainInputSelected: true
        } as inspectionTemplateItemModel
      }
    } as inspectionTemplateModel;
    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionTemplateUpdates.createRecord(
        updatedTemplate,
        'property-1',
        'inspection-1'
      );
    } catch (err) {
      result = err;
    }

    expect(result).toBeTruthy();
    expect(result).toHaveLength(20);
  });

  test('should return template updates data added in indexed db', async () => {
    let result = null;

    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionTemplateUpdates.getRecord('inspection-1');
    } catch (err) {
      result = err;
    }
    expect(result.inspection).toEqual('inspection-1');
  });

  test('should update template updates record in indexed db', async () => {
    const updatedTemplate = {
      items: {
        [unselectedCheckmarkItem.id]: {
          mainInputSelection: 1,
          mainInputSelected: true
        } as inspectionTemplateItemModel,
        [unselectedThumbsItem.id]: {
          mainInputSelection: 1,
          mainInputSelected: true
        } as inspectionTemplateItemModel
      }
    } as inspectionTemplateModel;

    const expected = 2;

    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionTemplateUpdates.getRecord('inspection-1');
    } catch (err) {
      result = err;
    }
    // eslint-disable-next-line import/no-named-as-default-member
    await inspectionTemplateUpdates.updateRecord(updatedTemplate, result.id);

    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionTemplateUpdates.getRecord('inspection-1');
    } catch (err) {
      result = err;
    }

    const itemsCount = Object.keys(result.template.items || {}).length;
    expect(result.inspection).toEqual('inspection-1');
    expect(itemsCount).toEqual(expected);
  });

  test('should delete template update record previously added in indexed db', async () => {
    let result = null;
    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionTemplateUpdates.getRecord('inspection-1');
    } catch (err) {
      result = err;
    }

    // eslint-disable-next-line import/no-named-as-default-member
    await inspectionTemplateUpdates.deleteRecord(result.id);

    try {
      // eslint-disable-next-line import/no-named-as-default-member
      result = await inspectionTemplateUpdates.getRecord('inspection-1');
    } catch (err) {
      result = err;
    }
    expect(result).toBeUndefined();
  });
});
