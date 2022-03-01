import { render, screen, fireEvent } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { categoryA } from '../../../../__mocks__/templateCategories';
import CategoryItem from './index';

describe('Unit | Features | Templates | Manage Categories Modal | Item', () => {
  it('should allow user to update category name if user does have permission', () => {
    const props = {
      category: categoryA,
      canUpdateCategory: true,
      canDeleteCategory: true,
      isUnpublished: false
    };
    render(<CategoryItem {...props} />);
    const categoryInput = screen.queryByTestId('category-input');
    expect(categoryInput).toBeTruthy();
  });

  it('should not allow user to update category name as text if user does not have permission', () => {
    const props = {
      category: categoryA,
      canUpdateCategory: false,
      canDeleteCategory: true,
      isUnpublished: false
    };
    render(<CategoryItem {...props} />);

    const categoryInput = screen.queryByTestId('category-input');
    const categoryText = screen.queryByTestId('category-name-text');
    expect(categoryInput).toBeFalsy();
    expect(categoryText).toBeTruthy();
  });

  it('should not allow user to delete category if user does not have permission', () => {
    const props = {
      category: categoryA,
      canUpdateCategory: true,
      canDeleteCategory: false,
      isUnpublished: false
    };
    render(<CategoryItem {...props} />);

    const deleteDropdownEl = screen.queryByTestId('category-delete-dropdown');

    expect(deleteDropdownEl).toBeFalsy();
  });

  it('should render save action once user has updated category name', () => {
    const props = {
      category: categoryA,
      canUpdateCategory: true,
      canDeleteCategory: true,
      isUnpublished: false
    };
    render(<CategoryItem {...props} />);

    let saveAction = screen.queryByTestId('category-save-action');
    const categoryInput = screen.queryByTestId('category-input');

    act(() => {
      fireEvent.change(categoryInput, {
        target: { value: 'Category 1' }
      });
    });
    saveAction = screen.queryByTestId('category-save-action');
    expect(saveAction).toBeTruthy();
  });
});
