import { render, screen } from '@testing-library/react';
import {
  unselectedOneToFiveItem,
  emptyTextInputItem
} from '../../__mocks__/inspections';
import Controls from './index';

describe('Common | Inspection Item Controls', () => {
  it('should render a text input for the old text input schema', async () => {
    const oldTextSchemaItem = { ...emptyTextInputItem };
    delete oldTextSchemaItem.isTextInputItem; // remove new schema attr

    const props = {
      item: oldTextSchemaItem,
      canEdit: false
    };

    render(<Controls {...props} />);
    const textInput = screen.queryByTestId('item-text-input');

    expect(textInput).toBeTruthy();
  });

  it('should fallback to a two action thumb control when item type not discoverable', async () => {
    const undiscoverableItem = { ...unselectedOneToFiveItem };
    delete undiscoverableItem.mainInputType; // remove main type

    const props = {
      item: undiscoverableItem,
      canEdit: false
    };

    render(<Controls {...props} />);
    const thumbsUp = screen.queryByTestId('control-thumbs-up');

    expect(thumbsUp).toBeTruthy();
  });
});
