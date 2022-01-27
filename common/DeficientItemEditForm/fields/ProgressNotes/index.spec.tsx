import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';
import ProgressNotes from './index';

describe('Unit | Common | Deficient Item Edit Form | fields | Progress Notes', () => {
  afterEach(() => sinon.restore());

  it('should hides progress notes section when not relevant', () => {
    render(
      <ProgressNotes
        deficientItem={createDeficientItem({ state: 'pending' })}
        isMobile={false}
        onShowProgressNotes={sinon.spy()}
        onChangeProgressNote={sinon.spy()}
        isVisible={false} // eslint-disable-line react/jsx-boolean-value
        isEditable={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const progressNotesSection = screen.queryByTestId('item-progress-note');
    expect(progressNotesSection).toBeNull();
  });

  it('should hides progress notes textarea when not relevant', () => {
    render(
      <ProgressNotes
        deficientItem={createDeficientItem({ state: 'pending' })}
        isMobile={false}
        onShowProgressNotes={sinon.spy()}
        onChangeProgressNote={sinon.spy()}
        isVisible={false} // eslint-disable-line react/jsx-boolean-value
        isEditable={false} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const textareaEl = screen.queryByTestId('item-progress-note-textarea');
    expect(textareaEl).toBeNull();
  });

  it('should not render show all button when deficient item does not have progress notes', () => {
    render(
      <ProgressNotes
        deficientItem={createDeficientItem({ state: 'pending' })}
        isMobile={false}
        onShowProgressNotes={sinon.spy()}
        onChangeProgressNote={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        isEditable={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const showPreviousBtn = screen.queryByTestId(
      'show-previous-progress-note-btn'
    );
    expect(showPreviousBtn).toBeNull();
  });

  it('should render latest progress notes', () => {
    const deficientItem = createDeficientItem(
      { state: 'pending' },
      { progressNotes: 3 }
    );
    const sortedProgressNotes = Object.keys(deficientItem.progressNotes)
      .map((id) => ({ ...deficientItem.progressNotes[id], id }))
      .sort(
        ({ createdAt: aCreatedAt }, { createdAt: bCreatedAt }) =>
          bCreatedAt - aCreatedAt
      );
    const latestProgressNote = sortedProgressNotes[0].progressNote;
    render(
      <ProgressNotes
        deficientItem={deficientItem}
        isMobile={false}
        onShowProgressNotes={sinon.spy()}
        onChangeProgressNote={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        isEditable={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const progressNotesText = screen.queryByTestId('item-progress-note-text');
    expect(progressNotesText).toBeTruthy();
    expect(progressNotesText).toHaveTextContent(latestProgressNote);
  });

  it('should only reveals show all button when deficient item has progress notes', () => {
    const onShowProgressNotes = sinon.spy();
    render(
      <ProgressNotes
        deficientItem={createDeficientItem(
          { state: 'pending' },
          { progressNotes: 1 }
        )}
        isMobile={false}
        onShowProgressNotes={onShowProgressNotes}
        onChangeProgressNote={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        isEditable={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const showPreviousBtn = screen.queryByTestId(
      'show-previous-progress-note-btn'
    );
    expect(showPreviousBtn).toBeTruthy();
  });

  it('should trigger request to show all progress notes', () => {
    const expected = true;
    const onShowProgressNotes = sinon.spy();
    render(
      <ProgressNotes
        deficientItem={createDeficientItem(
          { state: 'pending' },
          { progressNotes: 1 }
        )}
        isMobile={false}
        onShowProgressNotes={onShowProgressNotes}
        onChangeProgressNote={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        isEditable={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const showPreviousBtn = screen.queryByTestId(
      'show-previous-progress-note-btn'
    );
    expect(showPreviousBtn).toBeTruthy();
    act(() => {
      userEvent.click(showPreviousBtn);
    });
    const actual = onShowProgressNotes.called;
    expect(actual).toBe(expected);
  });

  it('should request to update progress notes', () => {
    const expected = true;
    const onChangeProgressNote = sinon.spy();

    render(
      <ProgressNotes
        deficientItem={createDeficientItem({ state: 'pending' })}
        isMobile={false}
        onShowProgressNotes={sinon.spy()}
        onChangeProgressNote={onChangeProgressNote}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
        isEditable={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const textareaEl = screen.queryByTestId('item-progress-note-textarea');
    expect(textareaEl).toBeTruthy();
    act(() => {
      fireEvent.change(textareaEl, {
        target: { value: 'progress notes' }
      });
    });
    const actual = onChangeProgressNote.called;
    expect(actual).toBe(expected);
  });
});
