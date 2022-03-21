import { FunctionComponent } from 'react';
import { useDroppable } from '@dnd-kit/core';

interface Props {
  id: string;
  children: any;
}

const Droppable: FunctionComponent<Props> = ({ id, children }) => {
  const { setNodeRef } = useDroppable({
    id
  });

  return <div ref={setNodeRef}>{children}</div>;
};

export default Droppable;
