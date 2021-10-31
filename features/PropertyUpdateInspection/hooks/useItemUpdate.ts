import { useState } from 'react';
import inspectionTemplateItemModel from '../../../common/models/inspectionTemplateItem';

interface useItemUpdateResult {
  hasUpdates: boolean;
  inspectionUpdates: Record<string, inspectionTemplateItemModel>;
  setMainInputType(
    item: inspectionTemplateItemModel,
    mainInputType: string
  ): inspectionTemplateItemModel;
  setMainInputSelected(
    item: inspectionTemplateItemModel,
    currentItem: inspectionTemplateItemModel,
    selectionIndex: number,
    mainInputSelected: boolean,
    mainInputSelection: number
  ): inspectionTemplateItemModel;
  setMainInputSelection(
    item: inspectionTemplateItemModel,
    currentItem: inspectionTemplateItemModel,
    selectionIndex: number,
    mainInputSelection: number
  ): inspectionTemplateItemModel;
  updateMainInputSelection(
    item: inspectionTemplateItemModel,
    currentItem: inspectionTemplateItemModel,
    selectionIndex: number
  ): void;
}

export default function useInspectionItemUpdate(): useItemUpdateResult {
  const [inspectionUpdates, setInspectionUpdates] = useState({});
  const [hasUpdates, setHasUpdates] = useState(false);

  const setMainInputType = (
    item: inspectionTemplateItemModel,
    currentMainInputType: string
  ): inspectionTemplateItemModel => {
    if (!currentMainInputType) {
      item.mainInputType = 'twoactions_thumbs';
    }

    return item;
  };

  const setMainInputSelected = (
    item: inspectionTemplateItemModel,
    currentItem: inspectionTemplateItemModel,
    selectionIndex: number,
    mainInputSelected: boolean,
    mainInputSelection: number
  ): inspectionTemplateItemModel => {
    const inputSelected = mainInputSelected
      ? mainInputSelection !== selectionIndex
      : true;

    if (inputSelected !== currentItem.mainInputSelected) {
      item.mainInputSelected = inputSelected;
    }
    return item;
  };

  const setMainInputSelection = (
    item: inspectionTemplateItemModel,
    currentItem: inspectionTemplateItemModel,
    selectionIndex: number,
    mainInputSelection: number
  ): inspectionTemplateItemModel => {
    if (
      mainInputSelection !== selectionIndex &&
      currentItem.mainInputSelection !== selectionIndex
    ) {
      item.mainInputSelection = selectionIndex;
    }

    return item;
  };

  const updateMainInputSelection = (
    item: inspectionTemplateItemModel,
    currentItem: inspectionTemplateItemModel,
    selectionIndex: number
  ) => {
    let itemUpdates = {} as inspectionTemplateItemModel;

    itemUpdates = setMainInputType(itemUpdates, item.mainInputType);

    itemUpdates = setMainInputSelected(
      itemUpdates,
      currentItem,
      selectionIndex,
      item.mainInputSelected,
      item.mainInputSelection
    );

    itemUpdates = setMainInputSelection(
      itemUpdates,
      currentItem,
      selectionIndex,
      item.mainInputSelection
    );

    const itemId = item.id;
    const newItem = { [itemId]: itemUpdates };
    const updatedState = { ...inspectionUpdates, ...newItem };
    setInspectionUpdates(updatedState);

    // Set if local state has diverged
    // from the original/remote state
    const updated =
      Object.keys(updatedState).filter(
        (key) => Object.keys(updatedState[key]).length > 0
      ).length > 0;

    if (updated !== hasUpdates) {
      setHasUpdates(updated);
    }
  };

  return {
    hasUpdates,
    inspectionUpdates,
    setMainInputType,
    setMainInputSelected,
    setMainInputSelection,
    updateMainInputSelection
  };
}
