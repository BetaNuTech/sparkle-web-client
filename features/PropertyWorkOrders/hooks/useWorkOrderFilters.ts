import { ChangeEvent, useMemo, useState } from 'react';
import { WorkOrderFilters } from '../../../common/services/api/yardi';
import globalEvents from '../../../common/utils/globalEvents';

export type WorkOrderState = 'open' | 'closed';

export const STATES: WorkOrderState[] = ['open', 'closed'];

interface useWorkOrderFiltersResult {
  state: WorkOrderState;
  unit: string;
  from: string;
  to: string;
  filters: WorkOrderFilters;
  hasFilters: boolean;
  onStateChange(evt: ChangeEvent<HTMLSelectElement>): void;
  nextState(): void;
  onUnitChange(evt: ChangeEvent<HTMLInputElement>): void;
  onFromChange(evt: ChangeEvent<HTMLInputElement>): void;
  onToChange(evt: ChangeEvent<HTMLInputElement>): void;
  onClearFilters(): void;
}

// Filter state for the work orders
// list: open/closed, unit, and the
// last-modified date range
export default function useWorkOrderFilters(
  initialState: WorkOrderState = 'open'
): useWorkOrderFiltersResult {
  const [state, setState] = useState<WorkOrderState>(initialState);
  const [unit, setUnit] = useState('');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');

  // Filters as the API expects them,
  // omitting anything blank
  const filters = useMemo(() => {
    const result: WorkOrderFilters = { state };
    if (unit.trim()) result.unit = unit.trim();
    if (from) result.from = from;
    if (to) result.to = to;
    return result;
  }, [state, unit, from, to]);

  const hasFilters = Boolean(unit.trim() || from || to);

  const onStateChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    const { value } = evt.target;
    setState(value === 'closed' ? 'closed' : 'open');
    globalEvents.trigger('visibilityForceCheck');
  };

  // Loop through states (mobile)
  const nextState = () => {
    setState(STATES[STATES.indexOf(state) + 1] || STATES[0]);
    globalEvents.trigger('visibilityForceCheck');
  };

  const onUnitChange = (evt: ChangeEvent<HTMLInputElement>) =>
    setUnit(evt.target.value);
  const onFromChange = (evt: ChangeEvent<HTMLInputElement>) =>
    setFrom(evt.target.value);
  const onToChange = (evt: ChangeEvent<HTMLInputElement>) =>
    setTo(evt.target.value);

  const onClearFilters = () => {
    setUnit('');
    setFrom('');
    setTo('');
  };

  return {
    state,
    unit,
    from,
    to,
    filters,
    hasFilters,
    onStateChange,
    nextState,
    onUnitChange,
    onFromChange,
    onToChange,
    onClearFilters
  };
}
