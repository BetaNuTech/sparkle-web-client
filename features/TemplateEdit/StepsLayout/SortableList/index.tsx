import { FunctionComponent, useMemo } from 'react';

import {
  SortableContext,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';

import TemplateSectionModel from '../../../../common/models/inspectionTemplateSection';
import TemplateItemModel from '../../../../common/models/inspectionTemplateItem';

import SortableItem from './SortableItem';

interface Props {
  items: TemplateSectionModel[] | TemplateItemModel[];
  forceVisible?: boolean;
  onUpdateTitle(id: string, title: string): void;
  onUpdateType(item: TemplateSectionModel | TemplateItemModel): void;
}

const SortableList: FunctionComponent<Props> = ({
  forceVisible,
  items,
  onUpdateTitle,
  onUpdateType
}) => {
  const itemIds = useMemo(() => items.map((item) => item.id), [items]);

  return (
    <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
      {items.map((item) => (
        <SortableItem
          key={item.id}
          id={item.id}
          item={item}
          forceVisible={forceVisible}
          onUpdateTitle={(title: string) => onUpdateTitle(item.id, title)}
          onUpdateType={() => onUpdateType(item)}
        />
      ))}
    </SortableContext>
  );
};

export default SortableList;
