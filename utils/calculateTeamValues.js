export const calculateTeamValues = (teams, properties) => {
  // Get array of properties for each team.
  const teamProperties = teams.map((team) =>
    properties.filter((prop) => team.properties.includes(prop.id))
  );

  // Calculate values for each properties and ruturn the array of objects.
  return teamProperties.map((item) => {
    const totalNumOfDeficientItems = item.reduce(
      (total, curr) => total + curr.numOfDeficientItems,
      0
    );

    const totalNumOfFollowUpActionsForDeficientItems = item.reduce(
      (total, curr) => total + curr.numOfFollowUpActionsForDeficientItems,
      0
    );

    const totalNumOfRequiredActionsForDeficientItems = item.reduce(
      (total, curr) => total + curr.numOfRequiredActionsForDeficientItems,
      0
    );

    return {
      totalNumOfDeficientItems,
      totalNumOfFollowUpActionsForDeficientItems,
      totalNumOfRequiredActionsForDeficientItems
    };
  });
};
