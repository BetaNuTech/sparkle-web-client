import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import sinon from 'sinon';
import propertiesApi from '../../../common/services/firestore/properties';
import teamsApi from '../../../common/services/firestore/teams';
import { inspectionA } from '../../../__mocks__/inspections';
import {
  propertyB,
  propertyC,
  propertyD,
  propertyE
} from '../../../__mocks__/properties';
import teams from '../../../__mocks__/teams';
import { admin } from '../../../__mocks__/users';
import MoveInspectionModal from './index';

const propertiesResult = {
  status: 'success',
  error: null,
  data: [
    { ...propertyB, team: teams[0].id },
    { ...propertyC, team: teams[1].id },
    { ...propertyD, team: teams[0].id },
    { ...propertyE, team: teams[1].id }
  ]
};

const teamsResult = {
  status: 'success',
  error: null,
  data: teams
};

describe('Unit | features | Property Profile | Move Inspection Modal', () => {
  afterEach(() => sinon.restore());
  it('should render properties into groups of teams', () => {
    const expectedGroups = 2;
    const expected =
      'team-1 => property-2 | team-1 => property-4 | team-2 => property-3 | team-2 => property-5';
    sinon.stub(teamsApi, 'findAll').returns(teamsResult);
    sinon.stub(propertiesApi, 'findAll').returns(propertiesResult);

    render(
      <MoveInspectionModal
        firestore={{}}
        onClose={sinon.spy()}
        inspection={inspectionA}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        user={admin}
      />
    );
    const propertiesTeam = screen.queryAllByTestId(
      'move-inspection-properties-team'
    );
    const properties = screen.queryAllByTestId('move-inspection-property-item');
    const actual = properties
      .map((item) => `${item.dataset.group} => ${item.dataset.property}`)
      .join(' | ');

    expect(actual).toEqual(expected);
    expect(propertiesTeam).toHaveLength(expectedGroups);
  });

  it('should update property selection when selected property', () => {
    const expected = propertyB.name;
    sinon.stub(teamsApi, 'findAll').returns(teamsResult);
    sinon.stub(propertiesApi, 'findAll').returns(propertiesResult);

    render(
      <MoveInspectionModal
        firestore={{}}
        onClose={sinon.spy()}
        inspection={inspectionA}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        user={admin}
      />
    );

    let properties = screen.queryAllByTestId('move-inspection-property-item');
    act(() => {
      fireEvent.click(properties[0]);
    });
    properties = screen.queryAllByTestId('move-inspection-property-item');
    const selectedProperty = screen.queryByTestId(
      'move-inspection-selected-property'
    );

    expect(properties[0].dataset.selected).toEqual('selected');
    expect(selectedProperty).toHaveTextContent(expected);
  });
});
