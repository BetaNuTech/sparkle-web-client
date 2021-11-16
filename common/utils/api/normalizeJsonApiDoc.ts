const PREFIX = 'utils: api: normalizeJsonApiDoc:';

interface JsonApiDoc {
  id: string;
  attributes: any;
  relationships: any;
}

// Simplified normalizer of JSON Data
// into flat POJO of all attributes & relationships
export default function normalizeJsonApiDoc(data: JsonApiDoc): any {
  const result = {
    ...data.attributes,
    id: data.id
  };

  if (
    data.relationships &&
    typeof data.relationships === 'object' &&
    !Array.isArray(data.relationships)
  ) {
    // Add each relationship to result
    Object.keys(data.relationships).forEach((relationship: any) => {
      const { data: relData } = data.relationships[relationship];
      const hasNamespaceConflict = typeof result[relationship] !== 'undefined';

      if (hasNamespaceConflict) {
        // eslint-disable-next-line
        console.warn(
          `${PREFIX} omitting relationship: "${relationship}" that conflicts with existing attribute`
        );
        return;
      }

      if (Array.isArray(relData)) {
        result[relationship] = relData
          .filter((rel) => Boolean(rel.id))
          .map(({ id }) => `${id}`);
      } else if (relData && relData.id) {
        result[relationship] = `${relData.id}`;
      }
    });
  }

  return result;
}
