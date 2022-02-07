import { deficientItemResponsibilityGroups } from '../../../config/deficientItems';

const getResponsibilityGroup = (groupResponsible: string): string =>
  deficientItemResponsibilityGroups.find(
    (group) => group.value === groupResponsible
  )?.label || '';

export default getResponsibilityGroup;
