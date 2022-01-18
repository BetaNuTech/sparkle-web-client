import { render, screen } from '@testing-library/react';
import sinon from 'sinon';
import DeficientItemNotes from './index';
import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';

describe('Unit | Common | Deficient Item Edit Form | fields | Notes ', () => {
  afterEach(() => sinon.restore());

  it('it renders provided inspector notes', () => {
    const expected = 'should really render this';
    const deficientItem = createDeficientItem({ itemInspectorNotes: expected });

    // eslint-disable-next-line react/jsx-boolean-value
    render(
      <DeficientItemNotes
        deficientItem={deficientItem}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const inspectorNotes = screen.queryByTestId('item-inspector-notes');
    expect(inspectorNotes).toHaveTextContent(expected);
  });

  it('should not render inspector notes section if inspector notes does not present', () => {
    const deficientItem = createDeficientItem({ itemInspectorNotes: '' });
    render(
      <DeficientItemNotes deficientItem={deficientItem} isVisible={false} />
    );

    const inspectorNotes = screen.queryByTestId('item-notes');
    expect(inspectorNotes).toBeNull();
  });
});
