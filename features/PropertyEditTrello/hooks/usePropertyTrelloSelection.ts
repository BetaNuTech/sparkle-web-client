import { useEffect, useState } from 'react';
import propertyTrelloIntegrationModel from '../../../common/models/propertyTrelloIntegration';

interface selected {
  openBoard: { name: string; id: string };
  openList: { name: string; id: string };
  closeBoard: { name: string; id: string };
  closeList: { name: string; id: string };
}

interface usePropertyTrelloSelectionResult {
  hasSelectionChange: boolean;
  selectedOptions: selected;
  onSelect(selection: { name: string; id: string }): void;
  handleboardSelection(findLists: (string, boolean) => void);
}

// Hooks for filtering jobs list
export default function usePropertyTrelloSelection(
  initialSelection: propertyTrelloIntegrationModel,
  activeSelection: string
): usePropertyTrelloSelectionResult {
  const [memo, setMemo] = useState('[]');
  const [hasSelectionChange, setHasSelectionChange] = useState(false);
  const [selectedOptions, setselectedOptions] = useState<selected>({
    openBoard: {
      id: initialSelection.openBoard,
      name: initialSelection.openBoardName
    },
    openList: {
      id: initialSelection.openList,
      name: initialSelection.openListName
    },
    closeBoard: {
      id: initialSelection.closedBoard,
      name: initialSelection.closedBoardName
    },
    closeList: {
      id: initialSelection.closedList,
      name: initialSelection.closedListName
    }
  });
  const emptyOption = { name: null, id: null };

  // Checks if a selection is already selected and updates state
  const onSelect = (selection: { name: string; id: string }) => {
    const singleOption = activeSelection.slice(0, -1);
    const isAlreadySelected = selectedOptions[singleOption] === selection;
    setHasSelectionChange(true);

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

  // Notify of updates
  // by updating memo
  /* eslint-disable */
  useEffect(() => {
    /* eslint-enable */
    const updated = JSON.stringify(selectedOptions);

    if (memo !== updated) {
      setMemo(updated);
    }
  });

  return {
    handleboardSelection,
    onSelect,
    selectedOptions,
    hasSelectionChange
  };
}
