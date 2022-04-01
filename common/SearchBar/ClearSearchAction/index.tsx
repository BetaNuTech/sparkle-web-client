import { FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  searchQuery: string;
  onClearSearch(): void;
}

const ClearSearchAction: FunctionComponent<Props> = ({
  searchQuery,
  onClearSearch
}) => {
  if (!searchQuery) {
    return <></>;
  }
  return (
    <div className={styles.action}>
      <button className={styles.action__clear} onClick={onClearSearch}>
        Clear Search
      </button>
    </div>
  );
};

export default ClearSearchAction;
