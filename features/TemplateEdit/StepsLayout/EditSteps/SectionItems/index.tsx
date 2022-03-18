import { FunctionComponent } from 'react';
import TrashIcon from '../../../../../public/icons/sparkle/trash.svg';
import TemplateSectionModel from '../../../../../common/models/inspectionTemplateSection';
import TemplateItemModel from '../../../../../common/models/inspectionTemplateItem';
import stepsStyles from '../styles.module.scss';
import DiamondIcon from '../../../../../public/icons/sparkle/diamond.svg';
import DiamondLayersIcon from '../../../../../public/icons/sparkle/diamond-layers.svg';
import EditableItem from '../../EditableItem';
import AddItemAction from './AddItemAction';

const inputTypes = [
  { label: 'Item', value: 'main' },
  { label: 'Text Input', value: 'text_input' },
  { label: 'Signature', value: 'signature' }
];
interface Props {
  sortedSections: TemplateSectionModel[];
  templateSectionItems: Map<string, TemplateItemModel[]>;
  forceVisible?: boolean;
  addItem(sectionId: string, itemType: string): void;
  onUpdateItemType(item: TemplateItemModel): void;
  updateItemTitle(itemId: string, title: string): void;
}

const SectionItems: FunctionComponent<Props> = ({
  sortedSections,
  templateSectionItems,
  forceVisible,
  addItem,
  onUpdateItemType,
  updateItemTitle
}) => (
  <>
    <header className={stepsStyles.header}>
      <h3 className={stepsStyles.header__title}>Items</h3>
    </header>

    {sortedSections.map((section) => {
      const sectionItems = templateSectionItems.get(section.id) || [];
      return (
        <div key={section.id}>
          <header className={stepsStyles.sectionHeader}>
            <h3 className={stepsStyles.sectionHeader__title}>
              {section.title}
            </h3>
            <span>
              {section.section_type === 'multi' ? (
                <DiamondLayersIcon
                  className={stepsStyles.sectionHeader__icon}
                />
              ) : (
                <DiamondIcon className={stepsStyles.sectionHeader__icon} />
              )}
            </span>
            <button className={stepsStyles.deleteAction} disabled>
              <TrashIcon />
              Delete
            </button>
          </header>
          <ul>
            {sectionItems.map((item) => (
              <EditableItem
                item={item}
                key={item.id}
                forceVisible={forceVisible}
                onUpdateTitle={(title) => updateItemTitle(item.id, title)}
                onUpdateType={() => onUpdateItemType(item)}
              />
            ))}
          </ul>
          <AddItemAction
            inputTypes={inputTypes}
            sectionId={section.id}
            addItem={addItem}
          />
        </div>
      );
    })}
  </>
);

export default SectionItems;
