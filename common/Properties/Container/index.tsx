import { ReactElement, FunctionComponent } from 'react';
import styles from './styles.module.scss';

interface Props {
  header: ReactElement;
  grid: ReactElement;
  sidebar?: ReactElement;
}

const Container: FunctionComponent<Props> = ({ header, grid, sidebar }) => (
  <div className={styles.container}>
    {header}

    <div className={styles.container__main}>{grid}</div>
    <aside>{sidebar}</aside>
  </div>
);

export default Container;
