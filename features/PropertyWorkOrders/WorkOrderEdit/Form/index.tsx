import { ChangeEvent, FunctionComponent, ReactNode } from 'react';
import clsx from 'clsx';
import customValuesModel from '../../../../common/models/yardi/customValues';
import { WORK_ORDER_MAX_LENGTHS } from '../../../../common/models/yardi/workOrder';
import SwitchInput from '../../../../common/SwitchInput';
import {
  getCategoryNames,
  getReasons,
  getStatusNames,
  getSubCategories,
  isReasonRequired
} from '../../utils/customValues';
import { WorkOrderFieldErrors } from '../../utils/validate';
import { WorkOrderFormValues } from '../formValues';
import styles from '../styles.module.scss';

type FieldChange = (
  evt: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => void;

interface Props {
  values: WorkOrderFormValues;
  customValues: customValuesModel;
  errors: WorkOrderFieldErrors;
  isCreating: boolean;
  isDisabled: boolean;
  onChange: FieldChange;
}

interface FieldProps {
  name: string;
  label: string;
  error?: string;
  isRequired?: boolean;
  hint?: string;
  children: ReactNode;
}

// Label, control & inline error
const Field: FunctionComponent<FieldProps> = ({
  name,
  label,
  error,
  isRequired,
  hint,
  children
}) => (
  <div
    className={clsx(styles.field, error && styles['field--invalid'])}
    data-testid={`work-order-field-${name}`}
  >
    <label className={styles.field__label} htmlFor={`work-order-${name}`}>
      {label}
      {isRequired && <span className={styles.field__required}> *</span>}
    </label>
    {children}
    {hint && !error && <span className={styles.field__hint}>{hint}</span>}
    {error && (
      <span
        className={styles.field__error}
        data-testid={`work-order-error-${name}`}
      >
        {error}
      </span>
    )}
  </div>
);

Field.defaultProps = {
  error: '',
  isRequired: false,
  hint: ''
};

// Ensure a select can display a current
// value that is not among its options
const withCurrent = (options: string[], current: string): string[] =>
  current && !options.includes(current) ? [current, ...options] : options;

const lengthHint = (name: string, value = ''): string => {
  const max = WORK_ORDER_MAX_LENGTHS[name];
  return max && value.length >= max * 0.8 ? `${value.length}/${max}` : '';
};

const WorkOrderForm: FunctionComponent<Props> = ({
  values,
  customValues,
  errors,
  isCreating,
  isDisabled,
  onChange
}) => {
  const priorities = withCurrent(
    customValues.priorities || [],
    values.priority
  );
  const categories = withCurrent(
    getCategoryNames(customValues),
    values.category
  );
  const subCategories = withCurrent(
    getSubCategories(customValues, values.category),
    values.subCategory
  );
  const statuses = withCurrent(getStatusNames(customValues), values.status);
  const reasons = getReasons(customValues, values.status).map((r) => r.reason);
  const reasonOptions = withCurrent(reasons, values.reason);
  const resolutions = withCurrent(
    customValues.resolutions || [],
    values.resolution
  );
  const reasonRequired = isReasonRequired(customValues, values.status);

  const textInput = (
    name: string,
    label: string,
    options: { type?: string; isRequired?: boolean; placeholder?: string } = {}
  ) => (
    <Field
      name={name}
      label={label}
      error={errors[name]}
      isRequired={options.isRequired}
      hint={lengthHint(name, values[name])}
    >
      <input
        id={`work-order-${name}`}
        name={name}
        type={options.type || 'text'}
        className={styles.field__input}
        value={values[name]}
        maxLength={WORK_ORDER_MAX_LENGTHS[name]}
        placeholder={options.placeholder}
        disabled={isDisabled}
        onChange={onChange}
        data-testid={`work-order-input-${name}`}
      />
    </Field>
  );

  const textArea = (name: string, label: string) => (
    <Field
      name={name}
      label={label}
      error={errors[name]}
      hint={lengthHint(name, values[name])}
    >
      <textarea
        id={`work-order-${name}`}
        name={name}
        className={styles.field__textarea}
        value={values[name]}
        maxLength={WORK_ORDER_MAX_LENGTHS[name]}
        disabled={isDisabled}
        onChange={onChange}
        data-testid={`work-order-input-${name}`}
      />
    </Field>
  );

  const select = (
    name: string,
    label: string,
    options: string[],
    isRequired = false
  ) => (
    <Field
      name={name}
      label={label}
      error={errors[name]}
      isRequired={isRequired}
    >
      <select
        id={`work-order-${name}`}
        name={name}
        className={styles.field__select}
        value={values[name]}
        disabled={isDisabled}
        onChange={onChange}
        data-testid={`work-order-input-${name}`}
      >
        <option value="">{isRequired ? 'Select…' : 'None'}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </Field>
  );

  const toggle = (name: string, label: string) => (
    <Field name={name} label={label} error={errors[name]}>
      <div className={styles.field__toggle}>
        <SwitchInput
          id={`work-order-${name}`}
          name={name}
          checked={Boolean(values[name])}
          disabled={isDisabled}
          onChange={onChange}
          data-testid={`work-order-input-${name}`}
        />
        <span>{values[name] ? 'Yes' : 'No'}</span>
      </div>
    </Field>
  );

  return (
    <form
      className={styles.form}
      onSubmit={(evt) => evt.preventDefault()}
      data-testid="work-order-form"
    >
      <section className={styles.form__section}>
        <h3 className={styles.form__heading}>Request</h3>
        <div className={styles.form__row}>
          {textInput('unit', 'Unit', { isRequired: isCreating })}
          {textInput('resident', 'Tenant Code')}
        </div>
        {textInput('briefDescription', 'Summary')}
        {textArea('description', 'Description')}
        <div className={styles.form__row}>
          {select('priority', 'Priority', priorities)}
          {select('category', 'Category', categories)}
          {subCategories.length > 0 &&
            select('subCategory', 'Sub Category', subCategories)}
        </div>
        <div className={styles.form__row}>
          {select('status', 'Status', statuses)}
          {reasonOptions.length > 0 &&
            select('reason', 'Reason', reasonOptions, reasonRequired)}
          {resolutions.length > 0 &&
            select('resolution', 'Resolution', resolutions)}
        </div>
        <div className={styles.form__row}>
          {textInput('vendor', 'Vendor')}
          {textInput('dueDate', 'Due Date', { type: 'date' })}
        </div>
      </section>

      <section className={styles.form__section}>
        <h3 className={styles.form__heading}>Requestor</h3>
        {textInput('requestorName', 'Name')}
        <div className={styles.form__row}>
          {textInput('requestorPhone', 'Phone', { type: 'tel' })}
          {textInput('requestorEmail', 'Email', { type: 'email' })}
        </div>
      </section>

      <section className={styles.form__section}>
        <h3 className={styles.form__heading}>Access &amp; Notes</h3>
        <div className={styles.form__row}>
          {toggle('permissionToEnter', 'Permission to Enter')}
          {toggle('tenantCaused', 'Tenant Caused')}
        </div>
        {textArea('accessNotes', 'Access Notes')}
        {textArea('problemNotes', 'Problem Notes')}
        {textArea('technicianNotes', 'Technician Notes')}
      </section>
    </form>
  );
};

export default WorkOrderForm;
