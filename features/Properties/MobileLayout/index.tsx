import { FunctionComponent } from 'react';
import styles from './styles.module.scss';
import propertyMetaData from '../../../common/models/propertyMetaData';
import propertyModel from '../../../common/models/property';
import teamModel from '../../../common/models/team';
import TeamItem from './TeamItem';
import { PropertyItem } from './PropertyItem';
import DeletePropertyPrompt from './DeletePropertyPrompt';

interface PropertiesMobileLayoutTeamWrapperModel {
  team: teamModel;
  teamCalculatedValues: Array<propertyMetaData>;
}

interface PropertiesMobileLayoutModel {
  properties: Array<propertyModel>;
  teams: Array<teamModel>;
  teamCalculatedValues: Array<propertyMetaData>;
  isDeletePropertyPromptVisible: boolean;
  openPropertyDeletePrompt: (property: propertyModel) => void;
  closeDeletePropertyPrompt: () => void;
  confirmPropertyDelete: () => Promise<any>;
}

// Wrapper around team items
// to look associated property meta data
const MobileLayoutTeamItemWrapper: FunctionComponent<PropertiesMobileLayoutTeamWrapperModel> =
  ({ team, teamCalculatedValues }) => {
    const [propertiesMetaData] = teamCalculatedValues.filter(
      ({ team: teamId }) => teamId === team.id
    );

    return <TeamItem team={team} teamCalculatedValues={propertiesMetaData} />;
  };

// Mobile layout
const MobileLayout: FunctionComponent<PropertiesMobileLayoutModel> = ({
  properties,
  teams,
  teamCalculatedValues,
  isDeletePropertyPromptVisible,
  openPropertyDeletePrompt,
  closeDeletePropertyPrompt,
  confirmPropertyDelete
}) => (
  <>
    <ul
      className={styles.mobileProperties}
      data-testid="mobile-properties-list"
    >
      {teams.length > 0 && (
        <li className={styles.mobileProperties__item}>
          <header>teams</header>
          {teams.map((team) => (
            <MobileLayoutTeamItemWrapper
              key={team.id}
              team={team}
              teamCalculatedValues={teamCalculatedValues}
            />
          ))}
        </li>
      )}

      <li className={styles.mobileProperties__item}>
        <header>
          properties{isDeletePropertyPromptVisible ? 'is' : 'not'}
        </header>

        {properties.map((property) => (
          <PropertyItem
            key={property.id}
            property={property}
            onQueuePropertyDelete={openPropertyDeletePrompt}
          />
        ))}
      </li>
    </ul>

    <DeletePropertyPrompt
      isVisible={isDeletePropertyPromptVisible}
      onClose={closeDeletePropertyPrompt}
      onConfirm={confirmPropertyDelete}
    />
  </>
);

export default MobileLayout;
