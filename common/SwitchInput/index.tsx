import React, { ChangeEvent, forwardRef, InputHTMLAttributes } from 'react';

import styles from './styles.module.scss';

interface Props {
  onChange(event: ChangeEvent<HTMLInputElement>): void;
}

const SwitchInput = forwardRef<
  HTMLInputElement,
  Props & InputHTMLAttributes<HTMLInputElement>
>(({ onChange, ...props }, ref) => (
  <label className={styles.switch}>
    <input
      type="checkbox"
      className={styles.switch__checkbox}
      onChange={onChange}
      ref={ref}
      {...props}
    />
    <span className={styles.switch__slider}></span>
  </label>
));

SwitchInput.displayName = 'SwitchInput';

export default SwitchInput;
