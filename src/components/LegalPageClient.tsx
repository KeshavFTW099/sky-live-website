'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import LegalPageView from './LegalPageView';

export default function LegalPageClient({ policyKey }: { policyKey: string }) {
  const { content, navigateTo } = useApp();

  return (
    <LegalPageView
      legalData={content?.legal}
      policyKey={policyKey}
      navigateTo={navigateTo}
    />
  );
}


