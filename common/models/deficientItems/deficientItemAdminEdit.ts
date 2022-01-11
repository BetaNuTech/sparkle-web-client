/* eslint-disable camelcase */
interface DeficientItemAdminEdit {
  id?: string;
  edit_date: number; // UNIX timestamp
  action: string;
  admin_name: string;
  admin_uid: string;
}

export default DeficientItemAdminEdit;
