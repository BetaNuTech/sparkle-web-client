import { FunctionComponent, RefObject, useMemo } from 'react';

import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import TemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import TemplateItemModel from '../../../../common/models/inspectionTemplateItem';

import SortableItem from './SortableItem';
// type Ref = (element: HTMLElement) => void | { current: HTMLElement };

interface Props {
  items: TemplateSectionModel[] | TemplateItemModel[];
  onUpdateTitle(id: string, title: string): void;
  onUpdateType(item: TemplateSectionModel | TemplateItemModel): void;
  onSelectItem(itemId: string): void;
  selectedItems: string[];
  errors: Record<string, string>;
  errorMessage: string;
  inputRef: RefObject<HTMLParagraphElement[]>;
}

const SortableList: FunctionComponent<Props> = ({
  items,
  onUpdateTitle,
  onUpdateType,
  onSelectItem,
  selectedItems,
  errors,
  errorMessage,
  inputRef
}) => {
  const itemIds = useMemo(() => items.map((item) => item.id), [items]);

  inputRef.current.splice(0, inputRef.current.length);
  return (
    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
      {items.map((item) => (
        <SortableItem
          key={item.id}
          id={item.id}
          item={item}
          onUpdateTitle={(title: string) => onUpdateTitle(item.id, title)}
          onUpdateType={() => onUpdateType(item)}
          onSelectItem={onSelectItem}
          selectedItems={selectedItems}
          errors={errors}
          errorMessage={errorMessage}
          inputRef={inputRef}
        />
      ))}
    </SortableContext>
  );
};

export default SortableList;
