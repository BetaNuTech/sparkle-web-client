import React from 'react';
import { MainLayout } from '../../common/MainLayout';
import DeleteConfirmModal from '../../common/DeleteConfirmModal';
import { Properties } from '../../features/Properties';

export default function PropertiesPage() {
  return (
    <MainLayout>
      <Properties />
      <DeleteConfirmModal />
    </MainLayout>
  );
}
