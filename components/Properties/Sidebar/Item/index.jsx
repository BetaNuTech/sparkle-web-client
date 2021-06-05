import Link from 'next/link';
import PropTypes from 'prop-types';
import styles from './Item.module.scss';
import { TeamValues } from '../../../common/TeamValues';
import ActionsIcon from '../../../../public/icons/ios/actions.svg';

export const Item = ({ name }) => (
  <li className={styles.item}>
    {/* Team Name */}
    <Link href="/teams">
      <a className={styles.item__teamName}>{name}</a>
    </Link>

    <button aria-label="Open menu" className={styles.item__menuButton}>
      <ActionsIcon />
    </button>

    {/* Metadata */}
    <TeamValues
      numOfDeficientItems={1}
      numOfFollowUpActionsForDeficientItems={22}
      numOfRequiredActionsForDeficientItems={333}
      isNarrowField
    />
  </li>
);

Item.propTypes = {
  name: PropTypes.string.isRequired
};
