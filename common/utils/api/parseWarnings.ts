import apiWarningModel from '../../models/api/warning';

interface payloadWithMeta {
  meta?: { warnings?: unknown };
}

// Normalize any `meta.warnings` entries
// of an API response payload into warning models
// ignoring malformed entries
const parseWarnings = (responseJson: payloadWithMeta): apiWarningModel[] => {
  const meta = (responseJson && responseJson.meta) || {};
  const warnings: any[] = Array.isArray(meta.warnings) ? meta.warnings : [];

  return warnings
    .filter((warning) => warning && typeof warning === 'object')
    .map(
      (warning) =>
        ({
          ...(warning.id ? { id: `${warning.id}` } : {}),
          ...(warning.type ? { type: `${warning.type}` } : {}),
          title: warning.title ? `${warning.title}` : '',
          detail: warning.detail ? `${warning.detail}` : ''
        } as apiWarningModel)
    );
};

export default parseWarnings;
