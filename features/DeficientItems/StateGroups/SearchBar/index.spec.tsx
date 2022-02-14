import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

import SearchBar from './index';

describe('Unit | Features | Deficient Items | State Groups | Search Bar', () => {
  it('should render clear search button if there is search query ', () => {
    const onClearSearch = sinon.spy();
    const props = {
      searchQuery: 'one',
      setSearchQuery: sinon.spy(),
      onSearchKeyDown: sinon.spy(),
      onClearSearch
    };

    render(<SearchBar {...props} />);
    const clearBtn = screen.queryByTestId('search-bar-clear');
    expect(clearBtn).toBeTruthy();
  });

  it('should request to clear search query', () => {
    const onClearSearch = sinon.spy();
    const props = {
      searchQuery: 'one',
      setSearchQuery: sinon.spy(),
      onSearchKeyDown: sinon.spy(),
      onClearSearch
    };

    render(<SearchBar {...props} />);
    const clearBtn = screen.queryByTestId('search-bar-clear');
    act(() => {
      userEvent.click(clearBtn);
    });
    expect(onClearSearch.called).toBeTruthy();
  });
});
