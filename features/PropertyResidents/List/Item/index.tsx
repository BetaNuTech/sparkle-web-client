import { FunctionComponent } from 'react';
import residentModel from '../../../../common/models/yardi/resident';
import dateUtil from '../../../../common/utils/date';
import styles from '../../styles.module.scss';

interface Props {
  resident: residentModel;
}

const ResidenceListItem: FunctionComponent<Props> = ({ resident }) => {
  const hasName = Boolean(
    resident.firstName || resident.middleName || resident.lastName
  );

  return (
    <li>
      <div className={styles.mainConatiner}>
        <div className={styles.badgeContainer}>
          {resident.id && (
            <div className={styles.leftBadge}>
              <span data-testid="id">{resident.id}</span>
            </div>
          )}
          {resident.paymentPlan && (
            <div className={styles.redAlert}>
              <span data-testid="paymentPlan">Delinquent</span>
            </div>
          )}
          {resident.yardiStatus && (
            <div className={styles.rightBadge}>
              <span data-testid="yardiStatus">{resident.yardiStatus}</span>
            </div>
          )}
        </div>
        {hasName && (
          <div className={styles.listConatiner}>
            <p>Name:</p>
            {resident.firstName && (
              <span data-testid="firstName">{resident.firstName}</span>
            )}
            {resident.middleName && (
              <span data-testid="middleName">{resident.middleName}</span>
            )}
            {resident.lastName && (
              <span data-testid="lastName">{resident.lastName}</span>
            )}
          </div>
        )}

        <div className={styles.listConatiner}>
          {resident.leaseUnit && (
            <>
              <p>Unit:</p>
              <span data-testid="leaseUnit">{resident.leaseUnit}</span>
            </>
          )}
        </div>

        <div className={styles.listConatiner}>
          {resident.sortLeaseUnit && (
            <>
              <p>Sq Ft:</p>
              <span data-testid="sortLeaseUnit">{resident.sortLeaseUnit}</span>
            </>
          )}
        </div>

        <div className={styles.listConatiner}>
          {resident.email && (
            <>
              <p>Email:</p>
              <span data-testid="email">{resident.email}</span>
            </>
          )}
        </div>

        <div className={styles.listConatiner}>
          {resident.mobileNumber && (
            <>
              <p>Mobile Number:</p>
              <span data-testid="mobileNumber">{resident.mobileNumber}</span>
            </>
          )}
        </div>

        <div className={styles.listConatiner}>
          {resident.officeNumber && (
            <>
              <p>Office Number:</p>
              <span data-testid="officeNumber">{resident.officeNumber}</span>
            </>
          )}
        </div>

        <div className={styles.listConatiner}>
          {resident.homeNumber && (
            <>
              <p>Home Number:</p>
              <span data-testid="homeNumber">{resident.homeNumber}</span>
            </>
          )}
        </div>

        <div className={styles.listConatiner}>
          {resident.leaseFrom && (
            <>
              <p>Lease From Date:</p>
              <span data-testid="leaseFrom">
                {dateUtil.toUserFullDateDisplay(
                  dateUtil.isoToTimestamp(resident.leaseFrom)
                )}
              </span>
            </>
          )}
        </div>

        <div className={styles.listConatiner}>
          {resident.leaseTo && (
            <>
              <p>Lease To Date:</p>
              <span data-testid="leaseTo">
                {dateUtil.toUserFullDateDisplay(
                  dateUtil.isoToTimestamp(resident.leaseTo)
                )}
              </span>
            </>
          )}
        </div>

        <div className={styles.listConatiner}>
          {resident.moveIn && (
            <>
              <p>Move in Date:</p>
              <span data-testid="moveIn">
                {dateUtil.toUserFullDateDisplay(
                  dateUtil.isoToTimestamp(resident.moveIn)
                )}
              </span>
            </>
          )}
        </div>
      </div>
    </li>
  );
};

export default ResidenceListItem;
