import clsx from 'clsx';
import { FunctionComponent, useRef } from 'react';
import { Doughnut } from 'react-chartjs-2';
import LinkFeature from '../../../../common/LinkFeature';
import utilString from '../../../../common/utils/string';
import utilDate from '../../../../common/utils/date';
import features from '../../../../config/features';
import hasInspectionUpdateActions from '../../utils/hasInspectionUpdateActions';
import useVisibility from '../../../../common/hooks/useVisibility';
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
  onMoveInspection: (inspection: inspectionModel) => void;
  forceVisible?: boolean;
}

const ListItem: FunctionComponent<ListItemProps> = ({
  user,
  inspection,
  propertyId,
  templateCategories,
  openInspectionDeletePrompt,
  onMoveInspection,
  forceVisible
}) => {
  // State

  const ref = useRef(null);
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
  const inspectionUpdateUrl = `/properties/${propertyId}/inspections/edit/${inspection.id}`;
  const legacyInspectionUpdateUrl = `/properties/${propertyId}/update-inspection/${inspection.id}`;

  // Can user take action on inspection row
  const hasActionColumn = hasInspectionUpdateActions(user);
  const { isVisible } = useVisibility(ref, {}, forceVisible);

  return (
    <li
      className={clsx(styles.propertyProfile__gridRow, '-six-columns')}
      data-testid="inspection-grid-listitem"
      ref={ref}
    >
      {isVisible ? (
        <>
          <LinkFeature
            href={inspectionUpdateUrl}
            legacyHref={legacyInspectionUpdateUrl}
            className={styles.propertyProfile__gridRow__column}
            data-testid="inspection-grid-list-item-creator"
            featureEnabled={features.supportPropertyInspectionUpdate}
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
          </LinkFeature>
          <LinkFeature
            href={inspectionUpdateUrl}
            legacyHref={legacyInspectionUpdateUrl}
            className={styles.propertyProfile__gridRow__column}
            data-testid="inspection-grid-list-item-creation-date"
            data-time={inspection.creationDate}
            featureEnabled={features.supportPropertyInspectionUpdate}
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
          </LinkFeature>
          <LinkFeature
            href={inspectionUpdateUrl}
            legacyHref={legacyInspectionUpdateUrl}
            className={styles.propertyProfile__gridRow__column}
            data-testid="inspection-grid-list-item-update-date"
            featureEnabled={features.supportPropertyInspectionUpdate}
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
          </LinkFeature>
          <LinkFeature
            href={inspectionUpdateUrl}
            legacyHref={legacyInspectionUpdateUrl}
            className={styles.propertyProfile__gridRow__column}
            data-testid="inspection-grid-list-item-template"
            featureEnabled={features.supportPropertyInspectionUpdate}
          >
            {templateName}
          </LinkFeature>
          <LinkFeature
            href={inspectionUpdateUrl}
            legacyHref={legacyInspectionUpdateUrl}
            className={styles.propertyProfile__gridRow__column}
            data-testid="inspection-grid-list-item-template-cat"
            featureEnabled={features.supportPropertyInspectionUpdate}
          >
            {templateCategory}
          </LinkFeature>
          <LinkFeature
            href={inspectionUpdateUrl}
            legacyHref={legacyInspectionUpdateUrl}
            className={clsx(
              styles.propertyProfile__gridRow__column,
              inspection.deficienciesExist ? '-c-red' : '-c-blue'
            )}
            data-testid="inspection-grid-list-item-score"
            featureEnabled={features.supportPropertyInspectionUpdate}
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
          </LinkFeature>
          {hasActionColumn ? (
            <div
              className={styles.propertyProfile__gridRow__column}
              data-testid="inspection-grid-list-item-actions"
            >
              <span className={styles.propertyProfile__gridRow__actions}>
                <ActionsIcon />
                <DropdownInspection
                  user={user}
                  onDeleteClick={() => openInspectionDeletePrompt(inspection)}
                  onMove={() => onMoveInspection(inspection)}
                />
              </span>
            </div>
          ) : null}
        </>
      ) : null}
    </li>
  );
};

ListItem.defaultProps = {
  forceVisible: false
};

export default ListItem;
