import { FunctionComponent } from 'react';
import CategoryModel from '../../../CreateInspection/models/category';
import ListItem from './ListItem/index';
import styles from '../styles.module.scss';

interface Props {
  category: CategoryModel;
  selectedTemplates: Array<string>;
  updateTempatesList: (string) => void;
}

const CategoryItem: FunctionComponent<Props> = ({
  category,
  selectedTemplates,
  updateTempatesList
}) => (
  <li
    className={styles.templatesEditModal__listItem}
    data-testid="template-category-item"
  >
    <header
      className={styles.templatesEditModal__boxHeader}
      data-testid="template-category-name"
    >
      {category.name}
    </header>
    <ul className={styles.templatesEditModal__category}>
      {category.templates.map((template) => (
        <ListItem
          key={`${template.id}`}
          template={template}
          selectedTemplates={selectedTemplates}
          updateTempatesList={updateTempatesList}
        />
      ))}
    </ul>
  </li>
);

export default CategoryItem;
