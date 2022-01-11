interface DeficientItemReasonIncomplete {
  id?: string;
  createdAt: number; // UNIX timestamp
  startDate: number; // UNIX timestamp
  reasonIncomplete: string;
  user: string;
}

export default DeficientItemReasonIncomplete;
