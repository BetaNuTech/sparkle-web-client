import { FunctionComponent } from 'react';
import CategoryModel from '../models/category';
import ListItem from './ListItem';
import styles from '../styles.module.scss';

interface Props {
  category: CategoryModel;
}

const CategoryItem: FunctionComponent<Props> = ({ category }) => (
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
        <ListItem key={`${template.id}`} template={template} />
      ))}
    </ul>
  </li>
);

export default CategoryItem;
