import sinon from 'sinon';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import currentUser from '../../../common/utils/currentUser';
import useTrelloCard from './useTrelloCard';

const STUBBED_NOTIFICATIONS = (message: string, options?: any) => [
  message,
  options
];

describe('Unit | Features | Job Edit | Hooks | Use Trello Card', () => {
  afterEach(() => sinon.restore());

  test('should request for trello card URL', async () => {
    const setValue = sinon.spy();
    const onSubmit = sinon.spy();
    let promptCalled = false;
    window.prompt = jest.fn().mockImplementation(() => {
      promptCalled = true;
      return true;
    });

    await act(async () => {
      const { result } = renderHook(() =>
        useTrelloCard(STUBBED_NOTIFICATIONS, setValue, onSubmit)
      );
      result.current.openTrelloCardInputPrompt();
    });

    expect(window.prompt).toHaveBeenCalled();
  });

  test('should call on submit method on confirm trello card delete', async () => {
    const setValue = sinon.spy();
    const onSubmit = sinon.stub();

    await act(async () => {
      const { result } = renderHook(() =>
        useTrelloCard(STUBBED_NOTIFICATIONS, setValue, onSubmit)
      );
      result.current.confirmTrelloCardDelete();
    });
    expect(onSubmit.called).toBeTruthy();
  });

  test('should show delete card prompt ', async () => {
    const setValue = sinon.spy();
    const onSubmit = sinon.stub();

    await act(async () => {
      const { result } = renderHook(() =>
        useTrelloCard(STUBBED_NOTIFICATIONS, setValue, onSubmit)
      );
      await result.current.openTrelloCardDeletePrompt();
      expect(result.current.isDeleteTrelloCardPromptVisible).toBeTruthy();
    });
  });
});
