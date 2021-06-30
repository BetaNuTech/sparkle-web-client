import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import utilString from '../../../../common/utils/string';
import utilDate from '../../../../common/utils/date';
import hasInspectionUpdateActions from '../../utils/hasInspectionUpdateActions';
import userModel from '../../../../common/models/user';
import inspectionModel from '../../../../common/models/inspection';
import templateCategoryModel from '../../../../common/models/templateCategory';
import ActionsIcon from '../../../../public/icons/ios/actions.svg';
import DropdownInspection from '../../DropdownInspection';
import styles from '../styles.module.scss';

interface ListItemProps {
  user: userModel;
  inspection: inspectionModel;
  templateCategories: Array<templateCategoryModel>;
  openInspectionDeletePrompt: () => void;
}

const ListItem: FunctionComponent<ListItemProps> = ({
  user,
  inspection,
  templateCategories,
  openInspectionDeletePrompt
}) => {
  // State

  // Data parsing
  const creationDate = inspection.creationDate
    ? utilDate.toUserDateDisplay(inspection.creationDate)
    : '';
  const creationTime = inspection.creationDate
    ? utilDate.toUserTimeDisplay(inspection.creationDate)
    : '';

  const updatedDate = inspection.updatedAt
    ? utilDate.toUserDateDisplay(inspection.updatedAt)
    : '';
  const updatedTime = inspection.updatedAt
    ? utilDate.toUserTimeDisplay(inspection.updatedAt)
    : '';

  const creatorName = inspection.inspectorName
    ? utilString.titleize(inspection.inspectorName)
    : '--';
  const templateName = inspection.templateName ? inspection.templateName : '--';
  // If the inspection is completed then use direct score,
  // otherwise calculate percentage
  const scoreDisplay = Number(
    inspection.inspectionCompleted
      ? inspection.score.toFixed(1)
      : ((inspection.itemsCompleted / inspection.totalItems) * 100).toFixed(2)
  );
  // Get the category filtered by inspection category
  const filteredCategory = [].concat(
    Array.isArray(templateCategories) &&
      templateCategories.filter((tc) => tc.id === inspection.templateCategory)
  );
  const templateCategory =
    filteredCategory.length > 0 ? filteredCategory[0].name : 'Uncategorized';
  const inspectionUpdateUrl = '/properties/';

  // Can user take action on inspection row
  const hasActionColumn = hasInspectionUpdateActions(user);

  return (
    <li
      className={clsx(styles.propertyProfile__gridRow, '-six-columns')}
      data-testid="inspection-grid-listitem"
    >
      <Link href={inspectionUpdateUrl}>
        <a
          className={styles.propertyProfile__gridRow__column}
          data-testid="inspection-grid-list-item-creator"
        >
          <span
            className={clsx(
              styles.propertyProfile__gridRow__avatar,
              styles['-fallback']
            )}
          ></span>
          {creatorName}
        </a>
      </Link>
      <Link href={inspectionUpdateUrl}>
        <a
          className={styles.propertyProfile__gridRow__column}
          data-testid="inspection-grid-list-item-creation-date"
        >
          {inspection.creationDate ? (
            <>
              {creationDate}
              <br />
              {creationTime}
            </>
          ) : (
            '--'
          )}
        </a>
      </Link>
      <Link href={inspectionUpdateUrl}>
        <a
          className={styles.propertyProfile__gridRow__column}
          data-testid="inspection-grid-list-item-update-date"
        >
          {inspection.updatedAt ? (
            <>
              {updatedDate}
              <br />
              {updatedTime}
            </>
          ) : (
            '--'
          )}
        </a>
      </Link>
      <Link href={inspectionUpdateUrl}>
        <a
          className={styles.propertyProfile__gridRow__column}
          data-testid="inspection-grid-list-item-template"
        >
          {templateName}
        </a>
      </Link>
      <Link href={inspectionUpdateUrl}>
        <a
          className={styles.propertyProfile__gridRow__column}
          data-testid="inspection-grid-list-item-template-cat"
        >
          {templateCategory}
        </a>
      </Link>
      <Link href={inspectionUpdateUrl}>
        <a
          className={clsx(
            styles.propertyProfile__gridRow__column,
            inspection.deficienciesExist ? '-c-red' : '-c-blue'
          )}
          data-testid="inspection-grid-list-item-score"
        >
          {`${scoreDisplay}%`}
        </a>
      </Link>
      {hasActionColumn ? (
        <div
          className={styles.propertyProfile__gridRow__column}
          data-testid="inspection-grid-list-item-actions"
        >
          <span className={styles.propertyProfile__gridRow__actions}>
            <ActionsIcon />
            <DropdownInspection
              user={user}
              onDeleteClick={() => openInspectionDeletePrompt()}
            />
          </span>
        </div>
      ) : null}
    </li>
  );
};

export default ListItem;
