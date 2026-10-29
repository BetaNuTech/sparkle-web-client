// Title the API uses for both the report
// request error and the template update warning
// when an inspection still has photos or signatures
// uploading from the inspector's device
export const PENDING_UPLOADS_TITLE = 'Photos still uploading';

interface titledMessage {
  title?: string;
  detail?: string;
}

// Lookup the first API error or warning
// about pending inspection uploads
export const findPendingUploadsMessage = (
  messages: titledMessage[]
): titledMessage | null => {
  const list = Array.isArray(messages) ? messages : [];
  return (
    list.find(
      (message) => message && message.title === PENDING_UPLOADS_TITLE
    ) || null
  );
};

export default { PENDING_UPLOADS_TITLE, findPendingUploadsMessage };
