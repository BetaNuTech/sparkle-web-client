import moment from 'moment';

export default function useProcessedForm(
  formBid: Record<string, any>,
  isFixedCostType: boolean
): Record<string, any> {
  formBid.costMin = Number(formBid.costMin);
  formBid.costMax = Number(formBid.costMax);

  formBid.startAt = formBid.startAt ? moment(formBid.startAt).unix() : 0;
  formBid.completeAt = formBid.completeAt
    ? moment(formBid.completeAt).unix()
    : 0;

  if (isFixedCostType) {
    // Set the costMax same to as that of cost min as
    // this is fixed cost
    formBid.costMax = formBid.costMin;
  }

  // Delete cost attribute
  delete formBid.cost;

  return formBid;
}
