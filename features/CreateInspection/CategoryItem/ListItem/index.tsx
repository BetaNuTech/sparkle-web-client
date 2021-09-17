import { FunctionComponent } from 'react';
import clsx from 'clsx';
import templateModel from '../../../../common/models/template';
import styles from '../../styles.module.scss';

interface Props {
  template: templateModel;
  createInspection: (template: templateModel) => Promise<void>;
}

const ListItem: FunctionComponent<Props> = ({ template, createInspection }) => (
  // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
  <li
    className={clsx(styles.createInspection__category__item, '-templateItem')}
    data-testid="template-category-list-item"
    onClick={() => createInspection(template)}
  >
    <div>
      <h6 className="-fw-bold -mb-none" data-testid="template-name">
        {template.name}
      </h6>
      <div className="-fz-medium -mb-xsm" data-testid="template-desc">
        {template.description ? `${template.description}` : 'No description'}
      </div>
    </div>
  </li>
);

export default ListItem;
