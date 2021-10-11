export default function stubFirestore(
  config = {},
  success = true,
  err = Error()
): any {
  return {
    collection: () => ({
      add: (notification) => {
        if (success) {
          return Promise.resolve(notification);
        }
        return Promise.reject(err);
      }
    }),
    ...config
  };
}
