## File Uploads

Simple file uploads that don't require any manipulation of the file can be handled directly by the client (without API). We use the (Firebase Storage SDK)[https://firebase.google.com/docs/storage/web/start] for uploads.

Generally uploading files is a 2 part process: upload to Firebase Storage followed by updating Firestore record(s). You may have steps in between, but here's a simplified approach:

###### 1. Importing

```ts
import useStorage, { StorageResult } from '../../common/hooks/useStorage';
import propertiesApi from '../..//services/api/properties'; // example
```

###### 2. Setup Storage

```ts
const { uploadFileToStorage } = useStorage();
```

###### 3. Controller Action

Basically gluing together the storage uploading and the database update.

```ts
const [isLoading, setIsLoading] = useState(false);

const onFileChange = async (ev: ChangeEvent<HTMLInputElement>) => {
  const [file] = ev.target.files;
  setIsLoading(true);

  // Upload to Firebase Storage
  let storageResult: StorageResult = null;
  try {
    storageResult = await uploadFileToStorage(
      `/storage/dest/${file.name}`,
      file
    );
  } catch (err) {
    // TODO handle error
    return setIsLoading(false);
  }

  // Update our database with the file url
  try {
    await propertiesApi.updateRecord(property.id, {
      photoURL: storageResult.fileUrl
    });
  } catch (err) {
    // TODO handle error
  }

  setIsLoading(false);
};
```

###### 4. Add File Input

```tsx
<input type="file" onChange={onFileChange} />
```
