import inspectionTemplateUpdates from './inspectionTemplateUpdates';
import inspectionTemplateItemModel from '../../models/inspectionTemplateItem';
import inspectionTemplateModel from '../../models/inspectionTemplate';
import { unselectedCheckmarkItem } from '../../../__mocks__/inspections';

const PROPERTY_ID = '123';
const INSPECTION_ID = '456';
const UPDATED_TEMPLATE = Object.freeze({
  items: {
    [unselectedCheckmarkItem.id]: {
      mainInputSelection: 0,
      mainInputSelected: true
    } as inspectionTemplateItemModel
  }
}) as inspectionTemplateModel;

describe('Unit | Services | indexedDB | Inspection Template Updates', () => {
  afterEach(() =>
    inspectionTemplateUpdates.deleteRecordForInspection(INSPECTION_ID)
  );

  test('should be able to lookup a record created for an inspection', async () => {
    let result = null;
    const expected = INSPECTION_ID;

    await inspectionTemplateUpdates.createRecord(
      PROPERTY_ID,
      INSPECTION_ID,
      UPDATED_TEMPLATE
    );

    result = await inspectionTemplateUpdates.queryRecord({
      inspection: INSPECTION_ID
    });

    const actual = result ? result.inspection : '';
    expect(actual).toEqual(expected);
  });

  test('should create a new record when it does not exist yet', async () => {
    const expected = INSPECTION_ID;

    await inspectionTemplateUpdates.upsertRecord(
      PROPERTY_ID,
      INSPECTION_ID,
      UPDATED_TEMPLATE
    );

    let result = null;
    try {
      result = await inspectionTemplateUpdates.queryRecord({
        inspection: INSPECTION_ID
      });
    } catch (err) {
      result = err;
    }

    const actual = result ? result.inspection : '';
    expect(actual).toEqual(expected);
  });

  test('should update a record when it already exists', async () => {
    const expected = UPDATED_TEMPLATE;

    await inspectionTemplateUpdates.createRecord(
      PROPERTY_ID,
      INSPECTION_ID,
      {}
    );

    await inspectionTemplateUpdates.upsertRecord(
      PROPERTY_ID,
      INSPECTION_ID,
      UPDATED_TEMPLATE
    );

    let result = null;
    try {
      result = await inspectionTemplateUpdates.queryRecord({
        inspection: INSPECTION_ID
      });
    } catch (err) {
      result = err;
    }

    const actual = result ? result.template : null;
    expect(actual).toEqual(expected);
  });

  test('should delete a record for a given inspection', async () => {
    let actual = null;
    const expected = undefined;

    // Create
    await inspectionTemplateUpdates.createRecord(
      PROPERTY_ID,
      INSPECTION_ID,
      {}
    );

    // Delete
    await inspectionTemplateUpdates.deleteRecordForInspection(INSPECTION_ID);

    // Lookup
    actual = await inspectionTemplateUpdates.queryRecord({
      inspection: INSPECTION_ID
    });

    expect(actual).toEqual(expected);
  });
});
