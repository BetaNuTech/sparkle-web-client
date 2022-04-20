import clsx from 'clsx';
import { FunctionComponent } from 'react';
import { useForm } from 'react-hook-form';
import ErrorLabel from '../../../common/ErrorLabel';
import Modal, { Props as ModalProps } from '../../../common/Modal';
import regexPattern from '../../../common/utils/regexPattern';
import parentStyles from '../../../common/Modal/styles.module.scss';

interface Props extends ModalProps {
  onConfirm: () => any;
  email: string;
}

type FormInputs = {
  email: string;
};

const ForgotPasswordPrompt: FunctionComponent<Props> = ({
  onClose,
  onConfirm,
  email
}) => {
  const { register, formState, handleSubmit } = useForm<FormInputs>({
    defaultValues: { email },
    mode: 'all'
  });
  const { isValid } = formState;
  return (
    <>
      <header className={parentStyles.modalPrompt__header}>
        <h5 className={parentStyles.modalPrompt__heading}>Reset Password</h5>
      </header>

      <form
        className={parentStyles.modalPrompt__main}
        data-testid="forgot-password-prompt"
        onSubmit={handleSubmit(onConfirm)}
      >
        <div className={parentStyles.modalPrompt__main__content}>
          <p className={parentStyles.modal__description}>
            Please enter your Sparkle user account email.
          </p>
          <input
            type="text"
            placeholder="Email"
            className="-mb-none"
            {...register('email', {
              required: 'Please enter an email address',
              pattern: {
                value: regexPattern.email,
                message: 'Wrong email format'
              }
            })}
          />
          <ErrorLabel formName="email" errors={formState.errors} />
        </div>
        <footer className={parentStyles.modalPrompt__main__footer}>
          <button
            className={clsx(
              'button',
              'gray',
              parentStyles.modal__mainFooterbutton
            )}
            onClick={onClose} // eslint-disable-line
            type="button"
          >
            Cancel
          </button>
          <button
            className={clsx(
              'button',
              parentStyles.modal__mainFooterbutton,
              !isValid && 'disabled'
            )}
            data-testid="btn-confirm-forgot-password"
            disabled={!isValid}
          >
            Send
          </button>
        </footer>
      </form>
    </>
  );
};

export default Modal(
  ForgotPasswordPrompt,
  true,
  parentStyles['-forceLeft'],
  parentStyles['-forceLeftOverlay']
);
