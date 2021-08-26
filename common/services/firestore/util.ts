export default {
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  createId(firestore: any, collectionName: string): string {
    return firestore.collection(collectionName).doc().id;
  }
};
