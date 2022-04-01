import sinon from 'sinon';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import userEvent from '@testing-library/user-event';

import MobileSearchBar from './index';

describe('Unit | Common | Search Bar', () => {
  it('should render clear search button if there is search query ', () => {
    const onClearSearch = sinon.spy();
    const props = {
      searchQuery: 'one',
      setSearchQuery: sinon.spy(),
      onChange: sinon.spy(),
      onClearSearch
    };

    render(<MobileSearchBar {...props} />);
    const clearBtn = screen.queryByTestId('mobile-search-bar-clear');
    expect(clearBtn).toBeTruthy();
  });

  it('should request to clear search query', () => {
    const onClearSearch = sinon.spy();
    const props = {
      searchQuery: 'one',
      setSearchQuery: sinon.spy(),
      onChange: sinon.spy(),
      onClearSearch
    };

    render(<MobileSearchBar {...props} />);
    const clearBtn = screen.queryByTestId('mobile-search-bar-clear');
    act(() => {
      userEvent.click(clearBtn);
    });
    expect(onClearSearch.called).toBeTruthy();
  });
});
