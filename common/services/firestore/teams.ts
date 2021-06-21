import { useFirestore, useFirestoreCollectionData } from 'reactfire';
import teamModel from '../../models/team';

// Result of teams collection query
export interface teamsCollectionResult {
  status: string;
  error?: Error;
  data: Array<teamModel>;
}

export default {
  // Create query for all an
  // organizations' teams
  findAll(): teamsCollectionResult {
    const query = useFirestore().collection('teams');

    const {
      status,
      error,
      data: firstoreData = []
    } = useFirestoreCollectionData(query, {
      idField: 'id'
    });

    // Cast firestore data into team records
    const data = firstoreData.map((teamData: any) => teamData as teamModel);

    // Result
    return { status, error, data };
  }
};
