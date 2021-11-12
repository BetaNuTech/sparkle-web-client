import update from './updateTemplateSection';
import {
  singleSection,
  originalMultiSection,
  unselectedCheckmarkItem
} from '../../../__mocks__/inspections';
import inspectionTemplateModel from '../../models/inspectionTemplate';
import inspectionTemplateItemModel from '../../models/inspectionTemplateItem';
import inspectionTemplateSectionModel from '../../models/inspectionTemplateSection';

describe('Unit | Common | Utils | Inspection | Update Template Section', () => {
  test('it should configure a cloned multi section', () => {
    const expected = {
      ...originalMultiSection,
      index: 1,
      added_multi_section: true
    };
    delete expected.id;
    const updated = {} as inspectionTemplateModel;
    const current = {} as inspectionTemplateModel;
    const sectionOne = {
      ...originalMultiSection,
      id: 'one',
      index: 0
    } as inspectionTemplateSectionModel;
    current.sections = { one: sectionOne };
    const result = update(updated, current, { cloneOf: 'one' }, 'new');
    const [actual] = Object.entries(result.sections)
      .filter(([id]) => id !== 'one')
      .map(([, s]) => s);
    expect(actual).toEqual(expected);
  });

  test('it should increment all section indexes for newly added section', () => {
    const expected = [1, 2];
    const updated = {} as inspectionTemplateModel;
    const current = {} as inspectionTemplateModel;
    const sectionOne = {
      ...originalMultiSection,
      id: 'one'
    } as inspectionTemplateSectionModel;
    const sectionTwo = {
      ...singleSection,
      id: 'two'
    } as inspectionTemplateSectionModel;
    sectionOne.index = 0;
    sectionTwo.index = 1;
    current.sections = {
      one: sectionOne,
      two: sectionTwo
    };
    const result = update(updated, current, { cloneOf: sectionOne.id }, 'new');
    const actual = Object.entries(result.sections || {}).map(
      ([, { index }]) => index
    );
    expect(actual).toEqual(expected);
  });

  test('it should clone all a source sections items', () => {
    const expected = {
      ...unselectedCheckmarkItem,
      index: 0
    };
    delete expected.id;
    delete expected.sectionId;
    const updated = {} as inspectionTemplateModel;
    const current = {} as inspectionTemplateModel;
    const sectionOne = {
      ...originalMultiSection,
      id: 'one',
      index: 0
    } as inspectionTemplateSectionModel;
    const itemOne = {
      ...unselectedCheckmarkItem,
      sectionId: 'one',
      index: 0
    } as inspectionTemplateItemModel;
    current.items = { itemOne };
    current.sections = { one: sectionOne };
    const result = update(updated, current, { cloneOf: 'one' }, 'new');
    const [actual] = Object.entries(result.items)
      .filter(([, { sectionId }]) => sectionId !== 'one')
      .map(([, s]) => s);
    delete actual.sectionId;
    expect(actual).toEqual(expected);
  });

  test('it should merge prior section updates into new updates', () => {
    const expected = 2;
    const current = {} as inspectionTemplateModel;
    const sectionOne = {
      ...originalMultiSection,
      id: 'one',
      index: 0
    } as inspectionTemplateSectionModel;
    current.sections = { one: sectionOne };
    // Clone original
    let updated = update(
      {} as inspectionTemplateModel,
      current,
      {
        cloneOf: 'one'
      },
      'new'
    );
    const [addedSectionId] = Object.entries(updated.sections)
      .filter(([id]) => id !== 'one')
      .map(([id]) => id);
    // Clone copy of original
    updated = update(updated, current, { cloneOf: addedSectionId }, 'new');
    const actual = Object.keys(updated.sections).length;
    expect(actual).toEqual(expected);
  });

  test('it should merge prior item updates into new updates', () => {
    const expected = 4;
    const current = {} as inspectionTemplateModel;
    const sectionOne = {
      ...originalMultiSection,
      id: 'one',
      index: 0
    } as inspectionTemplateSectionModel;
    const itemOne = {
      ...unselectedCheckmarkItem,
      sectionId: 'one',
      index: 0
    } as inspectionTemplateItemModel;
    const itemTwo = {
      ...unselectedCheckmarkItem,
      sectionId: 'one',
      index: 1
    } as inspectionTemplateItemModel;
    current.items = { itemOne, itemTwo };
    current.sections = { one: sectionOne };
    // Clone original
    let updated = update(
      {} as inspectionTemplateModel,
      current,
      {
        cloneOf: 'one'
      },
      'new'
    );
    const [addedSectionId] = Object.entries(updated.sections)
      .filter(([id]) => id !== 'one')
      .map(([id]) => id);
    // Clone copy of original
    updated = update(updated, current, { cloneOf: addedSectionId }, 'new');
    const actual = Object.keys(updated.items).length;
    expect(actual).toEqual(expected);
  });

  test('it should remove an added multi section', () => {
    const expected = null;
    const current = {} as inspectionTemplateModel;
    const sectionOne = {
      ...originalMultiSection,
      id: 'one',
      index: 0
    } as inspectionTemplateSectionModel;
    const sectionTwo = {
      ...originalMultiSection,
      id: 'two',
      index: 1,
      added_multi_section: true
    } as inspectionTemplateSectionModel;
    current.sections = {
      one: sectionOne,
      two: sectionTwo
    };
    const result = update({} as inspectionTemplateModel, current, null, 'two');
    const actual = (result.sections || {}).two;
    expect(actual).toEqual(expected);
  });

  test('it should ignore a removed, previously locally added, multi section from updates', () => {
    const expected = undefined;
    const current = {} as inspectionTemplateModel;
    const localUpdates = {} as inspectionTemplateModel;
    const sectionOne = {
      ...originalMultiSection,
      index: 0
    } as inspectionTemplateSectionModel;
    const sectionTwo = {
      ...originalMultiSection,
      index: 1,
      added_multi_section: true
    } as inspectionTemplateSectionModel;
    current.sections = { one: sectionOne };
    localUpdates.sections = { two: sectionTwo };
    const result = update(localUpdates, current, null, 'two');
    const actual = (result.sections || {}).two;
    expect(actual).toEqual(expected);
  });

  test('it should remove, a published, multi section from updates', () => {
    const expected = null;
    const current = {} as inspectionTemplateModel;
    const localUpdates = {} as inspectionTemplateModel;
    const sectionOne = {
      ...originalMultiSection,
      index: 0
    } as inspectionTemplateSectionModel;
    const sectionTwo = {
      ...originalMultiSection,
      index: 1,
      added_multi_section: true
    } as inspectionTemplateSectionModel;
    current.sections = { one: sectionOne, two: sectionTwo };
    const result = update(localUpdates, current, null, 'two');
    const actual = (result.sections || {}).two;
    expect(actual).toEqual(expected);
  });

  test('it should remove locally added multi section items from updates', () => {
    const expected = undefined;
    const current = {} as inspectionTemplateModel;
    const updates = {} as inspectionTemplateModel;
    const sectionOne = {
      ...originalMultiSection,
      id: 'one',
      index: 0
    } as inspectionTemplateSectionModel;
    const sectionTwo = {
      ...originalMultiSection,
      index: 1,
      added_multi_section: true
    } as inspectionTemplateSectionModel;
    const itemOne = {
      ...unselectedCheckmarkItem,
      sectionId: 'one',
      index: 0
    } as inspectionTemplateItemModel;
    const itemTwo = {
      ...unselectedCheckmarkItem,
      sectionId: 'two',
      index: 0
    } as inspectionTemplateItemModel;
    current.items = { itemOne };
    current.sections = { one: sectionOne };
    updates.items = { itemTwo };
    updates.sections = { two: sectionTwo };

    // Clone original
    const result = update(updates, current, null, 'two');
    const actual = (result.items || {}).itemTwo;
    expect(actual).toEqual(expected);
  });
});
