import { FunctionComponent, useMemo, useState } from 'react';
import TemplateCategoryModel from '../../../../common/models/templateCategory';
import Dropdown from './Dropdown';
import styles from './styles.module.scss';

interface Props {
  category: TemplateCategoryModel;
  canUpdateCategory: boolean;
  canDeleteCategory: boolean;
  isUnpublished?: boolean;
}

const CategoryItem: FunctionComponent<Props> = ({
  category,
  canUpdateCategory,
  canDeleteCategory,
  isUnpublished
}) => {
  const [updates, setUpdates] = useState('');
  const isUpdated = useMemo(
    () => Boolean(updates) && updates.trim() !== category.name,
    [category, updates]
  );

  return (
    <li key={category.id} className={styles.row}>
      <div className={styles.row__column}>
        {canUpdateCategory ? (
          <div className={styles.field}>
            <input
              type="text"
              defaultValue={category.name}
              className={styles.field__input}
              placeholder="Enter Category Name"
              onChange={(e) => setUpdates(e.target.value)}
              autoFocus={isUnpublished} // eslint-disable-line jsx-a11y/no-autofocus
              data-testid="category-input"
            />
            {isUpdated && (
              <button
                className={styles.field__action}
                data-testid="category-save-action"
              >
                Save
              </button>
            )}
          </div>
        ) : (
          <span data-testid="category-name-text">{category.name}</span>
        )}
      </div>
      {canDeleteCategory && (
        <div
          className={styles.row__column}
          data-testid="category-delete-dropdown"
        >
          <Dropdown />
        </div>
      )}
    </li>
  );
};

CategoryItem.defaultProps = {
  isUnpublished: false
};

export default CategoryItem;
