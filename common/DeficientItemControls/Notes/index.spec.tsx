import { render, screen } from '@testing-library/react';
import sinon from 'sinon';
import DeficientItemNotes from './index';
import {
  deficientItem,
  deficientItemWithNotes
} from '../../../__mocks__/deficientItems';

describe('Unit | Common | Deficient Item Controls | Notes ', () => {
  afterEach(() => sinon.restore());

  it('it renders provided inspector notes', () => {
    const expected = deficientItemWithNotes.itemInspectorNotes;
    // eslint-disable-next-line react/jsx-boolean-value
    render(
      <DeficientItemNotes
        deficientItem={deficientItemWithNotes}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const inspectorNotes = screen.queryByTestId('item-inspector-notes');
    expect(inspectorNotes).toHaveTextContent(expected);
  });

  it('should not render inspector notes section if inspector notes does not present', () => {
    render(
      <DeficientItemNotes deficientItem={deficientItem} isVisible={false} />
    );

    const inspectorNotes = screen.queryByTestId('item-notes');
    expect(inspectorNotes).toBeNull();
  });
});
