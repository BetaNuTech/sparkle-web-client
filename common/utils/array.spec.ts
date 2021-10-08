import utilArray from './array';

const records = [
  { id: '1', name: 'Matt Jensen', country: 'US', color: 'red' },
  { id: '2', name: 'Thomas Cook', country: 'UK', color: 'green' },
  { id: '3', name: 'James Bond', country: 'RS', color: 'red' }
];

describe('Unit | Common | Utils | Array Helper', () => {
  test('it should group records by specified attribute', () => {
    const expected =
      // eslint-disable-next-line max-len
      '[{"id":"1","name":"Matt Jensen","country":"US","color":"red"},{"id":"3","name":"James Bond","country":"RS","color":"red"}]';
    const expectedGreen =
      // eslint-disable-next-line max-len
      '[{"id":"2","name":"Thomas Cook","country":"UK","color":"green"}]';

    const recordMap = utilArray.groupBy(records, (r) => r.color);

    const actual = JSON.stringify(recordMap.get('red'));
    const actualGreen = JSON.stringify(recordMap.get('green'));

    expect(actual).toEqual(expected);
    expect(actualGreen).toEqual(expectedGreen);
  });
});
