'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import AdminDashboard from './AdminDashboard';
import '@/app/admin.css';

function AdminInner() {
  const { content, updateContent, navigateTo } = useApp();

  return (
    <AdminDashboard
      content={content}
      onUpdateContent={updateContent}
      onGoHome={() => navigateTo('/')}
    />
  );
}

export default function AdminClient({ initialContent }: { initialContent: any }) {
  return (
    <AppProvider initialContent={initialContent}>
      <AdminInner />
    </AppProvider>
  );
}


