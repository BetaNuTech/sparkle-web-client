export default {
  supportTemplatesList:
    process.env.NEXT_PUBLIC_SUPPORT_TEMPLATES_LIST !== 'false',
  supportTemplateEdit:
    process.env.NEXT_PUBLIC_SUPPORT_TEMPLATES_EDIT !== 'false',
  supportUsers: process.env.NEXT_PUBLIC_SUPPORT_USERS !== 'false',
  supportUserEdit: process.env.NEXT_PUBLIC_SUPPORT_USER_EDIT !== 'false',
  supportUserProfile: process.env.NEXT_PUBLIC_SUPPORT_USER_PROFILE !== 'false',
  supportSettings: process.env.NEXT_PUBLIC_SUPPORT_SETTINGS !== 'false',
  supportLogin: process.env.NEXT_PUBLIC_SUPPORT_LOGIN !== 'false',
  supportTeamCreate: true,
  supportTeamEdit: true,
  supportTeamView: true,
  supportPropertiesList: true,
  supportPropertyProfile: true,
  supportPropertyCreate: true,
  supportPropertyDeficient:
    process.env.NEXT_PUBLIC_SUPPORT_PROPERTY_DEFICIENT !== 'false',
  supportPropertyYardiResident:
    process.env.NEXT_PUBLIC_SUPPORT_YARDI_RESIDENT !== 'false',
  supportPropertyYardiWorkOrder:
    process.env.NEXT_PUBLIC_SUPPORT_YARDI_WORK_ORDER !== 'false',
  supportPropertyInspectionCreate: true,
  supportPropertyInspectionUpdate: true,
  supportPropertyUpdate: true,
  supportInspectionUploadPhotos: true,
  supportDeficientItemEdit:
    process.env.NEXT_PUBLIC_SUPPORT_PROPERTY_DEFICIENT_ITEM_EDIT !== 'false'
};
