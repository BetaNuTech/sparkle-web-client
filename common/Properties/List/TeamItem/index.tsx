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
  onEdit(): void;
  canEdit: boolean;
}

const TeamItem: FunctionComponent<MobileLayoutTeamItemModel> = ({
  team,
  teamCalculatedValues,
  onQueueTeamDelete,
  onEdit,
  canEdit
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
          isSwipeOpen && canEdit
            ? clsx(
                parentStyles.itemResult__content,
                parentStyles['itemResult--swipeOpen']
              )
            : parentStyles.itemResult__content
        }
      >
        <LinkFeature
          featureEnabled={features.supportTeamView}
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
        <button
          className={parentStyles.swipeReveal__editButton}
          onClick={onEdit}
        >
          Edit
        </button>

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
