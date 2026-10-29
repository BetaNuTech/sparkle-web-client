import inspectionModel from '../inspection';
import apiWarningModel from '../api/warning';

// Inspection returned by a template update
// request, with any warnings the API attached
// (for example: a PDF report not requested
// because photos are still uploading)
interface inspectionTemplateUpdateResult extends inspectionModel {
  warnings?: apiWarningModel[];
}

export default inspectionTemplateUpdateResult;
