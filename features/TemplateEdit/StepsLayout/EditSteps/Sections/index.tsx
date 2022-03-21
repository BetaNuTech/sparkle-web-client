import { FunctionComponent, useMemo, useState } from 'react';
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
import stepsStyles from '../styles.module.scss';
import AddIcon from '../../../../../public/icons/ios/add.svg';
import SortableList from '../../SortableList';
import globalEvents from '../../../../../common/utils/globalEvents';
import Droppable from '../../SortableList/Droppable';
import Item from '../../SortableList/SortableItem/Item';

interface Props {
  sortedSections: TemplateSectionModel[];
  forceVisible?: boolean;
  addSection(): void;
  updateSectionTitle(sectionId: string, title: string): void;
  onUpdateSectionType(section: TemplateSectionModel): void;
  updateSectionIndex(sectionId: string, index: number): void;
  removeSection(sectionId: string): void;
}

const Sections: FunctionComponent<Props> = ({
  forceVisible,
  sortedSections,
  addSection,
  updateSectionTitle,
  onUpdateSectionType,
  updateSectionIndex,
  removeSection
}) => {
  const [activeId, setActiveId] = useState(null);
  const activeItem = useMemo(
    () =>
      sortedSections.find((item: TemplateSectionModel) => item.id === activeId),
    [activeId, sortedSections]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(TouchSensor),
    useSensor(MouseSensor)
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    const { id } = active;

    if (over.id === 'section-remove') {
      removeSection(id);
    } else {
      const updatedIndex = sortedSections.findIndex(
        (section) => section.id === over.id
      );
      updateSectionIndex(id, updatedIndex);
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
      <section>
        <header className={stepsStyles.header}>
          <h3 className={stepsStyles.header__title}>Sections</h3>
          <button className={stepsStyles.deleteAction} disabled>
            <TrashIcon />
            Delete
          </button>
        </header>
        <SortableList
          items={sortedSections}
          onUpdateTitle={updateSectionTitle}
          onUpdateType={onUpdateSectionType}
          forceVisible={forceVisible}
        />
        <Droppable id="section-remove">
          <div className={stepsStyles.action} onClick={addSection}>
            <span>Add new section</span>
            <button className={stepsStyles.action__icon}>
              <AddIcon />
            </button>
          </div>
        </Droppable>
      </section>
      {createPortal(
        <DragOverlay>
          {activeId ? (
            <Item item={activeItem} forceVisible={forceVisible} />
          ) : null}
        </DragOverlay>,
        document.body
      )}
    </DndContext>
  );
};

export default Sections;
