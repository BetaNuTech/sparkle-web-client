import { FunctionComponent } from 'react';
import clsx from 'clsx';
import AddIcon from '../../../public/icons/ios/add.svg';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import TemplateCategoryModel from '../../../common/models/templateCategory';
import Item from './item';

import baseStyles from '../../../common/Modal/styles.module.scss';
import styles from './styles.module.scss';

interface Props extends ModalProps {
  onClose: () => void;
  templateCategories: TemplateCategoryModel[];
  unpublishedCategories: TemplateCategoryModel[];
  canCreateCategory: boolean;
  canUpdateCategory: boolean;
  canDeleteCategory: boolean;
  onCreateNewCategory(): void;
}

const ManageCategoriesModal: FunctionComponent<Props> = ({
  onClose,
  templateCategories,
  unpublishedCategories,
  canCreateCategory,
  canUpdateCategory,
  canDeleteCategory,
  onCreateNewCategory
}) => (
  <div className={styles.modal} data-testid="manage-categories-modal">
    <button
      className={baseStyles.modal__closeButton}
      onClick={onClose}
      data-testid="manage-categories-modal-close"
    >
      ×
    </button>
    <header className={baseStyles.modal__header}>
      <h4
        className={baseStyles.modal__heading}
        data-testid="manage-categories-modal-heading"
      >
        Manage Categories
      </h4>
    </header>

    <div className={baseStyles.modal__main}>
      <div className={baseStyles.modal__main__content}>
        <ul>
          {templateCategories.map((category) => (
            <Item
              key={category.id}
              category={category}
              canUpdateCategory={canUpdateCategory}
              canDeleteCategory={canDeleteCategory}
            />
          ))}

          {unpublishedCategories.map((category) => (
            <Item
              key={category.id}
              category={category}
              canUpdateCategory={canUpdateCategory}
              canDeleteCategory={canDeleteCategory}
              isUnpublished={true} // eslint-disable-line react/jsx-boolean-value
            />
          ))}
        </ul>
        {canCreateCategory && (
          <div className={styles.action}>
            <button
              className={styles.action__textButton}
              onClick={onCreateNewCategory}
              data-testid="manage-categories-modal-create-action"
            >
              Create New Category
            </button>
          </div>
        )}
      </div>

      {canCreateCategory && (
        <footer className={clsx(baseStyles.modal__main__footer, styles.footer)}>
          <button
            type="button"
            className={styles.footerAction}
            onClick={onCreateNewCategory}
            data-testid="manage-categories-modal-footer-create-action"
          >
            Create
            <span className={styles.footerAction__icon}>
              <AddIcon />
            </span>
          </button>
        </footer>
      )}
    </div>
  </div>
);

export default Modal(ManageCategoriesModal, false, styles.modal);
