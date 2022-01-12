import update from './updateTemplateSection';
import {
  singleSection,
  originalMultiSection,
  unselectedCheckmarkItem
} from '../../../__mocks__/inspections';
import inspectionTemplateUpdateModel from '../../models/inspections/templateUpdate';
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
    const updated = {} as inspectionTemplateUpdateModel;
    const current = {} as inspectionTemplateUpdateModel;
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

  test('it should increment all section indexes after a newly added section', () => {
    const expected = [1, 2];
    const updated = {} as inspectionTemplateUpdateModel;
    const current = {} as inspectionTemplateUpdateModel;
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
    const actual = Object.entries(result.sections || {})
      .map(([, section]) => section as inspectionTemplateSectionModel)
      .map(({ index }) => index);

    expect(actual).toEqual(expected);
  });

  test('it should clone all a source sections items', () => {
    const expected = {
      ...unselectedCheckmarkItem,
      index: 0
    };
    delete expected.id;
    delete expected.sectionId;
    const updated = {} as inspectionTemplateUpdateModel;
    const current = {} as inspectionTemplateUpdateModel;
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
      .map(([, item]) => item as inspectionTemplateItemModel)
      .filter(({ sectionId }) => sectionId !== 'one');

    delete actual.sectionId;
    expect(actual).toEqual(expected);
  });

  test('it should merge prior section updates into new updates', () => {
    const expected = 2;
    const current = {} as inspectionTemplateUpdateModel;
    const sectionOne = {
      ...originalMultiSection,
      id: 'one',
      index: 0
    } as inspectionTemplateSectionModel;
    current.sections = { one: sectionOne };
    // Clone original
    let updated = update(
      {} as inspectionTemplateUpdateModel,
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
    const current = {} as inspectionTemplateUpdateModel;
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
      {} as inspectionTemplateUpdateModel,
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
    const current = {} as inspectionTemplateUpdateModel;
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
    const result = update(
      {} as inspectionTemplateUpdateModel,
      current,
      null,
      'two'
    );
    const actual = (result.sections || {}).two;
    expect(actual).toEqual(expected);
  });

  test('it should ignore a removed, previously locally added, multi section from updates', () => {
    const expected = undefined;
    const current = {} as inspectionTemplateUpdateModel;
    const localUpdates = {} as inspectionTemplateUpdateModel;
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
    const current = {} as inspectionTemplateUpdateModel;
    const localUpdates = {} as inspectionTemplateUpdateModel;
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
    const current = {} as inspectionTemplateUpdateModel;
    const updates = {} as inspectionTemplateUpdateModel;
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

    const result = update(updates, current, null, 'two');
    const actual = (result.items || {}).itemTwo;
    expect(actual).toEqual(expected);
  });

  test('it should remove previously incremented sections from updates after a local multi section was removed', () => {
    const expected = undefined;
    const current = {} as inspectionTemplateUpdateModel;
    let updates = {} as inspectionTemplateUpdateModel;
    const sectionOne = {
      ...originalMultiSection,
      id: 'one',
      index: 0
    } as inspectionTemplateSectionModel;
    const sectionTwo = {
      ...singleSection,
      index: 1
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
    current.items = { itemOne, itemTwo };
    current.sections = { one: sectionOne, two: sectionTwo };

    // Add new multi-section, incrementing section two's index
    updates = update(updates, current, { cloneOf: sectionOne.id }, 'new');
    const addedSectionId = Object.keys(updates.sections || {}).find(
      (id) => id !== 'two'
    );

    // Remove added multi-section
    const result = update(updates, current, null, addedSectionId);

    // Lookup section two's updates
    const actual = (result.sections || {}).two;
    expect(actual).toEqual(expected);
  });

  test('it should add a second multi-section after its cloned section', () => {
    const expected = { A: 1, B: 3 };
    const current = {} as inspectionTemplateUpdateModel;
    let updates = {} as inspectionTemplateUpdateModel;
    const sectionOne = {
      ...originalMultiSection,
      id: 'one',
      title: 'A',
      index: 0
    } as inspectionTemplateSectionModel;
    const sectionTwo = {
      ...originalMultiSection,
      id: 'two',
      title: 'B',
      index: 1
    } as inspectionTemplateSectionModel;
    const sectionOneItem = {
      ...unselectedCheckmarkItem,
      sectionId: 'one',
      index: 0
    } as inspectionTemplateItemModel;
    const sectionTwoItem = {
      ...unselectedCheckmarkItem,
      sectionId: 'two',
      index: 0
    } as inspectionTemplateItemModel;
    current.items = { sectionOneItem, sectionTwoItem };
    current.sections = { one: sectionOne, two: sectionTwo };
    updates.items = {};
    updates.sections = {};

    // Add 3rd section, cloned from one
    updates = update(updates, current, { cloneOf: 'one' }, 'new');

    // Add 4th section, cloned from two
    updates = update(updates, current, { cloneOf: 'two' }, 'new');

    // Collection all local section index updates
    const actual = Object.keys(updates.sections || {})
      .map((id) => ({ ...updates.sections[id], id }))
      .filter((section) => section.added_multi_section)
      .reduce((acc, section) => {
        acc[section.title] = section.index;
        return acc;
      }, {});
    expect(actual).toEqual(expected);
  });
});
