import sinon from 'sinon';
import calculateTeamValues from './calculateTeamValues';

const createTeam = (id: string, properties: Array<string>) => ({
  id,
  properties: properties.reduce((acc, propId: string) => {
    acc[propId] = true;
    return acc;
  }, {})
});

const createProperty = (
  id: string,
  defItems = 0,
  followUps = 0,
  reqActions = 0
) => ({
  id,
  numOfDeficientItems: defItems,
  numOfFollowUpActionsForDeficientItems: followUps,
  numOfRequiredActionsForDeficientItems: reqActions
});

// Create compare result
const toCompare = (result: Array<any>) =>
  result.reduce(
    (acc, item) =>
      `${acc}${acc.length ? ' & ' : ''}${item.team} => ${
        item.totalNumOfDeficientItems
      } | ${item.totalNumOfFollowUpActionsForDeficientItems} | ${
        item.totalNumOfRequiredActionsForDeficientItems
      }`,
    ''
  );

describe('Spec | Properties | Utils | Calculate Team Values', () => {
  afterEach(() => sinon.restore());

  test('it combines all a teams property meta data under team', () => {
    const teams = [createTeam('team1', ['prop1', 'prop2'])];
    const properties = [
      { id: 'prop1', val: 1 },
      { id: 'prop2', val: 2 }
    ].map(({ id, val }) => createProperty(id, val, val, val));
    const expected = 'team1 => 3 | 3 | 3';
    const result = calculateTeamValues(teams, properties);
    const actual = toCompare(result);
    expect(actual).toEqual(expected);
  });

  test('it groups all properties meta data under each respective team', () => {
    const teams = [
      createTeam('team1', ['prop1', 'prop2']),
      createTeam('team2', ['prop3', 'prop4']),
      createTeam('team3', [])
    ];
    const properties = [
      { id: 'prop1', val: 1 },
      { id: 'prop2', val: 2 },
      { id: 'prop3', val: 3 },
      { id: 'prop4', val: 4 }
    ].map(({ id, val }) => createProperty(id, val, val, val));
    const expected =
      'team1 => 3 | 3 | 3 & team2 => 7 | 7 | 7 & team3 => 0 | 0 | 0';
    const result = calculateTeamValues(teams, properties);
    const actual = toCompare(result);
    expect(actual).toEqual(expected);
  });
});
