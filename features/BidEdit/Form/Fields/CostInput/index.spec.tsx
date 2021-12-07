import { render, screen } from '@testing-library/react';

import CostInput from './index';

describe('Unit | Features | Bid Edit | Form | Cost Input', () => {
  it('should not render cost max input', async () => {
    const props = {
      isLoading: false,
      isBidComplete: false,
      formState: {},
      isApprovedOrComplete: false,
      isFixedCostType: true,
      register: jest.fn(),
      costMin: 0,
      costMinValidateOptions: {},
      costMax: 0,
      costMaxValidateOptions: {},
      onCostTypeChange: jest.fn(),
      apiErrorCostMin: '',
      apiErrorCostMax: ''
    };

    render(<CostInput {...props} />);

    const element = screen.queryByTestId('bid-form-cost-max');
    expect(element).toBeNull();
  });

  it('should render cost max input with correct value', async () => {
    const expected = 1000;
    const props = {
      isLoading: false,
      isBidComplete: false,
      formState: {},
      isApprovedOrComplete: false,
      isFixedCostType: false,
      register: jest.fn(),
      costMin: 0,
      costMinValidateOptions: {},
      costMax: expected,
      costMaxValidateOptions: {},
      onCostTypeChange: jest.fn(),
      apiErrorCostMin: '',
      apiErrorCostMax: ''
    };

    render(<CostInput {...props} />);

    const element = screen.queryByTestId('bid-form-cost-max');
    expect(element).toBeTruthy();
    expect(element).toHaveValue(expected);
  });

  it('should render min cost input with correct value', async () => {
    const expected = 1000;
    const props = {
      isLoading: false,
      isBidComplete: false,
      formState: {},
      isApprovedOrComplete: false,
      isFixedCostType: false,
      register: jest.fn(),
      costMin: expected,
      costMinValidateOptions: {},
      costMax: 0,
      costMaxValidateOptions: {},
      onCostTypeChange: jest.fn(),
      apiErrorCostMin: '',
      apiErrorCostMax: ''
    };

    render(<CostInput {...props} />);

    const element = screen.queryByTestId('bid-form-cost-min');
    expect(element).toBeTruthy();
    expect(element).toHaveValue(expected);
  });

  it('should show api error message if there is an api error for min cost or max cost input', async () => {
    const props = {
      isLoading: false,
      isBidComplete: false,
      formState: {},
      isApprovedOrComplete: false,
      isFixedCostType: false,
      register: jest.fn(),
      costMin: 0,
      costMinValidateOptions: {},
      costMax: 0,
      costMaxValidateOptions: {},
      onCostTypeChange: jest.fn(),
      apiErrorCostMin: 'API error for minimum cost',
      apiErrorCostMax: 'API error for maximum cost'
    };

    render(<CostInput {...props} />);

    const errorTitleMax = screen.queryByTestId('error-label-costMax');
    const errorTitleMin = screen.queryByTestId('error-label-costMin');

    expect(errorTitleMax).toBeTruthy();
    expect(errorTitleMin).toBeTruthy();
  });
});
