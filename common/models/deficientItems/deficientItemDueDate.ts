interface DeficientItemDueDate {
  id?: string;
  createdAt: number; // UNIX timestamp
  startDate: number; // UNIX timestamp
  dueDate: number; // UNIX timestamp
  dueDateDay: string;
  user: string;
}

export default DeficientItemDueDate;
