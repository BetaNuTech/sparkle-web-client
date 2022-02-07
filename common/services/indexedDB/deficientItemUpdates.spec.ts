import deficientItemUpdates from './deficientItemUpdates';
import DeficientItem from '../../models/deficientItem';

const PROPERTY_ID = '123';
const INSPECTION_ID = '456';
const DEFICIENCY_ID = '789';
const UPDATES = {
  currentPlanToFix: 'current plan to fix'
} as DeficientItem;

describe('Unit | Services | indexedDB | Deficient Item Updates', () => {
  afterEach(() => deficientItemUpdates.deleteRecord(DEFICIENCY_ID));

  test('should be able to lookup a record created for a deficiency', async () => {
    let result = null;
    const expected = DEFICIENCY_ID;

    await deficientItemUpdates.createRecord(
      PROPERTY_ID,
      DEFICIENCY_ID,
      INSPECTION_ID,
      UPDATES
    );

    result = await deficientItemUpdates.queryRecord({
      deficiency: DEFICIENCY_ID
    });

    const actual = result ? result.deficiency : '';
    expect(actual).toEqual(expected);
  });

  test('should create a new record when it does not exist yet', async () => {
    const expected = DEFICIENCY_ID;

    await deficientItemUpdates.upsertRecord(
      PROPERTY_ID,
      DEFICIENCY_ID,
      INSPECTION_ID,
      UPDATES
    );

    let result = null;
    try {
      result = await deficientItemUpdates.queryRecord({
        deficiency: DEFICIENCY_ID
      });
    } catch (err) {
      result = err;
    }

    const actual = result ? result.deficiency : '';
    expect(actual).toEqual(expected);
  });

  test('should update a record when it already exists', async () => {
    const expected = UPDATES.currentPlanToFix;

    await deficientItemUpdates.createRecord(
      PROPERTY_ID,
      DEFICIENCY_ID,
      INSPECTION_ID,
      {} as DeficientItem
    );

    await deficientItemUpdates.upsertRecord(
      PROPERTY_ID,
      DEFICIENCY_ID,
      INSPECTION_ID,
      UPDATES
    );

    let result = null;
    try {
      result = await deficientItemUpdates.queryRecord({
        deficiency: DEFICIENCY_ID
      });
    } catch (err) {
      result = err;
    }

    const actual = result?.currentPlanToFix || null;
    expect(actual).toEqual(expected);
  });

  test('should delete a record for a given deficiency', async () => {
    let actual = null;
    const expected = undefined;

    // Create
    await deficientItemUpdates.createRecord(
      PROPERTY_ID,
      DEFICIENCY_ID,
      INSPECTION_ID,
      {} as DeficientItem
    );

    // Delete
    await deficientItemUpdates.deleteRecord(DEFICIENCY_ID);

    // Lookup
    actual = await deficientItemUpdates.queryRecord({
      deficiency: DEFICIENCY_ID
    });

    expect(actual).toEqual(expected);
  });
});
