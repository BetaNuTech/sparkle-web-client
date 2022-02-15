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

  switch (state) {
    case 'completed':
      title = 'Completed - Follow Up Required';
      break;
    case 'incomplete':
      title = 'Incomplete - Follow Up Required';
      break;
    case 'overdue':
      title = `Past Due Date - Action${itemCount > 1 ? 's' : ''} Required`;
      break;
    case 'requires-action':
      title = `NEW - Action${itemCount > 1 ? 's' : ''} Required`;
      break;
    case 'go-back':
      title = `Go Back - Action${itemCount > 1 ? 's' : ''} Required`;
      break;
    case 'requires-progress-update':
      title = `Pending - Action${itemCount > 1 ? 's' : ''} Required`;
      break;
    case 'deferred':
      title = 'Deferred';
      break;
    case 'pending':
      title = 'Pending';
      break;
    case 'closed':
      title = 'Closed';
      break;

    default:
      title = state;
      break;
  }

  return (
    <h3
      data-testid="state-item-title"
      className={clsx(styles.container, styles[`container--${state}`])}
    >
      {title}
    </h3>
  );
};

export default DeficientItemsStateGroupsHeader;
