import { FunctionComponent } from 'react';
import templateModel from '../../../common/models/template';
import CategorizedTemplates from '../../../common/models/templates/categorizedTemplates';
import ListItem from './ListItem';
import styles from '../styles.module.scss';

interface Props {
  category: CategorizedTemplates;
  createInspection: (template: templateModel) => Promise<void>;
}

const CategoryItem: FunctionComponent<Props> = ({
  category,
  createInspection
}) => (
  <li
    className={styles.createInspection__box__listItem}
    data-testid="template-category-item"
  >
    <header
      className={styles.createInspection__box__header}
      data-testid="template-category-name"
    >
      {category.name}
    </header>
    <ul className={styles.createInspection__category}>
      {category.templates.map((template) => (
        <ListItem
          key={`${template.id}`}
          template={template}
          createInspection={createInspection}
        />
      ))}
    </ul>
  </li>
);

export default CategoryItem;
