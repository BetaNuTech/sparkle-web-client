import { FunctionComponent } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import Item from './Item';

interface Props {
  item: any;
  onUpdateTitle(title: string): void;
  onUpdateType(): void;
  id: string;
  onSelectItem(itemId: string): void;
  selectedItems: string[];
  errors: Record<string, string>;
  errorMessage: string;
}

const SortableItem: FunctionComponent<Props> = ({
  id,
  item,
  onUpdateTitle,
  onUpdateType,
  onSelectItem,
  selectedItems,
  errors,
  errorMessage
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 5 : 0,
    opacity: isDragging ? 0 : 1
  };

  return (
    <Item
      item={item}
      onUpdateTitle={onUpdateTitle}
      onUpdateType={onUpdateType}
      onSelectItem={onSelectItem}
      selectedItems={selectedItems}
      ref={setNodeRef}
      style={style}
      errors={errors}
      errorMessage={errorMessage}
      {...attributes}
      {...listeners}
    />
  );
};

export default SortableItem;
