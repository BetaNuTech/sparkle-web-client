import inspectionTemplateUpdate from './templateUpdate';

interface unpublishedTemplateUpdate {
  id: string;
  inspection: string;
  property: string;
  template: inspectionTemplateUpdate;
}

export default unpublishedTemplateUpdate;
