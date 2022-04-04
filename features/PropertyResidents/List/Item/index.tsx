import { FunctionComponent, useMemo, useRef } from 'react';
import clsx from 'clsx';
import ResidentModel from '../../../../common/models/yardi/resident';
import dateUtil from '../../../../common/utils/date';
import styles from './styles.module.scss';
import { moneyUsd, phoneNumber } from '../../../../common/utils/humanize';
import OccupantItem from './Occupants';
import Info, { InfoLabel, InfoValue } from '../../../../common/Yardi/Info';
import useVisibility from '../../../../common/hooks/useVisibility';
import Badge from '../../../../common/Yardi/Badge';
import Pill from '../../../../common/Yardi/Pill';

interface Props {
  resident: ResidentModel;
  isMobile: boolean;
  forceVisible?: boolean;
  onClick(): void;
}

const ResidenceListItem: FunctionComponent<Props> = ({
  resident,
  isMobile,
  forceVisible,
  onClick
}) => {
  const placeholderRef = useRef();
  const { isVisible } = useVisibility(placeholderRef, {}, forceVisible);

  // check resident has contact info or not
  const { hasContact, minHeight } = useMemo(() => {
    const hasContactInfo = isHavingContactInfo(resident);
    const rowHeight = getRowHeight(resident, isMobile);

    return { hasContact: hasContactInfo, minHeight: rowHeight };
  }, [resident, isMobile]);

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <li
      className={clsx(styles.container, hasContact && '-cu-pointer')}
      ref={placeholderRef}
      onClick={onClick}
      style={{ minHeight: isVisible ? 0 : minHeight }}
    >
      {isVisible && (
        <>
          <div className={styles.container__left}>
            {isMobile && (
              <div className="-mb-sm -flex-spread-content">
                {resident.id && (
                  <Badge
                    type="secondary"
                    text={resident.id}
                    data-testid="residents-id"
                  />
                )}

                {resident.yardiStatus && (
                  <Badge
                    type="primary"
                    text={resident.yardiStatus}
                    data-testid="residents-yardi-status"
                  />
                )}
              </div>
            )}
            <div className={styles.title}>
              {resident.firstName && (
                <span data-testid="residents-first-name">
                  {resident.firstName}
                </span>
              )}
              {resident.middleName && (
                <span data-testid="residents-middle-name">
                  {resident.middleName}
                </span>
              )}
              {resident.lastName && (
                <span data-testid="residents-last-name">
                  {resident.lastName}
                </span>
              )}
            </div>
            {resident.id && (
              <Info label="ID" value={resident.id} data-testid="residents-id" />
            )}
            {resident.yardiStatus && (
              <Info
                label="Status"
                value={resident.yardiStatus}
                data-testid="residents-yardi-status"
              />
            )}
            <div className="-d-flex">
              {resident.leaseUnit && (
                <>
                  <InfoLabel label="Unit" />
                  <InfoValue
                    value={resident.leaseUnit}
                    data-testid="residents-lease-unit"
                  />
                </>
              )}
              {resident.leaseSqFt && (
                <>
                  <InfoLabel label="Sq Ft" />
                  <InfoValue
                    value={resident.leaseSqFt}
                    data-testid="residents-sort-lease-unit"
                  />
                </>
              )}
            </div>

            {isMobile && (
              <>
                {resident.email && (
                  <Info
                    label="Email"
                    value={resident.email}
                    data-testid="residents-email"
                  />
                )}
                {resident.mobileNumber && (
                  <Info
                    label="Mobile Number"
                    value={phoneNumber(resident.mobileNumber)}
                    data-testid="residents-mobile-number"
                  />
                )}
                {resident.officeNumber && (
                  <Info
                    label="Office Number"
                    value={phoneNumber(resident.officeNumber)}
                    data-testid="residents-office-number"
                  />
                )}
                {resident.homeNumber && (
                  <Info
                    label="Home Number"
                    value={phoneNumber(resident.homeNumber)}
                    data-testid="residents-home-number"
                  />
                )}
              </>
            )}

            {resident.leaseFrom && (
              <Info
                label="Lease From Date"
                value={dateUtil.toUserFullDateDisplay(
                  dateUtil.isoToTimestamp(resident.leaseFrom)
                )}
                data-testid="residents-lease-from"
              />
            )}

            {resident.leaseTo && (
              <Info
                label="Lease To Date"
                value={dateUtil.toUserFullDateDisplay(
                  dateUtil.isoToTimestamp(resident.leaseTo)
                )}
                data-testid="residents-lease-to"
              />
            )}

            {resident.moveIn && (
              <Info
                label="Move in Date"
                value={dateUtil.toUserFullDateDisplay(
                  dateUtil.isoToTimestamp(resident.moveIn)
                )}
                data-testid="residents-move-in"
              />
            )}

            {resident.occupants.length > 0 && (
              <div className="-mt -mb">
                <div className={styles.row}>
                  <InfoLabel label="Roommate" />
                </div>
                {resident.occupants.map((occupant) => (
                  <OccupantItem occupant={occupant} key={occupant.id} />
                ))}
              </div>
            )}
            {typeof resident.totalCharges === 'number' && (
              <Info
                label="Total Charges"
                value={moneyUsd(resident.totalCharges)}
              />
            )}
            {typeof resident.totalOwed === 'number' && (
              <Info label="Total Owed" value={moneyUsd(resident.totalOwed)} />
            )}
            {typeof resident.paymentPlan === 'boolean' && (
              <Info
                label="Payment Plan"
                value={resident.paymentPlan ? 'YES' : 'NO'}
                data-testid="residents-payment-plan"
              />
            )}
            {typeof resident.paymentPlanDelinquent === 'boolean' && (
              <Info
                label="Payment Plan Delinquent"
                value={resident.paymentPlanDelinquent ? 'YES' : 'NO'}
              />
            )}
            {typeof resident.eviction === 'boolean' && (
              <Info label="Eviction" value={resident.eviction ? 'YES' : 'NO'} />
            )}
            {resident.lastNote && (
              <Info label="Last Note" value={resident.lastNote} />
            )}
          </div>

          {!isMobile && (
            <div className={styles.right}>
              <Pill>
                {resident.email && (
                  <Info
                    label="Email"
                    value={resident.email}
                    data-testid="residents-email"
                  />
                )}

                {resident.mobileNumber && (
                  <Info
                    label="Mobile Number"
                    value={phoneNumber(resident.mobileNumber)}
                    data-testid="residents-mobile-number"
                  />
                )}
                {resident.officeNumber && (
                  <Info
                    label="Office Number"
                    value={phoneNumber(resident.officeNumber)}
                    data-testid="residents-office-number"
                  />
                )}
                {resident.homeNumber && (
                  <Info
                    label="Home Number"
                    value={phoneNumber(resident.homeNumber)}
                    data-testid="residents-home-number"
                  />
                )}
              </Pill>
            </div>
          )}
        </>
      )}
    </li>
  );
};

export default ResidenceListItem;

const isHavingContactInfo = (resident: ResidentModel) => {
  // check if resident has any contact info
  const hasResidentContact =
    resident.mobileNumber ||
    resident.homeNumber ||
    resident.email ||
    resident.officeNumber;

  // check if any occupant has any contact info
  const hasOccupantContact = resident.occupants.some(
    (occupant) =>
      occupant.mobileNumber ||
      occupant.homeNumber ||
      occupant.email ||
      occupant.officeNumber
  );

  return hasResidentContact || hasOccupantContact;
};

const getRowHeight = (resident: ResidentModel, isMobile: boolean) => {
  const residentKeys = Object.keys(resident).filter(
    (key) =>
      Boolean(resident[key]) &&
      ['firstName', 'lastName', 'occupantsString'].indexOf(key) < 0
  ).length;

  const occupantsKeys = resident.occupants.reduce(
    (acc, obj) =>
      acc +
      Object.keys(obj).filter(
        (key) =>
          Boolean(obj[key]) &&
          [
            'relationship',
            'email',
            'officeNumber',
            'homeNumber',
            'mobileNumber'
          ].indexOf(key) > -1
      ).length,
    0
  );
  const totalKeys = residentKeys + occupantsKeys;

  const margins = resident.occupants.length ? 48 : 16;
  const totalHeight = totalKeys * 25 + margins;

  return isMobile ? totalHeight + 100 : totalHeight;
};
