import { FunctionComponent } from 'react';
import clsx from 'clsx';
import TemplateModel from '../../../../common/models/template';
import styles from '../../styles.module.scss';

interface Props {
  template: TemplateModel;
}

const ListItem: FunctionComponent<Props> = ({ template }) => (
  <li
    className={clsx(styles.createInspection__category__item, '-templateItem')}
    data-testid="template-category-list-item"
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
