import updateTemplate, { userUpdate } from './updateTemplate';
import deepClone from '../../../__tests__/helpers/deepClone';
import { selectedCheckmarkItem } from '../../../__mocks__/inspections';
import { templateA } from '../../../__mocks__/templates';
import inspectionTemplateModel from '../../models/inspectionTemplate';
import inspectionTemplateItemModel from '../../models/inspectionTemplateItem';

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
});
