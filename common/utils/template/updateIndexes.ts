import deepClone from '../../../__tests__/helpers/deepClone';
import TemplateItemModel from '../../models/inspectionTemplateItem';
import TemplateSectionModel from '../../models/inspectionTemplateSection';

// Increment/Decrement the index of each
// template section or item by updated index
export default function updateIndexes(
  items: Record<string, TemplateItemModel | TemplateSectionModel>,
  srcStartIndex = 0,
  targetId: string
): Record<string, TemplateItemModel | TemplateSectionModel> {
  const result = {};

  const indexToBePlaced = Number(srcStartIndex); // clone

  const indexToBeChanged = items[targetId].index;

  Object.keys(items).forEach((key: string) => {
    const item = deepClone(items[key]) as
      | TemplateItemModel
      | TemplateSectionModel;
    let indexTarget = indexToBeChanged;
    let isMoving = false;

    // check if item index is less then updated item previous index
    // and its >= updated item updated index
    if (
      indexToBePlaced < indexToBeChanged &&
      item.index < indexToBeChanged &&
      item.index >= indexToBePlaced
    ) {
      indexTarget = item.index + 1;
      isMoving = true;

      // check if item index is greater then updated item previous index
      // and its <= updated item updated index
    } else if (item.index > indexToBeChanged && item.index <= indexToBePlaced) {
      indexTarget = item.index - 1;
      isMoving = true;
    }

    // check if current item is same as updated item
    // then assign item updated index
    if (item.id === targetId) {
      indexTarget = indexToBePlaced;
      isMoving = true;
    }

    if (isMoving) {
      item.index = indexTarget;
      result[key] = item;
    }
  });
  return result;
}
