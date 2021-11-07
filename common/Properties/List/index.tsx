import { FunctionComponent } from 'react';
import clsx from 'clsx';
import propertyMetaData from '../../models/propertyMetaData';
import propertyModel from '../../models/property';
import teamModel from '../../models/team';
import MobileHeader from '../../MobileHeader';
import AddIcon from '../../../public/icons/ios/add.svg';
import FolderIcon from '../../../public/icons/ios/folder.svg';
import Dropdown from '../../../features/Properties/DropdownAdd';
import TeamItem from './TeamItem';
import PropertyItem from './PropertyItem';
import DeletePropertyPrompt from '../../prompts/DeletePropertyPrompt';
import styles from './styles.module.scss';

interface PropertyListTeamWrapperModel {
  team: teamModel;
  teamCalculatedValues: Array<propertyMetaData>;
  openDeletePrompt: (team: teamModel) => void;
}

interface PropertyListModel {
  properties: Array<propertyModel>;
  teams?: Array<teamModel>;
  teamCalculatedValues?: Array<propertyMetaData>;
  isDeletePropertyPromptVisible: boolean;
  openPropertyDeletePrompt?: (property: propertyModel) => void;
  closeDeletePropertyPrompt?: () => void;
  confirmPropertyDelete?: () => Promise<any>;
  openTeamDeletePrompt?: (team: teamModel) => void;
  isOnline?: boolean;
  isStaging?: boolean;
  canAddTeam?: boolean;
  canAddProperty?: boolean;
  toggleNavOpen?(): void;
  nextPropertiesSort?(): void;
  userFacingSortBy?: string;
  forceVisible?: boolean;
  headerTitle?: string;
}

// Wrapper around team items
// to look associated property meta data
const PropertyListTeamItemWrapper: FunctionComponent<PropertyListTeamWrapperModel> =
  ({ team, teamCalculatedValues, openDeletePrompt }) => {
    const [propertiesMetaData] = teamCalculatedValues.filter(
      ({ team: teamId }) => teamId === team.id
    );

    return (
      <TeamItem
        team={team}
        teamCalculatedValues={propertiesMetaData}
        onQueueTeamDelete={openDeletePrompt}
      />
    );
  };

// Mobile layout
const PropertyList: FunctionComponent<PropertyListModel> = ({
  properties,
  teams,
  teamCalculatedValues,
  isDeletePropertyPromptVisible,
  openPropertyDeletePrompt,
  closeDeletePropertyPrompt,
  confirmPropertyDelete,
  openTeamDeletePrompt,
  isOnline,
  isStaging,
  canAddTeam,
  canAddProperty,
  toggleNavOpen,
  nextPropertiesSort,
  userFacingSortBy,
  forceVisible,
  headerTitle
}) => {
  // Mobile Header actions buttons
  const mobileHeaderActions = (headStyle) => (
    <>
      {(canAddTeam || canAddProperty) && (
        <button
          className={clsx(
            headStyle.header__button,
            headStyle['header__button--dropdown']
          )}
          data-testid="property-list-create"
        >
          <AddIcon />
          <Dropdown canAddTeam={canAddTeam} canAddProperty={canAddProperty} />
        </button>
      )}

      <button
        className={headStyle.header__button}
        onClick={() => nextPropertiesSort()}
        data-testid="mobile-properties-sort-by"
      >
        <FolderIcon />
      </button>
    </>
  );

  return (
    <>
      <MobileHeader
        title={!headerTitle ? 'Properties' : headerTitle}
        toggleNavOpen={toggleNavOpen}
        isOnline={isOnline}
        isStaging={isStaging}
        actions={mobileHeaderActions}
        testid="mobile-properties-header"
      />

      <div
        className={styles.propertyList__sortInfoLine}
        data-testid="properties-active-sort-by"
      >
        {`Sorted by ${userFacingSortBy}`}
      </div>
      <ul className={styles.propertyList} data-testid="mobile-properties-list">
        {teams && teams.length > 0 && (
          <li className={styles.propertyList__item}>
            <header className={styles.propertyList__itemHeader}>teams</header>
            {teams.map((team) => (
              <PropertyListTeamItemWrapper
                key={team.id}
                team={team}
                teamCalculatedValues={teamCalculatedValues}
                openDeletePrompt={openTeamDeletePrompt}
              />
            ))}
          </li>
        )}

        <li className={styles.propertyList__item}>
          <header className={styles.propertyList__itemHeader}>
            properties
          </header>

          {properties.length ? (
            properties.map((property) => (
              <PropertyItem
                key={property.id}
                property={property}
                onQueuePropertyDelete={openPropertyDeletePrompt}
                forceVisible={forceVisible}
              />
            ))
          ) : (
            <h5 className={clsx('-pt', '-pl')}>Team has no properties</h5>
          )}
        </li>
      </ul>

      <DeletePropertyPrompt
        isVisible={isDeletePropertyPromptVisible}
        onClose={closeDeletePropertyPrompt}
        onConfirm={confirmPropertyDelete}
      />
    </>
  );
};

PropertyList.defaultProps = {
  forceVisible: false
};

export default PropertyList;
