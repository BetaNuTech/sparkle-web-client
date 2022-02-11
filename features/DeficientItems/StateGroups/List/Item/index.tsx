import clsx from 'clsx';
import { FunctionComponent, useRef } from 'react';
import LinkFeature from '../../../../../common/LinkFeature';
import deficientItemModel from '../../../../../common/models/deficientItem';
import getResponsibilityGroup from '../../../../../common/utils/deficientItem/getResponsibilityGroup';
import features from '../../../../../config/features';
import dateUtils from '../../../../../common/utils/date';
import SelectionIcon from './SelectionIcon';
import useVisibility from '../../../../../common/hooks/useVisibility';
import styles from './styles.module.scss';

interface Props {
  deficientItem: deficientItemModel;
  forceVisible?: boolean;
}

const DeficientItemsStateGroupsListItem: FunctionComponent<Props> = ({
  deficientItem,
  forceVisible
}) => {
  const placeholderRef = useRef(null);

  const { isVisible } = useVisibility(placeholderRef, {}, forceVisible);

  const isClosed = deficientItem.state === 'closed';

  const rightBadgeText =
    (isClosed && deficientItem.isDuplicate && 'Duplicate') ||
    (deficientItem.currentDeferredDate &&
      `Deferred: ${dateUtils.toUserDateDisplayWithFullYear(
        deficientItem.currentDeferredDate
      )}`) ||
    (deficientItem.currentDueDate
      ? `Due: ${dateUtils.toUserDateDisplayWithFullYear(
          deficientItem.currentDueDate
        )}`
      : 'Due: Not Set');

  return (
    <li ref={placeholderRef} className={styles.container}>
      {isVisible && (
        <LinkFeature
          href={`/properties/${deficientItem.property}/deficient-items/edit/${deficientItem.id}`}
          legacyHref={`/properties/${deficientItem.property}/deficient-items/${deficientItem.id}`}
          featureEnabled={features.supportBetaDeficientItemEdit}
        >
          <div className={styles.main}>
            <div className={styles.main__left}>
              <span
                className={clsx(
                  styles.badge,
                  styles[`badge--${deficientItem.currentResponsibilityGroup}`],
                  isClosed && '-o-50'
                )}
                data-testid="current-responsibility-group"
              >
                {getResponsibilityGroup(
                  deficientItem.currentResponsibilityGroup
                ) || 'Not Set'}
              </span>
              <span className={clsx(styles.icon, isClosed && '-o-50')}>
                <SelectionIcon
                  itemMainInputType={deficientItem.itemMainInputType}
                  itemMainInputSelection={deficientItem.itemMainInputSelection}
                />
              </span>
            </div>
            <div className={styles.main__right}>
              <span
                className={clsx(
                  styles.badge,
                  styles[`badge--${deficientItem.state}`]
                )}
                data-testid="item-right-badge"
              >
                {rightBadgeText}
              </span>
              <span
                className={clsx(
                  styles.title,
                  '-mb-sm',
                  isClosed && '-c-gray-light'
                )}
                data-testid="item-title"
              >
                {deficientItem.itemTitle}
              </span>
              <span
                className={clsx(
                  styles.title,
                  isClosed ? '-c-info' : '-c-primary-dark'
                )}
                data-testid="section-title"
              >
                {deficientItem.sectionTitle}
              </span>
              {deficientItem.sectionSubtitle && (
                <span
                  className={clsx(
                    styles.title,
                    isClosed ? '-c-info' : '-c-primary-dark'
                  )}
                  data-testid="section-sub-title"
                >
                  {deficientItem.sectionSubtitle}
                </span>
              )}
            </div>
          </div>
        </LinkFeature>
      )}
    </li>
  );
};

export default DeficientItemsStateGroupsListItem;
