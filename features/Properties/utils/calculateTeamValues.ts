interface calculateTeamValuesReference {
  id?: string;
  properties?: any;
}

interface calculateTeamValuesPropertyMeta {
  id?: string;
  numOfDeficientItems?: number;
  numOfFollowUpActionsForDeficientItems?: number;
  numOfRequiredActionsForDeficientItems?: number;
}

// Collect each team's
// property meta data values
const calculateTeamValues = (
  teams: Array<calculateTeamValuesReference>,
  properties: Array<calculateTeamValuesPropertyMeta>
): any =>
  teams.reduce((acc, team) => {
    // Get array of properties for each team.
    const teamsProperties = properties.filter((prop) =>
      Object.keys(team.properties || {}).includes(prop.id)
    );

    // Calculate values for each properties and ruturn the array of objects.
    const totalNumOfDeficientItems = teamsProperties.reduce(
      (total, curr) => total + curr.numOfDeficientItems || 0,
      0
    );

    const totalNumOfFollowUpActionsForDeficientItems = teamsProperties.reduce(
      (total, curr) => total + curr.numOfFollowUpActionsForDeficientItems || 0,
      0
    );

    const totalNumOfRequiredActionsForDeficientItems = teamsProperties.reduce(
      (total, curr) => total + curr.numOfRequiredActionsForDeficientItems || 0,
      0
    );

    acc.push({
      team: team.id,
      totalNumOfDeficientItems,
      totalNumOfFollowUpActionsForDeficientItems,
      totalNumOfRequiredActionsForDeficientItems
    });

    return acc;
  }, []);

export default calculateTeamValues;
