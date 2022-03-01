import clsx from 'clsx';
import { FunctionComponent, useMemo, useRef } from 'react';
import Router from 'next/router';
import moment from 'moment';
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
  isMobile: boolean;
  onSelectDeficiency(state: string, deficiencyId: string): void;
  selectedDeficiencies: string[];
}

const DeficientItemsStateGroupsListItem: FunctionComponent<Props> = ({
  deficientItem,
  forceVisible,
  isMobile,
  onSelectDeficiency,
  selectedDeficiencies
}) => {
  const placeholderRef = useRef(null);

  const { isVisible } = useVisibility(placeholderRef, {}, forceVisible);

  const isClosed = deficientItem.state === 'closed';

  // Determine if DI is past due
  const isPastDue = useMemo(() => {
    const finalDueDate =
      deficientItem.currentDeferredDate || deficientItem.currentDueDate || null;
    const currentDateUnix = moment().unix();

    if (isClosed) {
      return false;
    }

    if (finalDueDate) {
      return finalDueDate < currentDateUnix;
    }
    return false;
  }, [deficientItem, isClosed]);

  const deferredDate = (
    <>
      Deferred:{' '}
      <span className={clsx(isPastDue && !isMobile && '-c-alert')}>
        {dateUtils.toUserDateDisplayWithFullYear(
          deficientItem.currentDeferredDate
        )}
      </span>
    </>
  );

  const dueDate = (
    <>
      Due:{' '}
      <span className={clsx(isPastDue && !isMobile && '-c-alert')}>
        {dateUtils.toUserDateDisplayWithFullYear(deficientItem.currentDueDate)}
      </span>
    </>
  );

  const rightBadgeText =
    (isClosed && deficientItem.isDuplicate && 'Duplicate') ||
    (deficientItem.currentDeferredDate && deferredDate) ||
    (deficientItem.currentDueDate ? dueDate : 'Due: Not Set');

  const onClickItem = () => {
    if (features.supportBetaDeficientItemEdit) {
      Router.push(
        `/properties/${deficientItem.property}/deficient-items/edit/${deficientItem.id}`
      );
    } else {
      window.location.href = `/properties/${deficientItem.property}/deficient-items/${deficientItem.id}`;
    }
  };

  return (
    <li ref={placeholderRef} className={styles.container}>
      {isVisible && (
        <div className={styles.main} onClick={onClickItem}>
          <div
            className={clsx(styles.row, !isMobile && styles['row--reverse'])}
          >
            {!isMobile && (
              <span className={styles.icon}>
                <SelectionIcon
                  itemMainInputType={deficientItem.itemMainInputType}
                  itemMainInputSelection={deficientItem.itemMainInputSelection}
                />
              </span>
            )}
            <div className={styles.row__left}>
              <span
                className={clsx(
                  styles.badge,
                  styles[`badge--${deficientItem.currentResponsibilityGroup}`],
                  isClosed && isMobile && '-o-50'
                )}
                data-testid="current-responsibility-group"
              >
                {getResponsibilityGroup(
                  deficientItem.currentResponsibilityGroup
                ) || 'Not Set'}
              </span>
            </div>
            <div className={styles.row__right}>
              <span
                className={clsx(
                  styles.badge,
                  styles[`badge--${deficientItem.state}`]
                )}
                data-testid="item-right-badge"
              >
                {rightBadgeText}
              </span>
            </div>
          </div>

          <div className={styles.row}>
            {isMobile && (
              <div className={styles.row__left}>
                <span className={clsx(styles.icon, isClosed && '-o-50')}>
                  <SelectionIcon
                    itemMainInputType={deficientItem.itemMainInputType}
                    itemMainInputSelection={
                      deficientItem.itemMainInputSelection
                    }
                  />
                </span>
              </div>
            )}
            <div className={styles.row__right}>
              <span
                className={clsx(
                  styles.title,
                  '-mb-sm',
                  isClosed && isMobile && '-c-gray-light'
                )}
                data-testid="item-title"
              >
                {!isMobile && !isClosed && (
                  <input
                    type="checkbox"
                    checked={
                      selectedDeficiencies.indexOf(deficientItem.id) > -1
                    }
                    data-testid="item-checkbox"
                    className="-mr"
                    onChange={() =>
                      onSelectDeficiency(deficientItem.state, deficientItem.id)
                    }
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                {deficientItem.itemTitle}
              </span>
              <span
                className={clsx(
                  styles.title,
                  isClosed && isMobile && '-c-info',
                  !isClosed && isMobile && '-c-primary-dark',
                  !isMobile && styles.sectionTitle
                )}
                data-testid="section-title"
              >
                {deficientItem.sectionTitle}
                {deficientItem.sectionSubtitle && !isMobile && (
                  <span data-testid="section-sub-title">
                    {' '}
                    / {deficientItem.sectionSubtitle}
                  </span>
                )}
              </span>
              {deficientItem.sectionSubtitle && isMobile && (
                <span
                  className={clsx(
                    styles.title,
                    isClosed ? '-c-info' : '-c-primary-dark',
                    !isMobile && styles.sectionTitle
                  )}
                  data-testid="section-sub-title"
                >
                  {deficientItem.sectionSubtitle}
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </li>
  );
};

export default DeficientItemsStateGroupsListItem;
