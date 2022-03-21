import update, { IndexedRecord, removeAtIndex } from './updateIndexes';
import utilArray from '../array';

const IDS = [
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten'
];

describe('Unit | Common | Utils | Template | Update Indexes', () => {
  test('it sorts a target record down a list', () => {
    const tests = [
      {
        length: 2,
        change: [0, 1],
        expected: 'one = 1 | two = 0',
        message: 'moved 1st to 2nd of 2 records'
      },
      {
        length: 3,
        change: [0, 2],
        expected: 'one = 2 | two = 0 | three = 1',
        message: 'moved 1st to 3rd of 3 records'
      },
      {
        length: 3,
        change: [1, 2],
        expected: 'two = 2 | three = 1',
        message: 'moved 2nd to 3rd of 3 records'
      },
      {
        length: 5,
        change: [1, 3],
        expected: 'two = 3 | three = 1 | four = 2',
        message: 'moved 2nd to 4th of 5 records'
      },
      {
        length: 5,
        change: [2, 4],
        expected: 'three = 4 | four = 2 | five = 3',
        message: 'moved 3rd to 5th of 5 records'
      },
      {
        length: 10,
        change: [3, 7],
        expected: 'four = 7 | five = 3 | six = 4 | seven = 5 | eight = 6',
        message: 'moved 4th to 8th of 10 records'
      },
      {
        length: 10,
        change: [0, 9],
        expected:
          'one = 9 | two = 0 | three = 1 | four = 2 | five = 3 | six = 4 | seven = 5 | eight = 6 | nine = 7 | ten = 8',
        message: 'moved 1st to 10th of 10 records'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { length, change, expected, message } = tests[i];
      const [currentIndex, targetIndex] = change;

      let targetId = '';
      const records = utilArray.range(0, length - 1).reduce((acc, index) => {
        const id = IDS[index];
        acc[id] = { index };
        if (index === currentIndex) {
          targetId = id;
        }
        return acc;
      }, {});

      const result = update(records, targetIndex, targetId);
      const actual = resultToString(result);
      expect(actual, message).toEqual(expected);
    }
  });

  test('it sorts a target record up a list', () => {
    const tests = [
      {
        length: 2,
        change: [1, 0],
        expected: 'one = 1 | two = 0',
        message: 'moved 2nd to 1st of 2 records'
      },
      {
        length: 3,
        change: [2, 0],
        expected: 'one = 1 | two = 2 | three = 0',
        message: 'moved 3rd to 1st of 3 records'
      },
      {
        length: 3,
        change: [2, 1],
        expected: 'two = 2 | three = 1',
        message: 'moved 3rd to 2nd of 3 records'
      },
      {
        length: 5,
        change: [3, 1],
        expected: 'two = 2 | three = 3 | four = 1',
        message: 'moved 4th to 2nd of 5 records'
      },
      {
        length: 5,
        change: [4, 2],
        expected: 'three = 3 | four = 4 | five = 2',
        message: 'moved 5th to 3rd of 5 records'
      },
      {
        length: 10,
        change: [7, 3],
        expected: 'four = 4 | five = 5 | six = 6 | seven = 7 | eight = 3',
        message: 'moved 8th to 4th of 10 records'
      },
      {
        length: 10,
        change: [9, 0],
        expected:
          'one = 1 | two = 2 | three = 3 | four = 4 | five = 5 | six = 6 | seven = 7 | eight = 8 | nine = 9 | ten = 0',
        message: 'moved 10th to 1st of 10 records'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { length, change, expected, message } = tests[i];
      const [currentIndex, targetIndex] = change;

      let targetId = '';
      const records = utilArray.range(0, length - 1).reduce((acc, index) => {
        const id = IDS[index];
        acc[id] = { index };
        if (index === currentIndex) {
          targetId = id;
        }
        return acc;
      }, {});

      const result = update(records, targetIndex, targetId);
      const actual = resultToString(result);
      expect(actual, message).toEqual(expected);
    }
  });

  test('it updates other records after a deleted item at a specified index', () => {
    const tests = [
      {
        length: 2,
        change: 0,
        expected: 'two = 0',
        message: 'moved 2nd to 1st of 1 record'
      },
      {
        length: 3,
        change: 1,
        expected: 'three = 1',
        message: 'moved 3rd to 2nd of 2 records'
      },
      {
        length: 3,
        change: 2,
        expected: '',
        message: 'did not update when last record deleted'
      },
      {
        length: 5,
        change: 2,
        expected: 'four = 2 | five = 3',
        message: 'moved up 4th and 5th of 4 records'
      },
      {
        length: 10,
        change: 0,
        expected:
          'two = 0 | three = 1 | four = 2 | five = 3 | six = 4 | seven = 5 | eight = 6 | nine = 7 | ten = 8',
        message: 'moved up all records when 1st is deleted'
      }
    ];

    for (let i = 0; i < tests.length; i += 1) {
      const { length, change, expected, message } = tests[i];
      const removeAt = change;
      const records = utilArray.range(0, length - 1).reduce((acc, index) => {
        const id = IDS[index];
        acc[id] = { index };
        return acc;
      }, {});

      const result = removeAtIndex(records, removeAt);
      const actual = resultToString(result);
      expect(actual, message).toEqual(expected);
    }
  });
});

function resultToString(result: Record<string, IndexedRecord>): string {
  return IDS.filter((id) => Boolean(result[id]))
    .map((id) => `${id} = ${result[id].index}`)
    .join(' | ');
}
