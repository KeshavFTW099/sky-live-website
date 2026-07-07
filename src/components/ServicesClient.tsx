'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Services from './Services';

export default function ServicesClient() {
  const { content, openContact } = useApp();

  return (
    <Services
      services={content?.services || []}
      onOpenContact={openContact}
    />
  );
}
