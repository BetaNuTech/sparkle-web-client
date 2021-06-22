import { render } from '@testing-library/react';
import TeamItem from './index';
import { teamWithProperties } from '../../../../__mocks__/teams';
import propertyMetaData from '../../../../common/models/propertyMetaData';

const teamCalculatedValuesMock: propertyMetaData = {
  totalNumOfDeficientItems: 1,
  totalNumOfFollowUpActionsForDeficientItems: 2,
  totalNumOfRequiredActionsForDeficientItems: 3
};

describe('Unit | Properties | Mobile Layout | Team Item | snapshot', () => {
  it('renders correctly', () => {
    const container = render(
      <TeamItem
        team={teamWithProperties}
        propertyMetaData={teamCalculatedValuesMock}
      />
    );
    expect(container).toMatchSnapshot();
  });
});
