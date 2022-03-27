import { FunctionComponent } from 'react';
import ResidentModel from '../../../../common/models/yardi/resident';
import dateUtil from '../../../../common/utils/date';
import styles from './styles.module.scss';
import { moneyUsd, phoneNumber } from '../../../../common/utils/humanize';
import OccupantItem from './Occupants';
import Info from './Info';

interface Props {
  resident: ResidentModel;
}

const ResidenceListItem: FunctionComponent<Props> = ({ resident }) => {
  const hasName = Boolean(
    resident.firstName || resident.middleName || resident.lastName
  );

  return (
    <li className={styles.container}>
      <div className={styles.badgeContainer}>
        {resident.id && (
          <div className={styles.leftBadge}>
            <span data-testid="id">{resident.id}</span>
          </div>
        )}

        {resident.yardiStatus && (
          <div className={styles.rightBadge}>
            <span data-testid="resindents-yardi-status">
              {resident.yardiStatus}
            </span>
          </div>
        )}
      </div>
      {hasName && (
        <div className={styles.info}>
          <p className={styles.info__label}>Name:</p>
          {resident.firstName && (
            <span
              className={styles.info__value}
              data-testid="resindents-first-name"
            >
              {resident.firstName}
            </span>
          )}
          {resident.middleName && (
            <span
              className={styles.info__value}
              data-testid="resindents-middle-name"
            >
              {resident.middleName}
            </span>
          )}
          {resident.lastName && (
            <span
              className={styles.info__value}
              data-testid="resindents-last-name"
            >
              {resident.lastName}
            </span>
          )}
        </div>
      )}

      {resident.leaseUnit && (
        <Info
          label="Unit"
          value={resident.leaseUnit}
          data-testid="resindents-lease-unit"
        />
      )}
      {resident.sortLeaseUnit && (
        <Info
          label="Sq Ft"
          value={resident.sortLeaseUnit}
          data-testid="resindents-sort-lease-unit"
        />
      )}
      {resident.email && (
        <Info
          label="Email"
          value={resident.email}
          data-testid="resindents-email"
        />
      )}
      {resident.mobileNumber && (
        <Info
          label="Mobile Number"
          value={phoneNumber(resident.mobileNumber)}
          data-testid="resindents-mobile-number"
        />
      )}
      {resident.officeNumber && (
        <Info
          label="Office Number"
          value={phoneNumber(resident.officeNumber)}
          data-testid="resindents-office-number"
        />
      )}
      {resident.homeNumber && (
        <Info
          label="Home Number"
          value={phoneNumber(resident.homeNumber)}
          data-testid="resindents-home-number"
        />
      )}
      {resident.leaseFrom && (
        <Info
          label="Lease From Date"
          value={dateUtil.toUserFullDateDisplay(
            dateUtil.isoToTimestamp(resident.leaseFrom)
          )}
          data-testid="resindents-lease-from"
        />
      )}

      {resident.leaseTo && (
        <Info
          label="Lease To Date"
          value={dateUtil.toUserFullDateDisplay(
            dateUtil.isoToTimestamp(resident.leaseTo)
          )}
          data-testid="resindents-lease-to"
        />
      )}

      {resident.moveIn && (
        <Info
          label="Move in Date"
          value={dateUtil.toUserFullDateDisplay(
            dateUtil.isoToTimestamp(resident.moveIn)
          )}
          data-testid="resindents-move-in"
        />
      )}

      {resident.occupants.length > 0 && (
        <div className="-mt -mb">
          <div className={styles.info}>
            <p className={styles.info__label}>Occupants:</p>
          </div>
          {resident.occupants.map((occupant) => (
            <OccupantItem occupant={occupant} key={occupant.id} />
          ))}
        </div>
      )}

      {typeof resident.totalCharges === 'number' && (
        <Info label="Total Charges" value={moneyUsd(resident.totalCharges)} />
      )}

      {typeof resident.totalOwed === 'number' && (
        <Info label="Total Owed" value={moneyUsd(resident.totalOwed)} />
      )}

      {typeof resident.paymentPlan === 'boolean' && (
        <Info
          label="Payment Plan"
          value={resident.paymentPlan ? 'YES' : 'NO'}
          data-testid="resindents-payment-plan"
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

      {typeof resident.lastNote && (
        <Info label="Last Note" value={resident.lastNote} />
      )}
    </li>
  );
};

export default ResidenceListItem;
