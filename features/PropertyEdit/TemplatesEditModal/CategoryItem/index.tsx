import { FunctionComponent } from 'react';
import CategorizedTemplates from '../../../../common/models/templates/categorizedTemplates';
import ListItem from './ListItem/index';
import styles from '../styles.module.scss';

interface Props {
  category: CategorizedTemplates;
  selectedTemplates: string[];
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
