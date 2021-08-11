import bidModel from '../../../common/models/bid';
import utilString from '../../../common/utils/string';

// Hooks for finding bids cost range
export default function useBidsCost(bid: bidModel): string {
  return bid.costMin === bid.costMax
    ? utilString.getFormattedCurrency(bid.costMin)
    : `${utilString.getFormattedCurrency(
        bid.costMin
      )} - ${utilString.getFormattedCurrency(bid.costMax)}`;
}
