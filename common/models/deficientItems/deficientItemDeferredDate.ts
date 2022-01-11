interface DeficientItemDeferredDate {
  id?: string;
  createdAt: number; // UNIX timestamp
  deferredDate: number; // UNIX timestamp
  deferredDateDay: string;
  user: string;
}

export default DeficientItemDeferredDate;
