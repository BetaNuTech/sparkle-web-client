import clsx from 'clsx';
import { FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  state: string;
  itemCount: number;
}

const DeficientItemsStateGroupsHeader: FunctionComponent<Props> = ({
  state,
  itemCount
}) => {
  let title = '';
  let className = '';

  switch (state) {
    case 'completed':
      title = 'Completed - Follow Up Required';
      className = '-bgc-quaternary';
      break;
    case 'incomplete':
      title = 'Incomplete - Follow Up Required';
      className = '-bgc-quaternary';
      break;
    case 'overdue':
      title = `Past Due Date - Action${itemCount > 1 ? 's' : ''} Required`;
      className = '-bgc-alert-secondary';
      break;
    case 'requires-action':
      title = `NEW - Action${itemCount > 1 ? 's' : ''} Required`;
      className = '-bgc-alert-secondary';
      break;
    case 'go-back':
      title = `Go Back - Action${itemCount > 1 ? 's' : ''} Required`;
      className = '-bgc-alert-secondary';
      break;
    case 'requires-progress-update':
      title = `Pending - Action${itemCount > 1 ? 's' : ''} Required`;
      className = '-bgc-alert-secondary';
      break;
    case 'deferred':
      title = 'Deferred';
      className = '-bgc-orange';
      break;
    case 'pending':
      title = 'Pending';
      className = '-bgc-gray-dark';
      break;
    case 'closed':
      title = 'Closed';
      className = '-bgc-gray-light';
      break;

    default:
      title = state;
      break;
  }

  return (
    <h3
      data-testid="state-item-title"
      className={clsx(styles.container, className)}
    >
      {title}
    </h3>
  );
};

export default DeficientItemsStateGroupsHeader;
