import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import MoveToDropdown from './index';
import {
  deficientItemStateOrder,
  deficientItemTransitions
} from '../../../../../config/deficientItems';
import utilString from '../../../../../common/utils/string';

describe('Unit | Features | Deficient Item List | State Item Header | Move To Dropdown', () => {
  it('should render menu options based on current state', () => {
    const props = {
      currentState: 'pending',
      onClick: sinon.spy(),
      isEnabled: true,
      canGoBack: true,
      canClose: true,
      canDefer: true
    };
    const { rerender } = render(<MoveToDropdown {...props} />);

    const tests = deficientItemStateOrder.map((state) => ({
      currentState: state,
      expected: deficientItemTransitions[state].map((item) =>
        utilString.titleize(utilString.dedash(item.label || item.value))
      )
    }));

    // eslint-disable-next-line no-restricted-syntax
    for (const test of tests) {
      const { currentState, expected } = test;
      const componentProps = { ...props, currentState };
      rerender(<MoveToDropdown {...componentProps} />);
      const itemsEl = screen.queryAllByTestId('move-to-item');
      expect(itemsEl.length).toEqual(expected.length);
      if (itemsEl.length) {
        itemsEl.forEach((el, index) => {
          expect(el).toHaveTextContent(expected[index]);
        });
      }
    }
  });

  it('should render not render go-back option if user does not have permission', () => {
    const props = {
      currentState: 'completed',
      onClick: sinon.spy(),
      isEnabled: true,
      canGoBack: false,
      canClose: true,
      canDefer: true
    };
    render(<MoveToDropdown {...props} />);
    const itemsEl = screen.queryAllByTestId('move-to-item');
    itemsEl.forEach((el) => {
      expect(el).not.toHaveTextContent('Go Back');
    });
  });

  it('should render not render close option if does not have permission', () => {
    const props = {
      currentState: 'completed',
      onClick: sinon.spy(),
      isEnabled: true,
      canGoBack: false,
      canClose: false,
      canDefer: true
    };
    render(<MoveToDropdown {...props} />);
    const itemsEl = screen.queryAllByTestId('move-to-item');
    itemsEl.forEach((el) => {
      expect(el).not.toHaveTextContent('Close');
    });
  });

  it('should render not render deferred option if does not have permission', () => {
    const props = {
      currentState: 'requires-action',
      onClick: sinon.spy(),
      isEnabled: true,
      canGoBack: true,
      canClose: true,
      canDefer: false
    };
    render(<MoveToDropdown {...props} />);
    const itemsEl = screen.queryAllByTestId('move-to-item');
    itemsEl.forEach((el) => {
      expect(el).not.toHaveTextContent('Deferred');
    });
  });
});
