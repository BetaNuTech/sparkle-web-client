import { FunctionComponent } from 'react';
import TemplateModel from '../../../../../common/models/template';
import styles from '../../styles.module.scss';
import CheckedIcon from '../../../../../public/icons/sparkle/checked.svg';
import NotCheckedIcon from '../../../../../public/icons/sparkle/not-checked.svg';

interface Props {
  template: TemplateModel;
  selectedTemplates: Array<string>;
  updateTempatesList: (string) => void;
}

const ListItem: FunctionComponent<Props> = ({
  template,
  selectedTemplates,
  updateTempatesList
}) => (
  <li
    className={styles.templatesEditModal__items}
    data-testid="template-category-list-item"
  >
    <input
      type="checkbox"
      id={template.id}
      className={styles.templatesEditModal__items__input}
      checked={selectedTemplates.includes(template.id)}
      onChange={() => updateTempatesList(template.id)}
      value={template.id}
      data-testid={`checkbox-item-${template.id}`}
    />
    <label
      htmlFor={template.id}
      className={styles.templatesEditModal__items__label}
    >
      <div>
        <h6
          className={styles.templatesEditModal__items__label__text}
          data-testid="template-name"
        >
          {template.name}
        </h6>
        <div
          className={styles.templatesEditModal__items__label__text}
          data-testid="template-desc"
        >
          {template.description ? `${template.description}` : 'No description'}
        </div>
      </div>
      {selectedTemplates.includes(template.id) ? (
        <CheckedIcon
          className={styles.templatesEditModal__items__label__chequedIcon}
        />
      ) : (
        <NotCheckedIcon
          className={styles.templatesEditModal__items__label__notChequedIcon}
        />
      )}
    </label>
  </li>
);

export default ListItem;
