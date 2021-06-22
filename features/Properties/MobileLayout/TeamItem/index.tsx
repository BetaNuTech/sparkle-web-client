import clsx from 'clsx';
import Link from 'next/link';
import { useState, useRef, FunctionComponent } from 'react';
import styles from './styles.module.scss';
import teamModel from '../../../../common/models/team';
import { SwipeReveal } from '../SwipeReveal';
import { TeamValues } from '../../../../common/TeamValues';
import propertyMetaData from '../../../../common/models/propertyMetaData';
import useSwipeReveal from '../../../../common/hooks/useSwipeReveal';
import ChevronIcon from '../../../../public/icons/ios/chevron.svg';

interface MobileLayoutTeamItemModel {
  team: teamModel;
  teamCalculatedValues: propertyMetaData;
}

const TeamItem: FunctionComponent<MobileLayoutTeamItemModel> = ({
  team,
  teamCalculatedValues
}) => {
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const ref = useRef(null);
  useSwipeReveal(ref, setIsSwipeOpen);

  return (
    <div
      ref={ref}
      className={styles.teamItem}
      data-testid="team-item"
      data-team={team.id}
    >
      {/* Main Content */}
      <div
        className={
          isSwipeOpen
            ? clsx(styles.teamItem__content, styles['teamItem--swipeOpen'])
            : styles.teamItem__content
        }
      >

        <Link href="/">
          <a className={styles.teamItem__link}>
            {/* Toggle Button */}
            <span className={styles.teamItem__toggle}>
              <ChevronIcon />
            </span>
            {/* Team Name */}
            <div className={styles.teamItem__name}>
              <strong>{team.name}</strong>
            </div>
            {/* Metadata */}
            <div
              className={styles.teamItem__metadata}
              data-testid="team-property-meta"
            >
              Deficient Items
              <TeamValues
                numOfDeficientItems={teamCalculatedValues.totalNumOfDeficientItems}
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

      {/* TODO Add Delete */}
      <SwipeReveal onDelete={() => ({})} />
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
