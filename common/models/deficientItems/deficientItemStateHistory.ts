interface DeficientItemStateHistory {
  id?: string;
  startDate: number; // UNIX timestamp
  createdAt: number; // UNIX timestamp
  state: string;
}

export default DeficientItemStateHistory;
