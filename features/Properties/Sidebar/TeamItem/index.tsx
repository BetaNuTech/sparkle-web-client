import Link from 'next/link';
import { FunctionComponent } from 'react';
import styles from './styles.module.scss';
import teamModel from '../../../../common/models/team';
import TeamValues from '../../../../common/TeamValues';
import ActionsIcon from '../../../../public/icons/ios/actions.svg';

interface summaryPropertyCalcValues {
  totalNumOfDeficientItems: number;
  totalNumOfFollowUpActionsForDeficientItems: number;
  totalNumOfRequiredActionsForDeficientItems: number;
}

interface Props {
  team: teamModel;
  teamCalculatedValues: summaryPropertyCalcValues;
}

const TeamItem: FunctionComponent<Props> = ({ team, teamCalculatedValues }) => (
  <li className={styles.teamItem} data-testid="team-item" data-team={team.id}>
    {/* Team Name */}
    <Link href="/teams">
      <a className={styles.teamItem__name}>{team.name}</a>
    </Link>

    <button aria-label="Open menu" className={styles.teamItem__menuButton}>
      <ActionsIcon />
    </button>

    {/* Metadata */}
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
