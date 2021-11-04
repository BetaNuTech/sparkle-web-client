import clsx from 'clsx';
import { useState, useRef, FunctionComponent } from 'react';
import styles from './styles.module.scss';
import parentStyles from '../styles.module.scss';
import teamModel from '../../../models/team';
import TeamValues from '../../../TeamValues';
import propertyMetaData from '../../../models/propertyMetaData';
import useSwipeReveal from '../../../hooks/useSwipeReveal';
import ChevronIcon from '../../../../public/icons/ios/chevron.svg';
import LinkFeature from '../../../LinkFeature';
import features from '../../../../config/features';

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
        <LinkFeature
          featureEnabled={features.supportBetaTeamView}
          href={`/teams/${team.id}`}
          className={parentStyles.itemResult__link}
        >
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
        </LinkFeature>
      </div>

      {/* Swipe Reveal Actions */}
      <div
        className={clsx(
          parentStyles.swipeReveal,
          isSwipeOpen && parentStyles.swipeReveal__reveal
        )}
      >
        <LinkFeature
          featureEnabled={features.supportBetaTeamView}
          href={`/teams/${team.id}/edit`}
          className={parentStyles.swipeReveal__editButton}
        >
          Edit
        </LinkFeature>
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