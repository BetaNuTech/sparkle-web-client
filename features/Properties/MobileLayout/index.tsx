import { FunctionComponent } from 'react';
import clsx from 'clsx';

import propertyMetaData from '../../../common/models/propertyMetaData';
import propertyModel from '../../../common/models/property';
import teamModel from '../../../common/models/team';
import MobileHeader from '../../../common/MobileHeader';
import AddIcon from '../../../public/icons/ios/add.svg';
import FolderIcon from '../../../public/icons/ios/folder.svg';
import Dropdown from '../DropdownAdd';
import TeamItem from './TeamItem';
import PropertyItem from './PropertyItem';
import DeletePropertyPrompt from '../../../common/prompts/DeletePropertyPrompt';
import styles from './styles.module.scss';

interface PropertiesMobileLayoutTeamWrapperModel {
  team: teamModel;
  teamCalculatedValues: Array<propertyMetaData>;
  openDeletePrompt: (team: teamModel) => void;
}

interface PropertiesMobileLayoutModel {
  properties: Array<propertyModel>;
  teams: Array<teamModel>;
  teamCalculatedValues: Array<propertyMetaData>;
  isDeletePropertyPromptVisible: boolean;
  openPropertyDeletePrompt: (property: propertyModel) => void;
  closeDeletePropertyPrompt: () => void;
  confirmPropertyDelete: () => Promise<any>;
  openTeamDeletePrompt: (team: teamModel) => void;
  isOnline?: boolean;
  isStaging?: boolean;
  canAddTeam: boolean;
  canAddProperty: boolean;
  toggleNavOpen?(): void;
  nextPropertiesSort?(): void;
  sortBy?: string;
  activePropertiesSortFilter?(string): string;
  forceVisible?: boolean;
}

// Wrapper around team items
// to look associated property meta data
const MobileLayoutTeamItemWrapper: FunctionComponent<PropertiesMobileLayoutTeamWrapperModel> =
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
const MobileLayout: FunctionComponent<PropertiesMobileLayoutModel> = ({
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
  sortBy,
  activePropertiesSortFilter,
  forceVisible
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
        onClick={nextPropertiesSort}
        data-testid="mobile-properties-sort-by"
      >
        <FolderIcon />
      </button>
    </>
  );

  return (
    <>
      <MobileHeader
        title="Properties"
        toggleNavOpen={toggleNavOpen}
        isOnline={isOnline}
        isStaging={isStaging}
        actions={mobileHeaderActions}
        testid="mobile-properties-header"
      />

      <div
        className={styles.mobileProperties__sortInfoLine}
        data-testid="properties-active-sort-by"
      >
        {`Sorted by ${activePropertiesSortFilter(sortBy)}`}
      </div>
      <ul
        className={styles.mobileProperties}
        data-testid="mobile-properties-list"
      >
        {teams.length > 0 && (
          <li className={styles.mobileProperties__item}>
            <header className={styles.mobileProperties__itemHeader}>
              teams
            </header>
            {teams.map((team) => (
              <MobileLayoutTeamItemWrapper
                key={team.id}
                team={team}
                teamCalculatedValues={teamCalculatedValues}
                openDeletePrompt={openTeamDeletePrompt}
              />
            ))}
          </li>
        )}

        <li className={styles.mobileProperties__item}>
          <header className={styles.mobileProperties__itemHeader}>
            properties
          </header>

          {properties.map((property) => (
            <PropertyItem
              key={property.id}
              property={property}
              onQueuePropertyDelete={openPropertyDeletePrompt}
              forceVisible={forceVisible}
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
};

MobileLayout.defaultProps = {
  forceVisible: false
};

export default MobileLayout;
