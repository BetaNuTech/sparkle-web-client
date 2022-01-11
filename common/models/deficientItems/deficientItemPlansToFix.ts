interface DeficientItemPlansToFix {
  id?: string;
  createdAt: number; // UNIX timestamp
  startDate: number; // UNIX timestamp
  planToFix: string;
  user: string;
}

export default DeficientItemPlansToFix;
