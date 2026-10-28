import { ChangeEvent, FunctionComponent, ReactNode, useState } from 'react';
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
import { WorkOrderFieldErrors, todayIsoDate } from '../../utils/validate';
import { findOption, toOptionValue, UnitOption } from '../../utils/unitOptions';
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
  unitOptions?: UnitOption[];
  unitOptionsStatus?: string;
  onUnitPick?(option: UnitOption | null): void;
}

// Select value that reveals the typed
// unit & tenant code inputs
export const MANUAL_UNIT = 'manual';

// Select value for a request filed against
// the property itself rather than a unit
export const COMMON_AREA_UNIT = 'common-area';

const COMMON_AREA_HINT = 'Leave the unit blank for a common area request';
const UNKNOWN_UNIT_HINT =
  'No current resident holds this unit. Yardi only accepts unit codes that exist in the property.';

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
  onChange,
  unitOptions,
  unitOptionsStatus,
  onUnitPick
}) => {
  // Creating offers the current residents'
  // units; the user may still type one
  const [isManualUnit, setIsManualUnit] = useState(false);
  const [isCommonArea, setIsCommonArea] = useState(false);
  const isLoadingUnits = isCreating && unitOptionsStatus === 'loading';
  const hasUnitPicker =
    isCreating && (isLoadingUnits || (unitOptions || []).length > 0);
  const pickedUnit = findOption(
    unitOptions || [],
    values.unit,
    values.resident
  );
  const isTypingUnit =
    !hasUnitPicker ||
    (isManualUnit && !pickedUnit) ||
    Boolean(values.unit && !pickedUnit);
  // The picker and the typed inputs never
  // show together: manual entry swaps the
  // picker for a way back to it
  const showUnitPicker = hasUnitPicker && !isTypingUnit;
  const typedUnit = `${values.unit || ''}`.trim();
  let unitPickerValue = '';
  if (pickedUnit) unitPickerValue = toOptionValue(pickedUnit);
  else if (isCommonArea && !typedUnit) unitPickerValue = COMMON_AREA_UNIT;

  // A blank unit files the request against the
  // property. A typed unit no current resident
  // holds may still be a real (vacant) unit, so
  // it only earns a warning, never an error
  const isKnownUnit = (unitOptions || []).some(
    (opt) => opt.unit.toLowerCase() === typedUnit.toLowerCase()
  );
  let unitHint = '';
  if (isCreating && !typedUnit) unitHint = COMMON_AREA_HINT;
  else if (isCreating && (unitOptions || []).length > 0 && !isKnownUnit) {
    unitHint = UNKNOWN_UNIT_HINT;
  }

  const onPickFromResidents = () => {
    setIsManualUnit(false);
    setIsCommonArea(false);
    if (onUnitPick) onUnitPick(null);
  };

  const onUnitPickerChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const { value } = evt.target;
    if (value === MANUAL_UNIT) {
      setIsManualUnit(true);
      setIsCommonArea(false);
      if (onUnitPick) onUnitPick(null);
      return;
    }
    if (value === COMMON_AREA_UNIT) {
      setIsManualUnit(false);
      setIsCommonArea(true);
      if (onUnitPick) onUnitPick(null);
      return;
    }
    setIsManualUnit(false);
    setIsCommonArea(false);
    const option = (unitOptions || []).find(
      (opt) => toOptionValue(opt) === value
    );
    if (onUnitPick) onUnitPick(option || null);
  };

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
    options: {
      type?: string;
      isRequired?: boolean;
      placeholder?: string;
      min?: string;
      hint?: string;
    } = {}
  ) => (
    <Field
      name={name}
      label={label}
      error={errors[name]}
      isRequired={options.isRequired}
      hint={options.hint || lengthHint(name, values[name])}
    >
      <input
        id={`work-order-${name}`}
        name={name}
        type={options.type || 'text'}
        className={styles.field__input}
        value={values[name]}
        maxLength={WORK_ORDER_MAX_LENGTHS[name]}
        placeholder={options.placeholder}
        min={options.min}
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
        {showUnitPicker && (
          <Field
            name="unitPicker"
            label="Unit"
            error={errors.unit}
            hint={
              unitPickerValue === COMMON_AREA_UNIT
                ? 'This request will be filed against the property, not a unit'
                : ''
            }
          >
            <select
              id="work-order-unitPicker"
              name="unitPicker"
              className={styles.field__select}
              value={unitPickerValue}
              disabled={isDisabled || isLoadingUnits}
              onChange={onUnitPickerChange}
              data-testid="work-order-input-unitPicker"
            >
              <option value="">
                {isLoadingUnits ? 'Loading units…' : 'Select a unit…'}
              </option>
              <option value={COMMON_AREA_UNIT}>No unit (common area)</option>
              {(unitOptions || []).map((option) => (
                <option
                  key={toOptionValue(option)}
                  value={toOptionValue(option)}
                >
                  {option.label}
                </option>
              ))}
              <option value={MANUAL_UNIT}>Enter a unit manually…</option>
            </select>
          </Field>
        )}
        {(isTypingUnit || !isCreating) && (
          <div className={styles.form__row}>
            {textInput('unit', 'Unit', { hint: unitHint })}
            {textInput('resident', 'Tenant Code')}
          </div>
        )}
        {hasUnitPicker && isTypingUnit && (
          <button
            type="button"
            className={styles.field__link}
            disabled={isDisabled}
            onClick={onPickFromResidents}
            data-testid="work-order-unit-pick"
          >
            Pick a unit from current residents instead
          </button>
        )}
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
          {textInput('dueDate', 'Due Date', {
            type: 'date',
            min: todayIsoDate()
          })}
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

WorkOrderForm.defaultProps = {
  unitOptions: [],
  unitOptionsStatus: 'success',
  onUnitPick: () => null
};

export default WorkOrderForm;
