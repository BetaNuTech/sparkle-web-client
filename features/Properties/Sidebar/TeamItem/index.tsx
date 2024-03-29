import { FunctionComponent } from 'react';
import clsx from 'clsx';
import styles from './styles.module.scss';
import teamModel from '../../../../common/models/team';
import TeamValues from '../../../../common/TeamValues';
import ActionsIcon from '../../../../public/icons/ios/actions.svg';
import LinkFeature from '../../../../common/LinkFeature';
import features from '../../../../config/features';
import DropdownTeam from '../../DropdownTeam';

interface summaryPropertyCalcValues {
  totalNumOfDeficientItems: number;
  totalNumOfFollowUpActionsForDeficientItems: number;
  totalNumOfRequiredActionsForDeficientItems: number;
}

interface Props {
  team: teamModel;
  teamCalculatedValues: summaryPropertyCalcValues;
  openTeamDeletePrompt: (team: teamModel) => void;
  onEdit: (team: teamModel) => void;
  canEdit: boolean;
}

const TeamItem: FunctionComponent<Props> = ({
  team,
  teamCalculatedValues,
  openTeamDeletePrompt,
  onEdit,
  canEdit
}) => (
  <li className={styles.teamItem} data-testid="team-item" data-team={team.id}>
    {/* Team Name */}
    <LinkFeature
      featureEnabled={features.supportTeamView}
      href={`/teams/${team.id}`}
      className={styles.teamItem__name}
    >
      {team.name}
    </LinkFeature>

    {canEdit && (
      <div
        aria-label="Open menu"
        className={clsx(
          styles.teamItem__menuButton,
          styles['teamItem__menuButton--dropdown']
        )}
      >
        <ActionsIcon />
        <DropdownTeam
          onDelete={() => openTeamDeletePrompt(team)}
          onEdit={() => onEdit(team)}
        />
      </div>
    )}

    {/* Metadata */}
    <LinkFeature
      featureEnabled={features.supportTeamView}
      href={`/teams/${team.id}`}
    >
      <TeamValues
        numOfDeficientItems={teamCalculatedValues.totalNumOfDeficientItems}
        numOfFollowUpActionsForDeficientItems={
          teamCalculatedValues.totalNumOfFollowUpActionsForDeficientItems
        }
        numOfRequiredActionsForDeficientItems={
          teamCalculatedValues.totalNumOfRequiredActionsForDeficientItems
        }
        isNarrowField
      />
    </LinkFeature>
  </li>
);

TeamItem.defaultProps = {
  teamCalculatedValues: {
    totalNumOfDeficientItems: 0,
    totalNumOfFollowUpActionsForDeficientItems: 0,
    totalNumOfRequiredActionsForDeficientItems: 0
  }
};

export default TeamItem;
