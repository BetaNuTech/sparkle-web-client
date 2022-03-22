import utilArray from '../array';

export interface IndexedRecord {
  index: number;
}

// Increment/Decrement the index of each
// template section or item by updated index
export default function updateIndexes(
  src: Record<string, IndexedRecord>,
  targetIndex = 0,
  targetId: string
): Record<string, IndexedRecord> {
  const targetCurrentIndex = src[targetId].index;

  // Check if target is moving up or down
  const isMovingUp = targetIndex < targetCurrentIndex;

  // Create indexes that need to be assigned
  const movingIndexes = isMovingUp
    ? utilArray.range(targetIndex, targetCurrentIndex - 1)
    : utilArray.range(targetCurrentIndex + 1, targetIndex);

  return Object.keys(src).reduce((acc, id: string) => {
    const currentIndex = Number(src[id].index);
    const isMoving = movingIndexes.some((index) => index === currentIndex);

    if (isMoving) {
      acc[id] = {
        index: isMovingUp ? currentIndex + 1 : currentIndex - 1
      };
    } else if (id === targetId) {
      acc[id] = { index: targetIndex };
    }

    return acc;
  }, {});
}

// Decrement indexes after a
// removed record
export function removeAtIndex(
  src: Record<string, IndexedRecord>,
  targetIndex = 0
): Record<string, IndexedRecord> {
  return Object.keys(src).reduce((acc, id: string) => {
    const item = src[id];

    if (item && item.index > targetIndex) {
      acc[id] = { index: item.index - 1 };
    }

    return acc;
  }, {});
}

// Merge source into one data set
// giving priority to local records
// over remote updates
export function mergeIndexedRecords(
  currentSrc: Record<string, IndexedRecord>,
  updatedSrc: Record<string, IndexedRecord>
): Record<string, IndexedRecord> {
  const itemIds = [
    ...Object.keys(currentSrc),
    ...Object.keys(updatedSrc)
  ].filter((id, i, arr) => arr.indexOf(id) === i && updatedSrc[id] !== null); // unique and filter removed item

  return itemIds.reduce((acc, id) => {
    if (updatedSrc[id] && typeof updatedSrc[id].index === 'number') {
      acc[id] = { index: Number(updatedSrc[id].index) };
    } else if (currentSrc[id]) {
      acc[id] = { index: Number(currentSrc[id].index) };
    }
    return acc;
  }, {});
}
