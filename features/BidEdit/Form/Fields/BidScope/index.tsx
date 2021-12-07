import { forwardRef } from 'react';
import clsx from 'clsx';
import { UseFormRegister } from 'react-hook-form';
import styles from '../../../styles.module.scss';

interface Props {
  scope: string;
}

const BidScope = forwardRef<
  HTMLInputElement,
  Props & ReturnType<UseFormRegister<any>>
>(({ scope, ...props }, ref) => (
  <div className={styles.form__row}>
    <div className={clsx(styles.form__row__cell)}>
      <div className={styles.form__group}>
        <label htmlFor="bidStartAt">
          Scope <span>*</span>
        </label>
        <div
          className={clsx(
            styles.form__group__control,
            styles['form__group__control--radio']
          )}
        >
          <label className={styles.form__group__labelAlign}>
            <input
              type="radio"
              name="bidScope"
              className={styles.form__input}
              value="local"
              defaultChecked={(scope && scope === 'local') || !scope}
              ref={ref}
              {...props}
            />
            Local
          </label>
          <label className={styles.form__group__labelAlign}>
            <input
              type="radio"
              name="bidScope"
              className={styles.form__input}
              value="national"
              defaultChecked={scope && scope === 'national'}
              ref={ref}
              {...props}
            />
            National
          </label>
        </div>
      </div>
    </div>
  </div>
));

BidScope.displayName = 'BidScope';

export default BidScope;
