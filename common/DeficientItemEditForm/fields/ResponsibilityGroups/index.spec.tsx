import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';
import { render, screen, fireEvent } from '@testing-library/react';
import sinon from 'sinon';
import { deficientItemResponsibilityGroups } from '../../../../config/deficientItems';
import createDeficientItem from '../../../../__tests__/helpers/createDeficientItem';
import ResponsibilityGroup from './index';

describe('Unit | Common | Deficient Item Edit Form | fields | Responsibility Group', () => {
  afterEach(() => sinon.restore());

  it('should hides current responsibility group section when not relevant', () => {
    render(
      <ResponsibilityGroup
        deficientItem={createDeficientItem({ state: 'requires-action' })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={sinon.spy()}
        isVisible={false} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const responsibilityGroupSection = screen.queryByTestId(
      'show-previous-responsibility'
    );
    expect(responsibilityGroupSection).toBeNull();
  });

  it('should not render show previous button when deficient item does not have previous history', () => {
    render(
      <ResponsibilityGroup
        deficientItem={createDeficientItem({ state: 'requires-action' })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const showPreviousBtn = screen.queryByTestId(
      'show-previous-responsibility-group-btn'
    );
    expect(showPreviousBtn).toBeNull();
  });

  it('should allows updating a responsibility group when deficient item has no current responsiblity group', () => {
    render(
      <ResponsibilityGroup
        deficientItem={createDeficientItem({
          state: 'requires-action',
          currentResponsibilityGroup: ''
        })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const selectEl = screen.queryByTestId('item-responsibility-group-select');

    const responsibilityGroupText = screen.queryByTestId(
      'item-responsibility-group-text'
    );
    expect(selectEl).toBeTruthy();
    expect(responsibilityGroupText).toBeNull();
  });

  it('should render current responsibility group', () => {
    const responsibilityGroup = deficientItemResponsibilityGroups[0];

    render(
      <ResponsibilityGroup
        deficientItem={createDeficientItem({
          state: 'requires-action',
          currentResponsibilityGroup: responsibilityGroup.value
        })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const responsibilityGroupText = screen.queryByTestId(
      'item-responsibility-group-text'
    );
    expect(responsibilityGroupText).toBeTruthy();
    expect(responsibilityGroupText).toHaveTextContent(
      responsibilityGroup.label
    );
  });

  it('should only reveals show state history button when deficient item has previous history', () => {
    const onShowHistory = sinon.spy();
    render(
      <ResponsibilityGroup
        deficientItem={createDeficientItem(
          { state: 'requires-action' },
          { responsibilityGroups: 1 }
        )}
        isMobile={false}
        onShowHistory={onShowHistory}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const showPreviousBtn = screen.queryByTestId(
      'show-previous-responsibility-group-btn'
    );
    expect(showPreviousBtn).toBeTruthy();
  });

  it('should trigger request to show previous responsibility group', () => {
    const expected = true;
    const onShowHistory = sinon.spy();
    render(
      <ResponsibilityGroup
        deficientItem={createDeficientItem(
          { state: 'requires-action' },
          { responsibilityGroups: 1 }
        )}
        isMobile={false}
        onShowHistory={onShowHistory}
        onChange={sinon.spy()}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const showPreviousBtn = screen.queryByTestId(
      'show-previous-responsibility-group-btn'
    );
    expect(showPreviousBtn).toBeTruthy();
    act(() => {
      userEvent.click(showPreviousBtn);
    });
    const actual = onShowHistory.called;
    expect(actual).toBe(expected);
  });

  it('should request to update responsibility group', () => {
    const expected = true;
    const onChange = sinon.spy();
    const responsibilityGroup = deficientItemResponsibilityGroups[0];

    render(
      <ResponsibilityGroup
        deficientItem={createDeficientItem({
          state: 'requires-action',
          currentResponsibilityGroup: ''
        })}
        isMobile={false}
        onShowHistory={sinon.spy()}
        onChange={onChange}
        isVisible={true} // eslint-disable-line react/jsx-boolean-value
      />
    );

    const selectEl = screen.queryByTestId('item-responsibility-group-select');
    expect(selectEl).toBeTruthy();
    act(() => {
      fireEvent.change(selectEl, {
        target: { value: responsibilityGroup.value }
      });
    });
    const actual = onChange.called;
    expect(actual).toBe(expected);
  });
});
