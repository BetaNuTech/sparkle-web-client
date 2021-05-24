import React from 'react';
import { OfflineNotify } from '../../components/common/OfflineNotify';
import { DefaultLayout } from '../../components/layouts/default';
import { useNavigatorOnline } from '../../utils/getOnlineStatus';

export default function Templates() {
  const isOnline = useNavigatorOnline();

  return (
    <DefaultLayout>
      {isOnline ? <div>Templates</div> : <OfflineNotify />}
    </DefaultLayout>
  );
}
