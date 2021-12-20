import { useState } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import FormInputs from '../Form/FormInputs';

interface useTrelloCardResult {
  openTrelloCardInputPrompt(oldTrelloCardURL?: string): void;
  isDeleteTrelloCardPromptVisible: boolean;
  openTrelloCardDeletePrompt(): void;
  closeTrelloCardDeletePrompt(): void;
  confirmTrelloCardDelete(): void;
}

type userNotifications = (message: string, options?: any) => any;

export default function useTrelloCard(
  sendNotification: userNotifications,
  setValue: UseFormSetValue<FormInputs>,
  onSubmit: (action: string) => any
): useTrelloCardResult {
  const [isDeleteTrelloCardPromptVisible, setDeleteTrelloCardPromptVisible] =
    useState(false);

  const openTrelloCardDeletePrompt = () => {
    setDeleteTrelloCardPromptVisible(true);
  };

  const closeTrelloCardDeletePrompt = () => {
    setDeleteTrelloCardPromptVisible(false);
  };

  const openTrelloCardInputPrompt = (oldTrellCardURL?: string) => {
    // eslint-disable-next-line no-alert
    const trelloCardURL = window.prompt(
      'Enter job trello card link.',
      oldTrellCardURL
    );

    if (trelloCardURL) {
      const regExp = /https:\/\/trello\.com\/c\/\w+(?:\/[a-zA-Z0-9-]*)?/;
      // If reg ex matches then send update request
      if (regExp.test(trelloCardURL)) {
        setValue('trelloCardURL', trelloCardURL);
        onSubmit('save');
      } else {
        // Show notificaiton
        sendNotification(
          'Not a valid trello card URL. Try again with valid URL.',
          {
            type: 'error'
          }
        );
      }
    }
  };

  const confirmTrelloCardDelete = () => {
    // Remove the trello card url from hidden value
    setValue('trelloCardURL', '');
    // Save the form
    onSubmit('save');
  };

  return {
    openTrelloCardInputPrompt,
    isDeleteTrelloCardPromptVisible,
    openTrelloCardDeletePrompt,
    closeTrelloCardDeletePrompt,
    confirmTrelloCardDelete
  };
}
