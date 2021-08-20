import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { Doughnut } from 'react-chartjs-2';
import utilString from '../../../../common/utils/string';
import utilDate from '../../../../common/utils/date';
import hasInspectionUpdateActions from '../../utils/hasInspectionUpdateActions';
import userModel from '../../../../common/models/user';
import inspectionModel from '../../../../common/models/inspection';
import templateCategoryModel from '../../../../common/models/templateCategory';
import ActionsIcon from '../../../../public/icons/ios/actions.svg';
import DropdownInspection from '../../DropdownInspection';
import progressChart from '../../utils/progressChart';
import styles from '../styles.module.scss';
import propertyProfileStyles from '../../styles.module.scss';

interface ListItemProps {
  user: userModel;
  inspection: inspectionModel;
  propertyId: string;
  templateCategories: Array<templateCategoryModel>;
  openInspectionDeletePrompt: (inspection: inspectionModel) => void;
}

const ListItem: FunctionComponent<ListItemProps> = ({
  user,
  inspection,
  propertyId,
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
      : // eslint-disable-next-line
        progressChart.getProgressPercent(
          inspection.itemsCompleted,
          inspection.totalItems
        )
  );

  /* eslint-disable */
  const scoreChart = Math.floor(scoreDisplay);
  const labelPlugin = progressChart.getChartLabel();
  const chartData = progressChart.getChartData(scoreChart);
  const chartOptions = progressChart.getChartOptions();
  /* eslint-enable */

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
          {/*
            <span
            className={clsx(
              styles.propertyProfile__gridRow__avatar,
              styles['-fallback'],
              '-d-none'
            )}
          ></span>
            */}

          {creatorName}
        </a>
      </Link>
      <Link href={inspectionUpdateUrl}>
        <a
          className={styles.propertyProfile__gridRow__column}
          data-testid="inspection-grid-list-item-creation-date"
          data-time={inspection.creationDate}
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
          {inspection.inspectionCompleted ? (
            `${scoreDisplay}%`
          ) : (
            <Doughnut
              type="doughnut"
              className={propertyProfileStyles.__progressChart} // eslint-disable-line
              data={chartData}
              options={chartOptions}
              plugins={[labelPlugin]}
              width={50}
              height={50}
            />
          )}
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
              propertyId={propertyId}
              inspectionId={inspection.id}
              onDeleteClick={() => openInspectionDeletePrompt(inspection)}
            />
          </span>
        </div>
      ) : null}
    </li>
  );
};

export default ListItem;
