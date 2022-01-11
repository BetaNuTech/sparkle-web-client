interface DeficientItemProgressNote {
  id?: string;
  createdAt: number; // UNIX timestamp
  startDate: number; // UNIX timestamp
  progressNote: string;
  user: string;
}

export default DeficientItemProgressNote;
