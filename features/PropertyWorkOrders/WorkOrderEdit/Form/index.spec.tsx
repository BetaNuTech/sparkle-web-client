import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import sinon from 'sinon';
import customValues from '../../../../__mocks__/yardi/customValues';
import { EMPTY_FORM_VALUES } from '../formValues';
import Form from './index';

const optionValues = (testId: string): string[] =>
  Array.from(screen.getByTestId(testId).querySelectorAll('option'))
    .map((o) => o.getAttribute('value'))
    .filter(Boolean);

const baseProps = {
  values: EMPTY_FORM_VALUES,
  customValues,
  errors: {},
  isCreating: true,
  isDisabled: false,
  onChange: () => null
};

describe('Unit | Features | Property Work Orders | Work Order Edit | Form', () => {
  it('should populate pickers from the custom values', () => {
    render(<Form {...baseProps} />);
    expect(optionValues('work-order-input-priority')).toEqual(
      customValues.priorities
    );
    expect(optionValues('work-order-input-category')).toEqual([
      'Plumbing',
      'Electrical',
      'Doors'
    ]);
    expect(optionValues('work-order-input-status')).toEqual(
      customValues.statuses.map((s) => s.name)
    );
    expect(optionValues('work-order-input-resolution')).toEqual(
      customValues.resolutions
    );
  });

  it('should only show the sub category picker for categories with real sub categories', () => {
    const { rerender } = render(<Form {...baseProps} />);
    expect(screen.queryByTestId('work-order-input-subCategory')).toBeNull();

    rerender(
      <Form
        {...baseProps}
        values={{ ...EMPTY_FORM_VALUES, category: 'Doors' }}
      />
    );
    expect(screen.queryByTestId('work-order-input-subCategory')).toBeNull();

    rerender(
      <Form
        {...baseProps}
        values={{ ...EMPTY_FORM_VALUES, category: 'Plumbing' }}
      />
    );
    expect(optionValues('work-order-input-subCategory')).toEqual([
      'Leak',
      'Clog'
    ]);
  });

  it('should only show the reason picker for statuses with reasons and mark it required', () => {
    const { rerender } = render(
      <Form {...baseProps} values={{ ...EMPTY_FORM_VALUES, status: 'Call' }} />
    );
    expect(screen.queryByTestId('work-order-input-reason')).toBeNull();

    rerender(
      <Form
        {...baseProps}
        values={{ ...EMPTY_FORM_VALUES, status: 'On Hold' }}
      />
    );
    expect(optionValues('work-order-input-reason')).toEqual([
      'Awaiting parts',
      'Resident unavailable'
    ]);
    expect(screen.getByTestId('work-order-field-reason').textContent).toContain(
      '*'
    );

    rerender(
      <Form
        {...baseProps}
        values={{ ...EMPTY_FORM_VALUES, status: 'Canceled' }}
      />
    );
    expect(
      screen.getByTestId('work-order-field-reason').textContent
    ).not.toContain('*');
  });

  it('should keep an unknown current picker value selectable', () => {
    render(
      <Form
        {...baseProps}
        values={{ ...EMPTY_FORM_VALUES, status: 'legacy status' }}
      />
    );
    expect(optionValues('work-order-input-status')).toContain('legacy status');
  });

  it('should enforce yardi max lengths on text inputs', () => {
    render(<Form {...baseProps} />);
    expect(screen.getByTestId('work-order-input-unit')).toHaveAttribute(
      'maxlength',
      '8'
    );
    expect(
      screen.getByTestId('work-order-input-briefDescription')
    ).toHaveAttribute('maxlength', '35');
    expect(screen.getByTestId('work-order-input-description')).toHaveAttribute(
      'maxlength',
      '1500'
    );
  });

  it('should show field errors next to their inputs', () => {
    render(
      <Form
        {...baseProps}
        errors={{ unit: 'unit does not exist', priority: 'invalid priority' }}
      />
    );
    expect(screen.getByTestId('work-order-error-unit').textContent).toEqual(
      'unit does not exist'
    );
    expect(screen.getByTestId('work-order-error-priority').textContent).toEqual(
      'invalid priority'
    );
    expect(screen.queryByTestId('work-order-error-status')).toBeNull();
  });

  it('should require the unit only when creating', () => {
    const { rerender } = render(<Form {...baseProps} />);
    expect(screen.getByTestId('work-order-field-unit').textContent).toContain(
      '*'
    );
    rerender(<Form {...baseProps} isCreating={false} />);
    expect(
      screen.getByTestId('work-order-field-unit').textContent
    ).not.toContain('*');
  });

  it('should invoke change handler when a field is edited', () => {
    const onChange = sinon.spy();
    render(<Form {...baseProps} onChange={onChange} />);
    userEvent.type(screen.getByTestId('work-order-input-unit'), '1');
    expect(onChange.called).toEqual(true);
  });
});
