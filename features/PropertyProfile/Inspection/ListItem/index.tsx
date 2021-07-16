import { FunctionComponent, useState, useRef } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import { Doughnut } from 'react-chartjs-2';
import utilString from '../../../../common/utils/string';
import utilDate from '../../../../common/utils/date';
import useSwipeReveal from '../../../../common/hooks/useSwipeReveal';
import inspectionModel from '../../../../common/models/inspection';
import templateCategoryModel from '../../../../common/models/templateCategory';
import progressChart from '../../utils/progressChart';
import styles from '../List/styles.module.scss';
import propertyProfileStyles from '../../styles.module.scss';

interface ListItemProps {
  inspection: inspectionModel;
  templateCategories: Array<templateCategoryModel>;
}

const ListItem: FunctionComponent<ListItemProps> = ({
  inspection,
  templateCategories
}) => {
  // State
  const [isSwipeOpen, setIsSwipeOpen] = useState(false);
  const ref = useRef(null);
  // Swipe reveal
  useSwipeReveal(ref, setIsSwipeOpen);

  // Data parsing
  const creationDate = utilDate.toUserDateTimeDisplay(inspection.creationDate);
  const updatedAt = utilDate.toUserDateTimeDisplay(inspection.updatedAt);
  const creatorName = inspection.inspectorName
    ? utilString.titleize(inspection.inspectorName)
    : 'Unknown';
  const templateName = inspection.templateName
    ? inspection.templateName
    : 'Unknown';
  const scoreLabel = inspection.inspectionCompleted ? 'Score' : 'Progress';
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
  return (
    <li
      ref={ref}
      className={clsx(styles.propertyProfile__inspectionsList__listItem)}
      data-testid="property-profile-inspection-list-item"
    >
      <Link href="/properties">
        <a>
          <div
            className={clsx(
              styles.propertyProfile__inspectionsList__swipe,
              isSwipeOpen &&
                styles.propertyProfile__inspectionsList__swipe__revealed
            )}
          >
            <div
              className={clsx(
                styles.propertyProfile__inspectionsList__swipe__visible,
                styles.propertyProfile__inspectionsList__content,
                isSwipeOpen &&
                  styles.propertyProfile__inspectionsList__swipeOpen
              )}
            >
              {/* Inspection Details */}
              <div
                className={clsx(
                  styles.propertyProfile__inspectionsList__overview,
                  styles['-restrict-width']
                )}
              >
                <div
                  className={
                    styles.propertyProfile__inspectionsList__overview__row
                  }
                >
                  <strong className="-c-black">Creator:</strong>{' '}
                  <span
                    className="-c-gray-dark"
                    data-testid="property-profile-inspection-list-item-creator"
                  >
                    {creatorName}
                  </span>
                </div>
                <div
                  className={
                    styles.propertyProfile__inspectionsList__overview__row
                  }
                >
                  <strong className="-c-black">Date:</strong>{' '}
                  <span
                    className={clsx('-fw-bold', '-c-secondary')}
                    data-testid="property-profile-inspection-list-item-creation-date"
                    data-time={inspection.creationDate}
                  >
                    {creationDate}
                  </span>
                </div>
                <div
                  className={
                    styles.propertyProfile__inspectionsList__overview__row
                  }
                >
                  <strong className="-c-black">Updated:</strong>{' '}
                  <span
                    className={clsx('-fw-bold', '-c-secondary')}
                    data-testid="property-profile-inspection-list-item-update-date"
                  >
                    {updatedAt}
                  </span>
                </div>
                <div
                  className={
                    styles.propertyProfile__inspectionsList__overview__row
                  }
                >
                  <strong className="-c-black">Template:</strong>{' '}
                  <span
                    className="-c-gray-light"
                    data-testid="property-profile-inspection-list-item-template"
                  >
                    {templateName}
                  </span>
                </div>
                <div
                  className={
                    styles.propertyProfile__inspectionsList__overview__row
                  }
                >
                  <strong className="-c-black">Category:</strong>{' '}
                  <span
                    className="-c-gray-light"
                    data-testid="property-profile-inspection-list-item-template-category"
                  >
                    {templateCategory}
                  </span>
                </div>
              </div>

              {/* Inspection Score */}
              <aside
                className={
                  styles.propertyProfile__inspectionsList__visualizations
                }
              >
                {' '}
                <div
                  className={styles.propertyProfile__inspectionsList__score}
                  data-testid="property-profile-inspection-list-item-score"
                >
                  {inspection.inspectionCompleted ? (
                    // Completed Score
                    <span
                      className={
                        styles.propertyProfile__inspectionsList__smallCopy
                      }
                    >
                      {scoreLabel}:
                      <span
                        className={
                          inspection.deficienciesExist ? '-c-red' : '-c-blue'
                        }
                      >
                        {scoreDisplay}%
                      </span>
                    </span>
                  ) : (
                    // Progress chart
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
                </div>
              </aside>

              {/* Link Icon */}
              <span
                className={
                  styles.propertyProfile__inspectionsList__swipe__visible__link
                }
              ></span>
            </div>

            {/* Swipe Revealed Buttons */}
            <div
              className={styles.propertyProfile__inspectionsList__swipe__hidden}
            >
              <button
                className={clsx(
                  styles.propertyProfile__inspectionsList__revealButton,
                  '-bgc-alert'
                )}
                disabled
              >
                Delete
              </button>
              <button
                className={clsx(
                  styles.propertyProfile__inspectionsList__revealButton,
                  '-bgc-orange'
                )}
                disabled
              >
                Move
              </button>
            </div>
          </div>
        </a>
      </Link>
    </li>
  );
};

export default ListItem;
