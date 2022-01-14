import sinon from 'sinon';
import { render, act, fireEvent } from '@testing-library/react';
import TextInput from './index';

describe('Common | Inspection Item Controls | Text Input', () => {
  afterEach(() => sinon.restore());

  it('should render with blank value', async () => {
    const props = {
      selected: true,
      value: ''
    };

    const { container } = render(<TextInput {...props} />);

    const element = container.querySelector('input');
    expect(element).toBeVisible();
    expect(element).toHaveValue('');
  });

  it('should render provided text content', async () => {
    const props = {
      selected: true,
      value: 'initial value'
    };

    const { container } = render(<TextInput {...props} />);

    const element = container.querySelector('input');
    expect(element).toBeVisible();
    expect(element).toHaveValue(props.value);
  });

  it('should publish updated value on change', async () => {
    const expected = 'new value';
    const onChange = sinon.stub();
    const props = {
      selected: true,
      canEdit: true,
      value: 'old value',
      onChange
    };

    const { container } = render(<TextInput {...props} />);
    const element = container.querySelector('input');

    // Trigger change with  expected value
    await act(async () => {
      fireEvent.change(element, {
        target: { value: expected }
      });
    });

    const result = onChange.firstCall || { args: [] };
    const actual = result.args[1] || '';
    expect(actual).toEqual(expected);
  });

  it('should not publish updated value on change when not editable', async () => {
    const expected = false;
    const onChange = sinon.stub();
    const props = {
      selected: true,
      canEdit: false,
      value: 'old value',
      onChange
    };

    const { container } = render(<TextInput {...props} />);
    const element = container.querySelector('input');

    // Trigger change with  expected value
    await act(async () => {
      fireEvent.change(element, {
        target: { value: expected }
      });
    });

    const actual = onChange.called;
    expect(actual).toEqual(expected);
  });
});
