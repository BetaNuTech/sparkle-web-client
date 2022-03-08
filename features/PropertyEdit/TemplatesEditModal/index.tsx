import { FunctionComponent } from 'react';
import clsx from 'clsx';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import styles from './styles.module.scss';
import CategoryItem from './CategoryItem';
import LoadingHud from '../../../common/LoadingHud';
import SearchBar from '../../../common/SearchBar';

interface Props extends ModalProps {
  onClose: () => void;
  isTemplatesEditModalVisible: () => void;
  onSearchKeyDown?(ev: React.KeyboardEvent<HTMLInputElement>): void;
  selectedCategoryId: string;
  updateTempatesList: (string) => void;
  categories: Array<any>;
  selectedTemplates: Array<any>;
  searchParam?: string;
  onClearSearch(): void;
  searchQuery: string;
}

const TemplateEditModal: FunctionComponent<Props> = (props) => {
  const {
    categories,
    onClose,
    selectedTemplates,
    updateTempatesList,
    searchParam,
    onSearchKeyDown,
    onClearSearch,
    searchQuery
  } = props;

  const closeModal = () => {
    onClose();
  };

  // Loading State
  if (!categories) {
    return <LoadingHud title="Loading templates" />;
  }

  return (
    <div
      className={styles.templatesEditModal}
      data-testid="property-edit-template-modal"
    >
      <button
        onClick={closeModal}
        className={styles.modal__closeButton}
        data-testid="close"
      >
        ×
      </button>

      <header
        className={clsx(styles.modal__header, '-mb-sm', '-br-bottom-none')}
      >
        <h5 className={styles.modal__heading}>Select Templates</h5>
      </header>
      <SearchBar
        onSearchKeyDown={onSearchKeyDown}
        onClearSearch={onClearSearch}
        searchQuery={searchQuery}
      />

      <div className={styles.templatesEditModal__main}>
        <ul className={styles.templatesEditModal__categoryBox}>
          {categories.length ? (
            categories.map((cat) => (
              <CategoryItem
                key={`${cat.id}`}
                category={cat}
                selectedTemplates={selectedTemplates}
                updateTempatesList={updateTempatesList}
              />
            ))
          ) : (
            <h5
              data-testid="no-templates"
              className={styles.templatesEditModal__emptyHeading}
            >
              No templates found
            </h5>
          )}
        </ul>
        {searchParam && (
          <div className={styles.action}>
            <button className={styles.action__clear} onClick={onClearSearch}>
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal(TemplateEditModal, false);
