import { useEffect, useState } from 'react';
import propertyTrelloIntegrationModel from '../../../common/models/propertyTrelloIntegration';
import { trelloBoard, trelloList } from '../../../common/services/api/trello';

type SelectedItem = trelloBoard | trelloList;

export interface Selected {
  openBoard: trelloBoard;
  openList: trelloList;
  closeBoard: trelloBoard;
  closeList: trelloList;
}

interface usePropertyTrelloSelectionResult {
  hasSelectionChange: boolean;
  selectedOptions: Selected;
  onSelect(selection: SelectedItem): void;
  handleboardSelection(findLists: (id: string, isOpen: boolean) => void): void;
}

// Hooks for filtering jobs list
export default function usePropertyTrelloSelection(
  initialSelection: propertyTrelloIntegrationModel,
  activeSelection: string
): usePropertyTrelloSelectionResult {
  // const [hasSelectionChange, setHasSelectionChange] = useState(false);
  const [selectedOptions, setselectedOptions] = useState<Selected>(
    getSelectedOptions(initialSelection)
  );
  const emptyOption = { id: '', name: '' } as SelectedItem;
  const hasSelectionChange = hasUpdates(initialSelection, selectedOptions);

  // Checks if a selection is already selected and updates state
  const onSelect = (selection: { name: string; id: string }) => {
    const singleOption = activeSelection.slice(0, -1);
    const isAlreadySelected = selectedOptions[singleOption] === selection;
    // setHasSelectionChange(true);

    setselectedOptions({
      ...selectedOptions,
      [singleOption]: isAlreadySelected ? emptyOption : selection
    });
  };

  // Fetch lists and remove boards actively selected list
  const handleboardSelection = (findLists) => {
    if (activeSelection === 'openBoards') {
      findLists(selectedOptions.openBoard.id, true);
      setselectedOptions({ ...selectedOptions, openList: emptyOption });
    } else if (activeSelection === 'closeBoards') {
      findLists(selectedOptions.closeBoard.id, false);
      setselectedOptions({ ...selectedOptions, closeList: emptyOption });
    }
  };

  useEffect(() => {
    setselectedOptions(getSelectedOptions(initialSelection));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(initialSelection)]);

  return {
    handleboardSelection,
    onSelect,
    selectedOptions,
    hasSelectionChange
  };
}

const getSelectedOptions = (selection: propertyTrelloIntegrationModel) => ({
  openBoard: {
    id: selection.openBoard,
    name: selection.openBoardName
  },
  openList: {
    id: selection.openList,
    name: selection.openListName
  },
  closeBoard: {
    id: selection.closedBoard,
    name: selection.closedBoardName
  },
  closeList: {
    id: selection.closedList,
    name: selection.closedListName
  }
});

const hasUpdates = (
  current: propertyTrelloIntegrationModel,
  updated: Selected
) => {
  const { closedBoard, closedList, openBoard, openList } = current;
  const isUpdated =
    closedBoard !== updated.closeBoard.id ||
    openBoard !== updated.openBoard.id ||
    closedList !== updated.closeList.id ||
    openList !== updated.openList.id;

  return isUpdated;
};
