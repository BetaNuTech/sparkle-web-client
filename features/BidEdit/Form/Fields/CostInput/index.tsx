import { FunctionComponent } from 'react';
import { FormState, UseFormRegister } from 'react-hook-form';
import clsx from 'clsx';
import ErrorLabel from '../../../../../common/ErrorLabel';
import FormInputs from '../../FormInputs';
import styles from '../../../styles.module.scss';

interface Props {
  isLoading: boolean;
  isBidComplete: boolean;
  formState: FormState<FormInputs>;
  isApprovedOrComplete: boolean;
  isFixedCostType: boolean;
  onCostTypeChange(type: 'fixed' | 'range'): void;
  costMin: number;
  register: UseFormRegister<FormInputs>;
  costMinValidateOptions: any;
  costMaxValidateOptions: any;
  costMax: number;
  apiErrorCostMin: string;
  apiErrorCostMax: string;
}

const CostInput: FunctionComponent<Props> = ({
  isLoading,
  isBidComplete,
  formState,
  isApprovedOrComplete,
  isFixedCostType,
  register,
  costMin,
  costMinValidateOptions,
  costMax,
  costMaxValidateOptions,
  onCostTypeChange,
  apiErrorCostMin,
  apiErrorCostMax
}: Props) => (
  <>
    <div className={styles.form__formCost}>
      <label>Cost {isApprovedOrComplete && <span>*</span>}</label>
      <div className={styles.form__formCost__select}>
        <button
          type="button"
          className={clsx(isFixedCostType && styles.active)}
          onClick={() => onCostTypeChange('fixed')}
        >
          Fixed Cost
        </button>
        <span className={styles.form__formCost__separator}></span>
        <button
          type="button"
          id="btnRange"
          className={clsx(!isFixedCostType && styles.active)}
          onClick={() => onCostTypeChange('range')}
        >
          Range
        </button>
      </div>
    </div>

    <div className={styles.form__row}>
      <div
        className={clsx(
          styles.form__row__cell,
          isFixedCostType ? styles['form__row__cell--fillRow'] : ''
        )}
      >
        <div className={styles.form__group}>
          <div className={styles.form__group__control}>
            <input
              type="number"
              id="costMin"
              name="costMin"
              min="0"
              className={styles.form__input}
              placeholder={isFixedCostType ? '' : 'Minimum'}
              defaultValue={costMin}
              data-testid="bid-form-cost-min"
              {...register('costMin', costMinValidateOptions)}
              disabled={isLoading || isBidComplete}
            />
            <ErrorLabel
              formName="costMin"
              errors={formState.errors}
              message={apiErrorCostMin}
            />
          </div>
        </div>
      </div>
      {!isFixedCostType && (
        <div className={styles.form__row__cell}>
          <div className={styles.form__group}>
            <div className={styles.form__group__control}>
              <input
                type="number"
                id="costMax"
                name="costMax"
                min="0"
                className={styles.form__input}
                placeholder="Maximum"
                defaultValue={costMax}
                data-testid="bid-form-cost-max"
                {...register('costMax', costMaxValidateOptions)}
                disabled={isLoading || isBidComplete}
              />
              <ErrorLabel
                formName="costMax"
                errors={formState.errors}
                message={apiErrorCostMax}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  </>
);

CostInput.displayName = 'CostInput';

export default CostInput;
