import moment from 'moment';
import createDeficientItem from '../../../__tests__/helpers/createDeficientItem';
import DeficientItemModel from '../../models/deficientItem';
import { deficientItemResponsibilityGroups } from '../../../config/deficientItems';
import updateItem from './update'; // using main update method
import DeficientItemCompletedPhoto from '../../models/deficientItems/deficientItemCompletedPhoto';

describe('Unit | Common | Utils | Defifcient Item | Update', () => {
  test('it sets an items current due date', () => {
    const currentDueDate = moment().add(2, 'days').unix();
    const tests = [
      {
        expected: undefined,
        item: createDeficientItem({ state: 'requires-action' }),
        change: { planToFix: 'current plan to fix' },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        item: createDeficientItem({ state: 'requires-action' }),
        change: { currentDueDate: 0 },
        msg: 'ignores changing to invalid date'
      },
      {
        expected: currentDueDate,
        item: createDeficientItem({ state: 'requires-action' }),
        previous: { currentDueDate },
        change: { planToFix: 'current plan to fix' },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: currentDueDate,
        item: createDeficientItem({ state: 'requires-action' }),
        change: { currentDueDate },
        msg: 'adds current due date to item'
      },

      {
        expected: undefined,
        item: createDeficientItem({ state: 'requires-action', currentDueDate }),
        previous: { currentDueDate: moment().add(3, 'days').unix() },
        change: { currentDueDate },
        msg: 'removes previously updated due date value back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = item;
      const updatedItem = previous;
      const userChanges = change;
      const result = updateItem(
        updatedItem as DeficientItemModel,
        currentItem,
        userChanges
      );
      const actual = result ? result.currentDueDate : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets an items current deferred date', () => {
    const currentDueDate = moment().add(2, 'days').unix();
    const tests = [
      {
        expected: undefined,
        item: createDeficientItem({ state: 'requires-action' }),
        change: { planToFix: 'current plan to fix' },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        item: createDeficientItem({ state: 'requires-action' }),
        change: { currentDueDate: 0 },
        msg: 'ignores changing to invalid date'
      },
      {
        expected: currentDueDate,
        item: createDeficientItem({ state: 'requires-action' }),
        previous: { currentDueDate },
        change: { planToFix: 'current plan to fix' },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: currentDueDate,
        item: createDeficientItem({ state: 'requires-action' }),
        change: { currentDueDate },
        msg: 'adds current deferred date to item'
      },

      {
        expected: undefined,
        item: createDeficientItem({ state: 'requires-action', currentDueDate }),
        previous: { currentDueDate: moment().add(3, 'days').unix() },
        change: { currentDueDate },
        msg: 'removes previously updated current deferred date value back to original truthy state'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, item, previous = {}, change, msg } = tests[i];
      const currentItem = item;
      const updatedItem = previous;
      const userChanges = change;
      const result = updateItem(
        updatedItem as DeficientItemModel,
        currentItem,
        userChanges
      );
      const actual = result ? result.currentDueDate : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets an items plan to fix value', () => {
    const tests = [
      {
        expected: undefined,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        userChanges: { progressNote: 'progress note' },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        userChanges: { currentPlanToFix: '' },
        msg: 'ignores changing empty text input to an empty value'
      },
      {
        expected: 'test',
        currentItem: createDeficientItem({ state: 'requires-action' }),
        updatedItem: { currentPlanToFix: 'test' },
        userChanges: { progressNote: 'progress note' },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 'test',
        currentItem: createDeficientItem({ state: 'requires-action' }),
        userChanges: { currentPlanToFix: 'test' },
        msg: 'adds current plan to fix value to an empty item'
      },
      {
        expected: 'new',
        currentItem: createDeficientItem({ state: 'requires-action' }),
        updatedItem: { currentPlanToFix: 'old' },
        userChanges: { currentPlanToFix: ' new ' }, // check whitespace padding removed
        msg: 'updates over previously updated current plan to fix value'
      },
      {
        expected: undefined,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        updatedItem: { currentPlanToFix: 'update' },
        userChanges: { currentPlanToFix: '' },
        msg: 'removes previously updated current plan to fix value back to empty original state'
      },
      {
        expected: undefined,
        currentItem: createDeficientItem({
          state: 'requires-action',
          currentPlanToFix: 'initial'
        }),
        updatedItem: { currentPlanToFix: 'update' },
        userChanges: { currentPlanToFix: 'initial' },
        msg: 'removes previously updated current plan to fix value back to original truthy state'
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
      const result = updateItem(
        updatedItem as DeficientItemModel,
        currentItem,
        userChanges
      );
      const actual = result ? result.currentPlanToFix : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets an items current responsibility group value', () => {
    const tests = [
      {
        expected: undefined,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        userChanges: { progressNote: 'progress note' },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        userChanges: { currentResponsibilityGroup: '' },
        msg: 'ignores changing empty text input to an empty value'
      },
      {
        expected: deficientItemResponsibilityGroups[0].value,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        updatedItem: {
          currentResponsibilityGroup: deficientItemResponsibilityGroups[0].value
        },
        userChanges: { progressNote: 'progress note' },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: deficientItemResponsibilityGroups[0].value,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        userChanges: {
          currentResponsibilityGroup: deficientItemResponsibilityGroups[0].value
        },
        msg: 'adds current responsibility group value to an empty item'
      },
      {
        expected: undefined,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        updatedItem: {
          currentResponsibilityGroup: deficientItemResponsibilityGroups[0].value
        },
        userChanges: { currentResponsibilityGroup: '' },
        msg: 'removes previously updated current responsibility group value back to empty original state'
      },
      {
        expected: undefined,
        currentItem: createDeficientItem({
          state: 'requires-action',
          currentResponsibilityGroup: deficientItemResponsibilityGroups[0].value
        }),
        updatedItem: {
          currentResponsibilityGroup: deficientItemResponsibilityGroups[1].value
        },
        userChanges: {
          currentResponsibilityGroup: deficientItemResponsibilityGroups[0].value
        },
        msg: 'removes previously updated current responsibility group value back to original truthy state'
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
      const result = updateItem(
        updatedItem as DeficientItemModel,
        currentItem,
        userChanges
      );
      const actual = result ? result.currentResponsibilityGroup : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets an items progress note value', () => {
    const tests = [
      {
        expected: undefined,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        userChanges: { currentPlanToFix: 'plan to fix' },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        userChanges: { progressNote: '' },
        msg: 'ignores changing empty text input to an empty value'
      },
      {
        expected: 'test',
        currentItem: createDeficientItem({ state: 'requires-action' }),
        updatedItem: { progressNote: 'test' },
        userChanges: { currentPlanToFix: 'plan to fix' },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 'test',
        currentItem: createDeficientItem({ state: 'requires-action' }),
        userChanges: { progressNote: 'test' },
        msg: 'adds progress note value to an empty item'
      },
      {
        expected: 'new',
        currentItem: createDeficientItem({ state: 'requires-action' }),
        updatedItem: { progressNote: 'old' },
        userChanges: { progressNote: ' new ' }, // check whitespace padding removed
        msg: 'updates over previously updated progress note value'
      },
      {
        expected: undefined,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        updatedItem: { progressNote: 'update' },
        userChanges: { progressNote: '' },
        msg: 'removes previously updated progress note value back to empty original state'
      },
      {
        expected: undefined,
        currentItem: createDeficientItem({
          state: 'requires-action',
          progressNote: 'initial'
        }),
        updatedItem: { progressNote: 'update' },
        userChanges: { progressNote: 'initial' },
        msg: 'removes previously updated progress note value back to original truthy state'
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
      const result = updateItem(
        updatedItem as DeficientItemModel,
        currentItem,
        userChanges
      );
      const actual = result ? result.progressNote : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets an items current reason incomplete value', () => {
    const tests = [
      {
        expected: undefined,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        userChanges: { currentPlanToFix: 'plan to fix' },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        userChanges: { currentReasonIncomplete: '' },
        msg: 'ignores changing empty text input to an empty value'
      },
      {
        expected: 'test',
        currentItem: createDeficientItem({ state: 'requires-action' }),
        updatedItem: { currentReasonIncomplete: 'test' },
        userChanges: { currentPlanToFix: 'plan to fix' },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 'test',
        currentItem: createDeficientItem({ state: 'requires-action' }),
        userChanges: { currentReasonIncomplete: 'test' },
        msg: 'adds current reason incomplete value to an empty item'
      },
      {
        expected: 'new',
        currentItem: createDeficientItem({ state: 'requires-action' }),
        updatedItem: { currentReasonIncomplete: 'old' },
        userChanges: { currentReasonIncomplete: ' new ' }, // check whitespace padding removed
        msg: 'updates over previously updated current reason incomplete value'
      },
      {
        expected: undefined,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        updatedItem: { currentReasonIncomplete: 'update' },
        userChanges: { currentReasonIncomplete: '' },
        msg: 'removes previously updated current reason incomplete value back to empty original state'
      },
      {
        expected: undefined,
        currentItem: createDeficientItem({
          state: 'requires-action',
          currentReasonIncomplete: 'initial'
        }),
        updatedItem: { currentReasonIncomplete: 'update' },
        userChanges: { currentReasonIncomplete: 'initial' },
        msg: 'removes previously updated current reason incomplete value back to original truthy state'
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
      const result = updateItem(
        updatedItem as DeficientItemModel,
        currentItem,
        userChanges
      );
      const actual = result ? result.currentReasonIncomplete : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets an items current complete now reason value', () => {
    const tests = [
      {
        expected: undefined,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        userChanges: { currentPlanToFix: 'plan to fix' },
        msg: 'ignores unrelated update'
      },
      {
        expected: undefined,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        userChanges: { currentCompleteNowReason: '' },
        msg: 'ignores changing empty text input to an empty value'
      },
      {
        expected: 'test',
        currentItem: createDeficientItem({ state: 'requires-action' }),
        updatedItem: { currentCompleteNowReason: 'test' },
        userChanges: { currentPlanToFix: 'plan to fix' },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: 'test',
        currentItem: createDeficientItem({ state: 'requires-action' }),
        userChanges: { currentCompleteNowReason: 'test' },
        msg: 'adds current complete now reason value to an empty item'
      },
      {
        expected: 'new',
        currentItem: createDeficientItem({ state: 'requires-action' }),
        updatedItem: { currentCompleteNowReason: 'old' },
        userChanges: { currentCompleteNowReason: ' new ' }, // check whitespace padding removed
        msg: 'updates over previously updated current complete now reason value'
      },
      {
        expected: undefined,
        currentItem: createDeficientItem({ state: 'requires-action' }),
        updatedItem: { currentCompleteNowReason: 'update' },
        userChanges: { currentCompleteNowReason: '' },
        msg: 'removes previously updated current complete now reason value back to empty original state'
      },
      {
        expected: undefined,
        currentItem: createDeficientItem({
          state: 'requires-action',
          currentCompleteNowReason: 'initial'
        }),
        updatedItem: { currentCompleteNowReason: 'update' },
        userChanges: { currentCompleteNowReason: 'initial' },
        msg: 'removes previously updated current complete now reason value back to original truthy state'
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
      const result = updateItem(
        updatedItem as DeficientItemModel,
        currentItem,
        userChanges
      );
      const actual = result ? result.currentCompleteNowReason : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it adds a photo to completed photos', () => {
    const imgOnlyAdd = {
      downloadURL: 'url.com/img.jpg'
    } as DeficientItemCompletedPhoto;
    const imgCaptionAdd = {
      downloadURL: 'app.com/img.jpg',
      caption: 'test'
    } as DeficientItemCompletedPhoto;

    const tests = [
      {
        expected: undefined,
        userChanges: { progressNote: 'progress note ' },
        msg: 'ignores unrelated update'
      },
      {
        expected: { '1': imgOnlyAdd },
        userChanges: { completedPhoto: { 1: imgOnlyAdd } },
        msg: 'add a new photo data image update'
      },
      {
        expected: { '1': imgCaptionAdd },
        userChanges: { completedPhoto: { 1: imgCaptionAdd } },
        msg: 'add a new photo data image/caption update'
      },
      {
        expected: { '1': imgOnlyAdd, '2': imgCaptionAdd },
        updatedItem: { completedPhotos: { '1': imgOnlyAdd } },
        userChanges: { completedPhoto: { '2': imgCaptionAdd } },
        msg: 'appends new photo updates to existing ones'
      }
    ];

    const currentItem = createDeficientItem({ state: 'pending' });

    for (let i = 0; i < tests.length; i += 1) {
      const { expected, updatedItem = {}, userChanges, msg } = tests[i];
      const result = updateItem(
        updatedItem as DeficientItemModel,
        currentItem,
        userChanges
      );
      const actual = result.completedPhotos || undefined;
      expect(actual, msg).toEqual(expected);
    }
  });

  test('it sets an item as duplicate', () => {
    const tests = [
      {
        expected: undefined,
        currentItem: createDeficientItem({ state: 'deferred' }),
        userChanges: { currentPlanToFix: 'plan to fix' },
        msg: 'ignores unrelated update'
      },
      {
        expected: true,
        currentItem: createDeficientItem({ state: 'deferred' }),
        updatedItem: { isDuplicate: true },
        userChanges: { currentPlanToFix: 'plan to fix' },
        msg: 'uses previous update when no user changes apply'
      },
      {
        expected: true,
        currentItem: createDeficientItem({ state: 'deferred' }),
        userChanges: { isDuplicate: true },
        msg: 'mark item as duplicate '
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
      const result = updateItem(
        updatedItem as DeficientItemModel,
        currentItem,
        userChanges
      );
      const actual = result ? result.isDuplicate : undefined;
      expect(actual, msg).toEqual(expected);
    }
  });
});
