interface DeficientItemResponsibilityGroup {
  id?: string;
  createdAt: number; // UNIX timestamp
  startDate: number; // UNIX timestamp
  groupResponsible: string;
  user: string;
}

export default DeficientItemResponsibilityGroup;
