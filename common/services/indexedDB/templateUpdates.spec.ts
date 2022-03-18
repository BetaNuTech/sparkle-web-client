import templateUpdates from './templateUpdates';
import TemplateModel from '../../models/template';

const TEMPLATE_ID = 'template-1';
const UPDATES = {
  name: 'template name'
} as TemplateModel;

describe('Unit | Services | indexedDB | Template Updates', () => {
  afterEach(() => templateUpdates.deleteRecord(TEMPLATE_ID));

  test('should be able to lookup a record created for a template', async () => {
    let result = null;
    const expected = TEMPLATE_ID;

    await templateUpdates.createRecord(TEMPLATE_ID, UPDATES);

    result = await templateUpdates.queryRecord({
      id: TEMPLATE_ID
    });

    const actual = result ? result.id : '';
    expect(actual).toEqual(expected);
  });

  test('should create a new record when it does not exist yet', async () => {
    const expected = TEMPLATE_ID;

    await templateUpdates.upsertRecord(TEMPLATE_ID, UPDATES);

    let result = null;
    try {
      result = await templateUpdates.queryRecord({
        id: TEMPLATE_ID
      });
    } catch (err) {
      result = err;
    }

    const actual = result ? result.id : '';
    expect(actual).toEqual(expected);
  });

  test('should update a record when it already exists', async () => {
    const expected = UPDATES.name;

    await templateUpdates.createRecord(TEMPLATE_ID, {} as TemplateModel);

    await templateUpdates.upsertRecord(TEMPLATE_ID, UPDATES);

    let result = null;
    try {
      result = await templateUpdates.queryRecord({
        id: TEMPLATE_ID
      });
    } catch (err) {
      result = err;
    }

    const actual = result?.name || null;
    expect(actual).toEqual(expected);
  });

  test('should delete a record for a given template', async () => {
    let actual = null;
    const expected = undefined;

    // Create
    await templateUpdates.createRecord(TEMPLATE_ID, {} as TemplateModel);

    // Delete
    await templateUpdates.deleteRecord(TEMPLATE_ID);

    // Lookup
    actual = await templateUpdates.queryRecord({
      id: TEMPLATE_ID
    });

    expect(actual).toEqual(expected);
  });
});
