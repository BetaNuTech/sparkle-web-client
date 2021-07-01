import clsx from 'clsx';
import Link from 'next/link';
import { useState, useRef, FunctionComponent } from 'react';
import styles from './styles.module.scss';
import parentStyles from '../styles.module.scss';
import teamModel from '../../../../common/models/team';
import { TeamValues } from '../../../../common/TeamValues';
import propertyMetaData from '../../../../common/models/propertyMetaData';
import useSwipeReveal from '../../../../common/hooks/useSwipeReveal';
import ChevronIcon from '../../../../public/icons/ios/chevron.svg';

interface MobileLayoutTeamItemModel {
  team: teamModel;
  teamCalculatedValues: propertyMetaData;
  onQueueTeamDelete: (team: teamModel) => void;
}

const TeamItem: FunctionComponent<MobileLayoutTeamItemModel> = ({
  team,
  teamCalculatedValues,
  onQueueTeamDelete
}) => {
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const ref = useRef(null);
  useSwipeReveal(ref, setIsSwipeOpen);

  return (
    <div
      ref={ref}
      className={parentStyles.itemResult}
      data-testid="team-item"
      data-team={team.id}
    >
      {/* Main Content */}
      <div
        className={
          isSwipeOpen
            ? clsx(
                parentStyles.itemResult__content,
                parentStyles['itemResult--swipeOpen']
              )
            : parentStyles.itemResult__content
        }
      >
        <Link href="/">
          <a className={parentStyles.itemResult__link}>
            {/* Toggle Button */}
            <span className={parentStyles.itemResult__toggle}>
              <ChevronIcon />
            </span>
            {/* Team Name */}
            <div className={styles.teamItem__name}>
              <strong>{team.name}</strong>
            </div>
            {/* Metadata */}
            <div
              className={parentStyles.itemResult__metadata}
              data-testid="team-property-meta"
            >
              Deficient Items
              <TeamValues
                numOfDeficientItems={
                  teamCalculatedValues.totalNumOfDeficientItems
                }
                numOfFollowUpActionsForDeficientItems={
                  teamCalculatedValues.totalNumOfFollowUpActionsForDeficientItems
                }
                numOfRequiredActionsForDeficientItems={
                  teamCalculatedValues.totalNumOfRequiredActionsForDeficientItems
                }
                isNarrowField={false}
              />
            </div>
          </a>
        </Link>
      </div>

      {/* Swipe Reveal Actions */}
      <div
        className={clsx(
          parentStyles.swipeReveal,
          isSwipeOpen && parentStyles.swipeReveal__reveal
        )}
      >
        <button className={parentStyles.swipeReveal__editButton}>Edit</button>
        <button
          className={parentStyles.swipeReveal__deleteButton}
          onClick={() => onQueueTeamDelete(team)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

TeamItem.defaultProps = {
  teamCalculatedValues: {
    totalNumOfDeficientItems: 0,
    totalNumOfFollowUpActionsForDeficientItems: 0,
    totalNumOfRequiredActionsForDeficientItems: 0
  }
};

export default TeamItem;
