import { FunctionComponent, useState, useMemo } from 'react';
import { createPortal } from 'react-dom';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  TouchSensor,
  MouseSensor,
  DragOverlay
} from '@dnd-kit/core';

import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

import TrashIcon from '../../../../../public/icons/sparkle/trash.svg';
import TemplateSectionModel from '../../../../../common/models/inspectionTemplateSection';
import TemplateItemModel from '../../../../../common/models/inspectionTemplateItem';
import stepsStyles from '../styles.module.scss';
import DiamondIcon from '../../../../../public/icons/sparkle/diamond.svg';
import DiamondLayersIcon from '../../../../../public/icons/sparkle/diamond-layers.svg';
import AddItemAction from './AddItemAction';
import ErrorLabel from '../../../../../common/ErrorLabel';
import SortableList from '../../SortableList';
import globalEvents from '../../../../../common/utils/globalEvents';
import Droppable from '../../SortableList/Droppable';
import Item from '../../SortableList/SortableItem/Item';

const inputTypes = [
  { label: 'Item', value: 'main' },
  { label: 'Text Input', value: 'text_input' },
  { label: 'Signature', value: 'signature' }
];
interface Props {
  sections: TemplateSectionModel[];
  templateSectionItems: Map<string, TemplateItemModel[]>;
  addItem(sectionId: string, itemType: string): void;
  onUpdateItemType(item: TemplateItemModel): void;
  updateItemTitle(itemId: string, title: string): void;
  errors: Record<string, string>;
  updateItemIndex(itemId: string, index: number): void;
  removeItem(itemId: string): void;
  selectedItems: Record<string, string[]>;
  onSelectItems(sectionId: string, itemId: string): void;
  onDeleteItems(sectionId: string): void;
}

const SectionItems: FunctionComponent<Props> = ({
  sections,
  templateSectionItems,
  addItem,
  onUpdateItemType,
  updateItemTitle,
  updateItemIndex,
  removeItem,
  selectedItems,
  onSelectItems,
  onDeleteItems,
  errors
}) => {
  const [activeId, setActiveId] = useState(null);

  const flattenedItems = useMemo(() => {
    const allItems = [];
    templateSectionItems.forEach((items) => {
      allItems.push(...items);
    });
    return allItems as TemplateItemModel[];
  }, [templateSectionItems]);

  const activeItem = useMemo(
    () => flattenedItems.find((item) => item.id === activeId),
    [activeId, flattenedItems]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(MouseSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const { id } = active;
    const overItem = flattenedItems.find((item) => item.id === over.id);
    const movedItem = flattenedItems.find((item) => item.id === active.id);

    // only update item index if droped within secion
    // otherwise delete active item.
    if (overItem && movedItem.sectionId === overItem.sectionId) {
      updateItemIndex(id, overItem.index);
    } else {
      removeItem(id);
    }

    globalEvents.trigger('visibilityForceCheck');
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      modifiers={[restrictToVerticalAxis]}
    >
      <header className={stepsStyles.header} data-testid="section-item-header">
        <h3 className={stepsStyles.header__title}>Items</h3>
      </header>

      {sections.map((section) => {
        const sectionItems = templateSectionItems.get(section.id) || [];
        const selectedSectionItems = selectedItems[section.id] || [];
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
              <button
                className={stepsStyles.deleteAction}
                disabled={!selectedSectionItems.length}
                onClick={() => onDeleteItems(section.id)}
                data-testid="template-edit-item-delete"
              >
                <TrashIcon />
                Delete
              </button>
            </header>
            <SortableList
              items={sectionItems}
              onUpdateTitle={updateItemTitle}
              onUpdateType={onUpdateItemType}
              onSelectItem={(itemId) => onSelectItems(section.id, itemId)}
              selectedItems={selectedSectionItems}
              errors={errors}
              errorMessage={errors.itemTitle}
            />
            <ErrorLabel errors={errors} message={errors?.sectionItemError} />
            <Droppable id={`item-remove-${section.id}`}>
              <AddItemAction
                inputTypes={inputTypes}
                sectionId={section.id}
                addItem={addItem}
              />
            </Droppable>
          </div>
        );
      })}
      {createPortal(
        <DragOverlay>
          {activeId ? <Item item={activeItem} /> : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default SectionItems;
