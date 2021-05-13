import React from 'react';
import { PropertiesApi } from '../api/PropertiesApi';

export default function Home() {
  const [properties, setProperties] = React.useState([]);

  React.useEffect(() => {
    PropertiesApi.getMe().then((data) => setProperties(data));
  }, []);

  return (
    <div>
      {properties.map((doc) => (
        <div key={doc.data.id} id>
          {doc.data}
        </div>
      ))}
    </div>
  );
}
