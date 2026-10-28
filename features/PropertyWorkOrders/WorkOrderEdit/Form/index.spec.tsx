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

  it('should not mark the unit required and should explain a blank unit when creating', () => {
    const { rerender } = render(<Form {...baseProps} />);
    expect(
      screen.getByTestId('work-order-field-unit').textContent
    ).not.toContain('*');
    expect(screen.getByTestId('work-order-field-unit').textContent).toContain(
      'Leave the unit blank for a request that is not about a unit'
    );
    rerender(<Form {...baseProps} isCreating={false} />);
    expect(
      screen.getByTestId('work-order-field-unit').textContent
    ).not.toContain('Leave the unit blank');
  });

  it('should invoke change handler when a field is edited', () => {
    const onChange = sinon.spy();
    render(<Form {...baseProps} onChange={onChange} />);
    userEvent.type(screen.getByTestId('work-order-input-unit'), '1');
    expect(onChange.called).toEqual(true);
  });
});

const unitOptions = [
  { unit: '1-103', resident: 't0225029', label: '1-103 · Jane Doe' },
  { unit: '2-201', resident: 't0225030', label: '2-201 · Sam Roe' }
];

describe('Unit | Features | Property Work Orders | Work Order Edit | Form | Unit Picker', () => {
  it('should offer the current residents units plus a manual entry when creating', () => {
    render(<Form {...baseProps} unitOptions={unitOptions} />);
    const picker = screen.getByTestId('work-order-input-unitPicker');
    const labels = Array.from(picker.querySelectorAll('option')).map(
      (o) => o.textContent
    );
    expect(labels).toEqual([
      'Select a unit…',
      'No unit',
      '1-103 · Jane Doe',
      '2-201 · Sam Roe',
      'Enter a unit manually…'
    ]);
    expect(screen.queryByTestId('work-order-input-unit')).toBeNull();
    expect(screen.queryByTestId('work-order-input-resident')).toBeNull();
  });

  it('should not offer the picker when editing or when there are no units', () => {
    const { rerender } = render(
      <Form {...baseProps} isCreating={false} unitOptions={unitOptions} />
    );
    expect(screen.queryByTestId('work-order-input-unitPicker')).toBeNull();
    expect(screen.queryByTestId('work-order-input-unit')).toBeTruthy();

    rerender(<Form {...baseProps} unitOptions={[]} />);
    expect(screen.queryByTestId('work-order-input-unitPicker')).toBeNull();
    expect(screen.queryByTestId('work-order-input-unit')).toBeTruthy();
  });

  it('should hand the picked unit and its resident back', () => {
    const onUnitPick = sinon.spy();
    render(
      <Form {...baseProps} unitOptions={unitOptions} onUnitPick={onUnitPick} />
    );
    const picker = screen.getByTestId('work-order-input-unitPicker');
    const [, second] = Array.from(picker.querySelectorAll('option')).slice(2);
    userEvent.selectOptions(picker, second.getAttribute('value'));
    expect(onUnitPick.firstCall.args).toEqual([unitOptions[1]]);
  });

  it('should swap the picker for typed unit and tenant inputs on manual entry', () => {
    const onUnitPick = sinon.spy();
    render(
      <Form {...baseProps} unitOptions={unitOptions} onUnitPick={onUnitPick} />
    );
    userEvent.selectOptions(
      screen.getByTestId('work-order-input-unitPicker'),
      'manual'
    );
    expect(onUnitPick.firstCall.args).toEqual([null]);
    expect(screen.queryByTestId('work-order-input-unitPicker')).toBeNull();
    expect(screen.queryByTestId('work-order-input-unit')).toBeTruthy();
    expect(screen.queryByTestId('work-order-input-resident')).toBeTruthy();
    expect(screen.queryByTestId('work-order-unit-pick')).toBeTruthy();
  });

  it('should return to the picker from manual entry', () => {
    const onUnitPick = sinon.spy();
    render(
      <Form {...baseProps} unitOptions={unitOptions} onUnitPick={onUnitPick} />
    );
    userEvent.selectOptions(
      screen.getByTestId('work-order-input-unitPicker'),
      'manual'
    );
    userEvent.click(screen.getByTestId('work-order-unit-pick'));
    expect(onUnitPick.secondCall.args).toEqual([null]);
    expect(screen.queryByTestId('work-order-input-unitPicker')).toBeTruthy();
    expect(screen.queryByTestId('work-order-input-unit')).toBeNull();
    expect(screen.queryByTestId('work-order-unit-pick')).toBeNull();
  });

  it('should not accept a due date before today', () => {
    render(<Form {...baseProps} />);
    const today = new Date();
    const expected = `${today.getFullYear()}-${`${
      today.getMonth() + 1
    }`.padStart(2, '0')}-${`${today.getDate()}`.padStart(2, '0')}`;
    expect(
      screen.getByTestId('work-order-input-dueDate').getAttribute('min')
    ).toEqual(expected);
  });

  it('should show a typed unit that is not among the options in the typed inputs', () => {
    render(
      <Form
        {...baseProps}
        unitOptions={unitOptions}
        values={{ ...EMPTY_FORM_VALUES, unit: '9-999' }}
      />
    );
    expect(screen.queryByTestId('work-order-input-unitPicker')).toBeNull();
    expect(
      (screen.getByTestId('work-order-input-unit') as HTMLInputElement).value
    ).toEqual('9-999');
    expect(screen.queryByTestId('work-order-unit-pick')).toBeTruthy();
  });

  it('should select the option matching the current unit and resident', () => {
    render(
      <Form
        {...baseProps}
        unitOptions={unitOptions}
        values={{ ...EMPTY_FORM_VALUES, unit: '2-201', resident: 't0225030' }}
      />
    );
    const picker = screen.getByTestId(
      'work-order-input-unitPicker'
    ) as HTMLSelectElement;
    expect(picker.selectedOptions[0].textContent).toEqual('2-201 · Sam Roe');
    expect(screen.queryByTestId('work-order-input-unit')).toBeNull();
  });

  it('should hold the picker disabled while units load', () => {
    render(
      <Form {...baseProps} unitOptions={[]} unitOptionsStatus="loading" />
    );
    const picker = screen.getByTestId(
      'work-order-input-unitPicker'
    ) as HTMLSelectElement;
    expect(picker.disabled).toEqual(true);
    expect(picker.options[0].textContent).toEqual('Loading units…');
    expect(screen.queryByTestId('work-order-input-unit')).toBeNull();
  });

  it('should show the unit error on the picker rather than the hidden input', () => {
    render(
      <Form
        {...baseProps}
        unitOptions={unitOptions}
        errors={{ unit: 'Unit is required' }}
      />
    );
    expect(
      screen.getByTestId('work-order-error-unitPicker').textContent
    ).toEqual('Unit is required');
  });

  it('should clear the unit and keep the picker on no unit when chosen', () => {
    const onUnitPick = sinon.spy();
    render(
      <Form {...baseProps} unitOptions={unitOptions} onUnitPick={onUnitPick} />
    );
    userEvent.selectOptions(
      screen.getByTestId('work-order-input-unitPicker'),
      'no-unit'
    );
    expect(onUnitPick.firstCall.args).toEqual([null]);
    const picker = screen.getByTestId(
      'work-order-input-unitPicker'
    ) as HTMLSelectElement;
    expect(picker.selectedOptions[0].textContent).toEqual('No unit');
    expect(screen.queryByTestId('work-order-input-unit')).toBeNull();
    expect(
      screen.getByTestId('work-order-field-unitPicker').textContent
    ).toContain('Filed against the property');
  });

  it('should warn about a typed unit no current resident holds without blocking it', () => {
    const { rerender } = render(
      <Form
        {...baseProps}
        unitOptions={unitOptions}
        values={{ ...EMPTY_FORM_VALUES, unit: '9-999' }}
      />
    );
    expect(screen.getByTestId('work-order-field-unit').textContent).toContain(
      'No current resident holds this unit'
    );
    expect(screen.queryByTestId('work-order-error-unit')).toBeNull();

    rerender(
      <Form
        {...baseProps}
        unitOptions={unitOptions}
        values={{ ...EMPTY_FORM_VALUES, unit: '1-103' }}
      />
    );
    expect(
      screen.getByTestId('work-order-field-unit').textContent
    ).not.toContain('No current resident holds this unit');
  });
});
