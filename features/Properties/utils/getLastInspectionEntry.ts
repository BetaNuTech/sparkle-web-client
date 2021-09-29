import moment from 'moment';
import propertyModel from '../../../common/models/property';

// property meta data values
const calculateLastInspection = (property: propertyModel): string => {
  if (!property.numOfInspections) {
    return 'No Inspections';
  }

  const lastScore = (property.lastInspectionScore || 0).toFixed(0);
  const formattedDate = property.lastInspectionDate
    ? moment.unix(property.lastInspectionDate).format('MMM DD')
    : '';

  return `${property.numOfInspections} Entr${
    property.numOfInspections > 1 ? 'ies' : 'y'
  } [ Last: ${lastScore}%${formattedDate ? `, ${formattedDate}` : ''} ]`;
};
export default calculateLastInspection;
