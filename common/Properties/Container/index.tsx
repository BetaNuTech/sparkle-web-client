import { ReactElement, FunctionComponent } from 'react';
import parentStyles from '../styles.module.scss';

interface Props {
  header: ReactElement;
  grid: ReactElement;
  sidebar?: ReactElement;
}

const Container: FunctionComponent<Props> = ({ header, grid, sidebar }) => (
  <div className={parentStyles.container}>
    {header}
    <div className={parentStyles.container__main}>{grid}</div>
    <aside className={parentStyles.container__sidebar}>{sidebar}</aside>
  </div>
);

export default Container;
