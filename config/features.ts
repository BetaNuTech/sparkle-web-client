export default {
  supportBetaTemplatesList: false,
  supportBetaUsers: false,
  supportBetaUserProfile: false,
  supportBetaSettings: false,
  supportBetaLogin: false,
  supportBetaTeamCreate: true,
  supportBetaTeamEdit: true,
  supportBetaTeamView: true,
  supportBetaPropertiesList: true,
  supportBetaPropertyProfile: true,
  supportBetaPropertyCreate: true,
  supportBetaPropertyDeficient: false,
  supportBetaPropertyYardiResident: false,
  supportBetaPropertyYardiWorkOrder: false,
  supportBetaPropertyInspectionCreate: true,
  supportBetaPropertyInspectionUpdate:
    process.env.NEXT_PUBLIC_SUPPORT_BETA_PROPERTY_INSPECTION_UPDATE ===
      'true' || false,
  supportBetaPropertyInspectionMove: false,
  supportBetaPropertyUpdate: true,
  supportBetaInspectionUploadPhotos: false
};
