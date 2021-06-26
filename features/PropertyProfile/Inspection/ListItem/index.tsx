import { FunctionComponent, useState, useRef } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import utilString from '../../../../common/utils/string';
import utilDate from '../../../../common/utils/date';
import useSwipeReveal from '../../../../common/hooks/useSwipeReveal';
import inspectionModel from '../../../../common/models/inspection';
import templateCategoryModel from '../../../../common/models/templateCategory';
import styles from '../List/styles.module.scss';

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
  const creationDate = utilDate.getFormattedDate(inspection.creationDate);
  const updatedAt = utilDate.getFormattedDate(inspection.updatedAt);
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
      : ((inspection.itemsCompleted / inspection.totalItems) * 100).toFixed(2)
  );
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
      className={clsx(
        styles.stickyBoundingBox__reveal,
        styles['-inspectionItem']
      )}
      data-testid="property-profile-inspection-list-item"
    >
      <Link href="/properties">
        <a>
          <div
            className={clsx(
              styles.propertyProfile__inspectionsList__swipe,
              styles['no-touch'],
              isSwipeOpen &&
                styles.propertyProfile__inspectionsList__swipe_revealed
            )}
          >
            <div
              className={clsx(
                styles.propertyProfile__inspectionsList__swipe__visible,
                styles['-p-relative'],
                styles.propertyProfile__inspectionsList__content,
                isSwipeOpen &&
                  styles.propertyProfile__inspectionsList__swipeOpen
              )}
            >
              <span className={styles['spk-profile-list__item-link']}></span>
              <div
                className={clsx(
                  styles.propertyProfile__inspections__overview,
                  styles['-restrict-width']
                )}
              >
                <div
                  className={styles.propertyProfile__inspections__overview__row}
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
                  className={styles.propertyProfile__inspections__overview__row}
                >
                  <strong className="-c-black">Date:</strong>{' '}
                  <span
                    className={clsx('-fw-bold', '-c-secondary')}
                    data-testid="property-profile-inspection-list-item-creation-date"
                  >
                    {creationDate}
                  </span>
                </div>
                <div
                  className={styles.propertyProfile__inspections__overview__row}
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
                  className={styles.propertyProfile__inspections__overview__row}
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
                  className={styles.propertyProfile__inspections__overview__row}
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
              <aside
                className={styles.propertyProfile__inspections__visualizations}
              >
                {' '}
                <div className={styles.ropertyProfile__inspections__score}>
                  <span
                    className={styles.propertyProfile__inspections__smallCopy}
                  >
                    {`${scoreLabel}: `}
                    <span
                      className={
                        inspection.deficienciesExist ? '-c-red' : '-c-blue'
                      }
                      data-testid="property-profile-inspection-list-item-score"
                    >
                      {scoreDisplay}%
                    </span>
                  </span>
                </div>
              </aside>
            </div>
            <div
              className={styles.propertyProfile__inspectionsList__swipe__hidden}
            >
              <button
                className={clsx(styles['spk-flexy-button'], styles.alert)}
                disabled
              >
                Delete
              </button>
              <button
                className={clsx(styles['spk-flexy-button'], '-bgc-orange')}
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
