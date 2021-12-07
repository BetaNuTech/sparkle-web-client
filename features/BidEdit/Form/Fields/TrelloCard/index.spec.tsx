import { render, screen } from '@testing-library/react';

import TrelloCard from './index';

describe('Unit | Features | Bid Edit | Form | Trello Card', () => {
  it('should not render if there is no trello card url', async () => {
    const props = {
      trelloCardURL: ''
    };
    render(<TrelloCard {...props} />);

    const trelloCardUrlElement = screen.queryByTestId(
      'bid-form-trello-card-url'
    );
    expect(trelloCardUrlElement).toBeNull();
  });

  it('should render if there is trello card url', async () => {
    const expected = 'https://google.com';
    const props = {
      trelloCardURL: expected
    };
    render(<TrelloCard {...props} />);

    const trelloCardUrlElement = screen.queryByTestId(
      'bid-form-trello-card-url'
    );
    expect(trelloCardUrlElement).toBeTruthy();
    expect(trelloCardUrlElement).toHaveAttribute('href', expected);
  });
});
