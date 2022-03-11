import TemplateModel from '../../models/template';
import updateGeneral from './updateGeneral';
import { emptyTemplate } from '../../../__mocks__/templates';

describe('Unit | Common | Utils | Template | Update General', () => {
  test('it sets an template name', () => {
    const tests = [
      {
        expected: undefined,
        currentItem: emptyTemplate,
        userChanges: { description: 'template description' },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        currentItem: emptyTemplate,
        userChanges: { name: '' },
        msg: 'ignores changing empty text input to an empty value'
      },
      {
        expected: 'test',
        currentItem: emptyTemplate,
        updatedItem: { name: 'test' },
        userChanges: { description: 'template description ' },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 'test',
        currentItem: emptyTemplate,
        userChanges: { name: 'test' },
        msg: 'adds name to updates'
      },
      {
        expected: 'new',
        currentItem: emptyTemplate,
        updatedItem: { name: 'old' },
        userChanges: { name: ' new ' }, // check whitespace padding removed
        msg: 'updates over previously updated name'
      },
      {
        expected: undefined,
        currentItem: emptyTemplate,
        updatedItem: { name: 'update' },
        userChanges: { name: '' },
        msg: 'removes previously updated name back to empty original state'
      },
      {
        expected: undefined,
        currentItem: { ...emptyTemplate, name: 'initial' },
        updatedItem: { name: 'update' },
        userChanges: { name: 'initial' },
        msg: 'removes previously updated name back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const {
        expected,
        currentItem,
        updatedItem = {},
        userChanges,
        msg
      } = tests[i];
      const result = updateGeneral(
        updatedItem as TemplateModel,
        currentItem,
        userChanges
      );
      const actual = result ? result.name : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets an template description', () => {
    const tests = [
      {
        expected: undefined,
        currentItem: emptyTemplate,
        userChanges: { name: 'template name' },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        currentItem: emptyTemplate,
        userChanges: { description: '' },
        msg: 'ignores changing empty text input to an empty value'
      },
      {
        expected: 'test',
        currentItem: emptyTemplate,
        updatedItem: { description: 'test' },
        userChanges: { name: 'template name' },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 'test',
        currentItem: emptyTemplate,
        userChanges: { description: 'test' },
        msg: 'adds name to updates'
      },
      {
        expected: 'new',
        currentItem: emptyTemplate,
        updatedItem: { description: 'old' },
        userChanges: { description: ' new ' }, // check whitespace padding removed
        msg: 'updates over previously updated description'
      },
      {
        expected: undefined,
        currentItem: emptyTemplate,
        updatedItem: { description: 'update' },
        userChanges: { description: '' },
        msg: 'removes previously updated description back to empty original state'
      },
      {
        expected: undefined,
        currentItem: { ...emptyTemplate, description: 'initial' },
        updatedItem: { description: 'update' },
        userChanges: { description: 'initial' },
        msg: 'removes previously updated description back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const {
        expected,
        currentItem,
        updatedItem = {},
        userChanges,
        msg
      } = tests[i];
      const result = updateGeneral(
        updatedItem as TemplateModel,
        currentItem,
        userChanges
      );
      const actual = result ? result.description : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets an template category', () => {
    const tests = [
      {
        expected: undefined,
        currentItem: emptyTemplate,
        userChanges: { name: 'template name' },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        currentItem: emptyTemplate,
        userChanges: { category: '' },
        msg: 'ignores changing empty text input to an empty value'
      },
      {
        expected: 'category-1',
        currentItem: emptyTemplate,
        updatedItem: { category: 'category-1' },
        userChanges: { name: 'template name' },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 'category-1',
        currentItem: emptyTemplate,
        userChanges: { category: 'category-1' },
        msg: 'adds name to updates'
      },
      {
        expected: 'category-1',
        currentItem: emptyTemplate,
        updatedItem: { category: 'old' },
        userChanges: { category: 'category-1' }, // check whitespace padding removed
        msg: 'updates over previously updated category'
      },
      {
        expected: undefined,
        currentItem: emptyTemplate,
        updatedItem: { category: 'update' },
        userChanges: { category: '' },
        msg: 'removes previously updated category back to empty original state'
      },
      {
        expected: undefined,
        currentItem: { ...emptyTemplate, category: 'category-1' },
        updatedItem: { category: 'category-2' },
        userChanges: { category: 'category-1' },
        msg: 'removes previously updated category back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const {
        expected,
        currentItem,
        updatedItem = {},
        userChanges,
        msg
      } = tests[i];
      const result = updateGeneral(
        updatedItem as TemplateModel,
        currentItem,
        userChanges
      );
      const actual = result ? result.category : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets value for track deficient item', () => {
    const tests = [
      {
        expected: undefined,
        currentItem: emptyTemplate,
        userChanges: { name: 'template name' },
        msg: 'ignores unrelated update'
      },
      {
        expected: true,
        currentItem: emptyTemplate,
        updatedItem: { trackDeficientItems: true },
        userChanges: { name: 'template name' },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: true,
        currentItem: emptyTemplate,
        userChanges: { trackDeficientItems: true },
        msg: 'adds track deficient item value to updates'
      },
      {
        expected: undefined,
        currentItem: { ...emptyTemplate, trackDeficientItems: true },
        updatedItem: { trackDeficientItems: false },
        userChanges: { trackDeficientItems: true },
        msg: 'removes previously updated track deficient item value back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const {
        expected,
        currentItem,
        updatedItem = {},
        userChanges,
        msg
      } = tests[i];
      const result = updateGeneral(
        updatedItem as TemplateModel,
        currentItem,
        userChanges
      );
      const actual = result ? result.trackDeficientItems : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets value for require deficient item note and photo', () => {
    const tests = [
      {
        expected: undefined,
        currentItem: emptyTemplate,
        userChanges: { name: 'template name' },
        msg: 'ignores unrelated update'
      },
      {
        expected: true,
        currentItem: emptyTemplate,
        updatedItem: { requireDeficientItemNoteAndPhoto: true },
        userChanges: { name: 'template name' },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: true,
        currentItem: emptyTemplate,
        userChanges: { requireDeficientItemNoteAndPhoto: true },
        msg: 'adds require deficient item note and photo value to updates'
      },
      {
        expected: undefined,
        currentItem: {
          ...emptyTemplate,
          requireDeficientItemNoteAndPhoto: true
        },
        updatedItem: { requireDeficientItemNoteAndPhoto: false },
        userChanges: { requireDeficientItemNoteAndPhoto: true },
        msg: 'removes previously updated require deficient item note and photo value back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const {
        expected,
        currentItem,
        updatedItem = {},
        userChanges,
        msg
      } = tests[i];
      const result = updateGeneral(
        updatedItem as TemplateModel,
        currentItem,
        userChanges
      );
      const actual = result
        ? result.requireDeficientItemNoteAndPhoto
        : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  // eslint-disable-next-line max-len
  test('it sets truthy value for track deficient item when require deficient item note and photo updated with truthy value', () => {
    const result = updateGeneral({} as TemplateModel, emptyTemplate, {
      requireDeficientItemNoteAndPhoto: true
    });
    const trackDeficientItemsValue = result.trackDeficientItems;
    const requireDeficientItemNoteAndPhotoValue =
      result.requireDeficientItemNoteAndPhoto;
    expect(trackDeficientItemsValue).toBeTruthy();
    expect(requireDeficientItemNoteAndPhotoValue).toBeTruthy();
  });

  // eslint-disable-next-line max-len
  test('it does not update value for track deficient item when require deficient item note and photo updated with falsy value', () => {
    const result = updateGeneral(
      {
        requireDeficientItemNoteAndPhoto: true,
        trackDeficientItems: true
      } as TemplateModel,
      emptyTemplate,
      {
        requireDeficientItemNoteAndPhoto: false
      }
    );
    const trackDeficientItemsValue = result.trackDeficientItems;
    const requireDeficientItemNoteAndPhotoValue =
      result.requireDeficientItemNoteAndPhoto;
    expect(trackDeficientItemsValue).toBeTruthy();
    expect(requireDeficientItemNoteAndPhotoValue).toBeFalsy();
  });

  // eslint-disable-next-line max-len
  test('it sets truthy value for require deficient item note and photo when track deficient item updated with truthy value', () => {
    const result = updateGeneral({} as TemplateModel, emptyTemplate, {
      trackDeficientItems: true
    });
    const trackDeficientItemsValue = result.trackDeficientItems;
    const requireDeficientItemNoteAndPhotoValue =
      result.requireDeficientItemNoteAndPhoto;
    expect(trackDeficientItemsValue).toBeTruthy();
    expect(requireDeficientItemNoteAndPhotoValue).toBeTruthy();
  });

  // eslint-disable-next-line max-len
  test('it does not update value for require deficient item note and photo when track deficient item updated with falsy value', () => {
    const result = updateGeneral(
      {
        requireDeficientItemNoteAndPhoto: true,
        trackDeficientItems: true
      } as TemplateModel,
      emptyTemplate,
      {
        trackDeficientItems: false
      }
    );
    const trackDeficientItemsValue = result.trackDeficientItems;
    const requireDeficientItemNoteAndPhotoValue =
      result.requireDeficientItemNoteAndPhoto;
    expect(trackDeficientItemsValue).toBeFalsy();
    expect(requireDeficientItemNoteAndPhotoValue).toBeTruthy();
  });
});
