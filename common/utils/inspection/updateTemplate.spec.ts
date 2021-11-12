import updateTemplate, { userUpdate } from './updateTemplate';
import deepClone from '../../../__tests__/helpers/deepClone';
import {
  selectedCheckmarkItem,
  originalMultiSection
} from '../../../__mocks__/inspections';
import { templateA } from '../../../__mocks__/templates';
import inspectionTemplateModel from '../../models/inspectionTemplate';
import inspectionTemplateItemModel from '../../models/inspectionTemplateItem';
import inspectionTemplateSectionModel from '../../models/inspectionTemplateSection';

describe('Unit | Common | Utils | Inspection | Update Template', () => {
  test('it does not modify arguments', () => {
    const actual = {} as inspectionTemplateModel;
    const expected = deepClone(actual);
    const currentTemplate = deepClone(templateA) as inspectionTemplateModel;
    currentTemplate.items = {
      one: deepClone(selectedCheckmarkItem) as inspectionTemplateItemModel
    };
    const updatedSelection =
      selectedCheckmarkItem.mainInputSelection === 0 ? 1 : 0;
    const userChanges = {
      items: { one: { mainInputSelection: updatedSelection } }
    } as userUpdate;
    updateTemplate(actual, currentTemplate, userChanges);
    expect(actual).toEqual(expected);
  });

  test('it removes item updates once they no longer differ from the current state', () => {
    const currentSelection = selectedCheckmarkItem.mainInputSelection;
    const updatedSelection = currentSelection === 0 ? 1 : 0;
    const tests = [
      {
        expected: 1,
        change: { one: { mainInputSelection: updatedSelection } },
        msg: 'keeps single item update from pristine state'
      },
      {
        expected: 2,
        change: { two: { mainInputSelection: updatedSelection } },
        msg: 'keeps 2nd item update from pristine'
      },
      {
        expected: 1,
        change: { one: { mainInputSelection: currentSelection } },
        msg: 'keeps 2nd item update that still differs from pristine state'
      },
      {
        expected: 0,
        change: { two: { mainInputSelection: currentSelection } },
        msg: 'removes all item updates when same as pristine state'
      }
    ];

    const currentTemplate = deepClone(templateA) as inspectionTemplateModel;
    currentTemplate.items = {
      one: deepClone(selectedCheckmarkItem) as inspectionTemplateItemModel,
      two: deepClone(selectedCheckmarkItem) as inspectionTemplateItemModel
    };

    let updatedTemplate = {} as inspectionTemplateModel;
    for (let i = 0; i < tests.length; i += 1) {
      const { expected, change, msg } = tests[i];
      const userChanges = { items: change } as userUpdate;
      updatedTemplate = updateTemplate(
        updatedTemplate,
        currentTemplate,
        userChanges
      );
      const actual = Object.keys(updatedTemplate.items || {}).length;
      expect(actual, msg).toEqual(expected);

      if (actual === 0) {
        expect(
          updatedTemplate.items,
          'remove items hash when no item updates exist'
        ).toEqual(undefined);
      }
    }
  });

  test('it removes added section and item updates once they no longer differ from the current state', () => {
    const expected = 0;
    let updatedTemplate = {} as inspectionTemplateModel;
    const currentTemplate = deepClone(templateA) as inspectionTemplateModel;
    const sectionOne = deepClone(
      originalMultiSection
    ) as inspectionTemplateSectionModel;
    const itemOne = deepClone(
      selectedCheckmarkItem
    ) as inspectionTemplateItemModel;
    const itemTwo = deepClone(
      selectedCheckmarkItem
    ) as inspectionTemplateItemModel;
    const addMultiSection = {
      sections: { new: { cloneOf: 'one' } }
    } as userUpdate;

    itemOne.sectionId = 'one';
    itemTwo.sectionId = 'one';
    currentTemplate.items = { itemOne, itemTwo };
    currentTemplate.sections = { one: sectionOne };

    // Add cloned items
    updatedTemplate = updateTemplate(
      updatedTemplate,
      currentTemplate,
      addMultiSection
    );

    const [newSectionId] = Object.entries(updatedTemplate.sections || {})
      .filter(([id]) => id.search('item') !== 0)
      .map(([id]) => id);
    const removeAddedMultiSection = {
      sections: { [newSectionId]: null }
    };

    // Update cloned item
    updatedTemplate = updateTemplate(
      updatedTemplate,
      currentTemplate,
      removeAddedMultiSection
    );

    const actual =
      Object.keys(updatedTemplate.sections || {}).length +
      Object.keys(updatedTemplate.items || {}).length;
    expect(actual).toEqual(expected);
  });

  test('it updates a locally added multi-section item as normal', () => {
    const expected = { mainInputSelection: 0, mainInputSelected: true };
    let updatedTemplate = {} as inspectionTemplateModel;
    const currentTemplate = deepClone(templateA) as inspectionTemplateModel;
    const sectionOne = deepClone(
      originalMultiSection
    ) as inspectionTemplateSectionModel;
    const itemOne = deepClone(
      selectedCheckmarkItem
    ) as inspectionTemplateItemModel;
    const itemTwo = deepClone(
      selectedCheckmarkItem
    ) as inspectionTemplateItemModel;
    const addMultiSection = {
      sections: { new: { cloneOf: 'one' } }
    } as userUpdate;

    sectionOne.id = 'one';
    itemOne.id = 'item-one';
    itemTwo.id = 'item-two';
    itemOne.sectionId = 'one';
    itemTwo.sectionId = 'one';
    currentTemplate.items = { itemOne, itemTwo };
    currentTemplate.sections = { one: sectionOne };

    // Add cloned items
    updatedTemplate = updateTemplate(
      updatedTemplate,
      currentTemplate,
      addMultiSection
    );

    const [newItemId] = Object.entries(updatedTemplate.items || {})
      .filter(([id]) => id.search('item') !== 0)
      .map(([id]) => id);
    const changeNewItemSelection = {
      items: { [newItemId]: { mainInputSelection: 0 } }
    };

    // Update cloned item
    updatedTemplate = updateTemplate(
      updatedTemplate,
      currentTemplate,
      changeNewItemSelection
    );

    const result =
      (updatedTemplate.items || {})[newItemId] ||
      ({} as inspectionTemplateItemModel);
    const actual = {
      mainInputSelection: result.mainInputSelection,
      mainInputSelected: result.mainInputSelected
    };
    expect(actual).toEqual(expected);
  });
});
