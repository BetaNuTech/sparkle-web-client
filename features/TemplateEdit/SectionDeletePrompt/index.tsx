import clsx from 'clsx';
import { FunctionComponent, useMemo } from 'react';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import TemplateItemModel from '../../../common/models/inspectionTemplateItem';
import TemplateSectionModel from '../../../common/models/inspectionTemplateSection';
import styles from '../../../common/Modal/styles.module.scss';
import WarningIcon from '../../../public/icons/sparkle/warning.svg';

interface Props extends ModalProps {
  onConfirm: () => any;
  selectedSections: string[];
  sortedSections: TemplateSectionModel[];
  templateSectionItems: Map<string, TemplateItemModel[]>;
  deletedSection: string;
}

const SectionDeletePrompt: FunctionComponent<Props> = ({
  onClose,
  onConfirm,
  selectedSections,
  sortedSections,
  templateSectionItems,
  deletedSection
}) => {
  const sectionIds = useMemo(
    () => (deletedSection ? [deletedSection] : selectedSections),
    [deletedSection, selectedSections]
  );

  // create prompt delete message
  const message = useMemo(
    () => createMessage(sectionIds, sortedSections, templateSectionItems),
    [sectionIds, sortedSections, templateSectionItems]
  );

  return (
    <>
      <header className={styles.modalPrompt__header}>
        <span className={clsx(styles.modal__header__icon, '-fill-warning')}>
          <WarningIcon />
        </span>
        <h5 className={styles.modalPrompt__heading}>
          Are you sure you want to delete section {message}?
        </h5>
      </header>

      <div className={styles.modalPrompt__main}>
        <footer className={styles.modalPrompt__main__footer}>
          <button
            className={clsx('button', 'gray', styles.modal__mainFooterbutton)}
            onClick={onClose} // eslint-disable-line
          >
            CANCEL
          </button>
          <button
            className={clsx('button', 'alert', styles.modal__mainFooterbutton)}
            onClick={onConfirm}
          >
            Confirm Delete
          </button>
        </footer>
      </div>
    </>
  );
};

export default Modal(SectionDeletePrompt, true);

// Create prompt message from
// sections that contain any items
function createMessage(
  sectionIds: string[],
  sections: TemplateSectionModel[],
  templateSectionItems: Map<string, TemplateItemModel[]>
): string {
  return sectionIds
    .reduce((acc, id) => {
      const name = sections.find((section) => section.id === id)?.title || '';
      const count = templateSectionItems.get(id)?.length || 0;

      if (count) {
        acc.push(`"${name}" including it's ${count} inspection items`);
      }

      return acc;
    }, [])
    .join(', ');
}
