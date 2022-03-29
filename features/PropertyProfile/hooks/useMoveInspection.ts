import { useMemo, useState } from 'react';
import firebase from 'firebase/app';

import UserModel from '../../../common/models/user';
import PropertyModel from '../../../common/models/property';
import InspectionModel from '../../../common/models/inspection';
import TeamModel from '../../../common/models/team';
import useTeams from '../../Properties/hooks/useTeams';
import useProperties from '../../Properties/hooks/useProperties';
import utilArray from '../../../common/utils/array';

interface useMoveInspectionResult {
  isLoaded: boolean;
  currentPropertyName: string;
  selectedPropertyName: string;
  selectedProperty: string;
  onSelectProperty(propertyId: string): void;
  teams: TeamModel[];
  propertiesByTeam: Map<string, PropertyModel[]>;
}

export default function useMoveInspection(
  firestore: firebase.firestore.Firestore,
  user: UserModel,
  inspection: InspectionModel
): useMoveInspectionResult {
  const [selectedProperty, setSelectedProperty] = useState(null);
  const { data: properties, status: propertyStatus } = useProperties(
    firestore,
    user
  );
  const { status: teamsStatus, data: teams } = useTeams(firestore);
  let isLoaded = false;

  if (propertyStatus === 'success' && teamsStatus === 'success') {
    isLoaded = true;
  }

  // Grouping of properties by team id
  const propertiesByTeam = useMemo(
    () =>
      utilArray.groupBy<string, PropertyModel>(
        properties.filter((property) => property.id !== inspection.property),
        (item) => item.team || 'other'
      ),
    [properties, inspection.property]
  );

  // sort teams alphabetically in ascending order
  const sortedAndFilteredTeams = useMemo(() => {
    const sortedTeams = teams.sort((a, b) => a.name.localeCompare(b.name));

    // filter teams which dont have properties
    const filteredTeams = [
      ...sortedTeams,
      { name: 'Other', id: 'other' }
    ].filter((team) => Boolean(propertiesByTeam.get(team.id)));
    return filteredTeams;
  }, [teams, propertiesByTeam]);

  const onSelectProperty = (propertyId: string) => {
    setSelectedProperty(selectedProperty === propertyId ? null : propertyId);
  };

  const currentPropertyName =
    properties.find((property) => property.id === inspection.property)?.name ||
    '';
  const selectedPropertyName =
    properties.find((property) => property.id === selectedProperty)?.name ||
    'NOT SET';

  return {
    isLoaded,
    currentPropertyName,
    selectedPropertyName,
    selectedProperty,
    onSelectProperty,
    teams: sortedAndFilteredTeams,
    propertiesByTeam
  };
}
