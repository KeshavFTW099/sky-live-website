'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import Careers from './Careers';

export default function CareersClient() {
  const { content, openContact } = useApp();

  return (
    <Careers
      content={content?.careers}
      onOpenContact={openContact}
    />
  );
}


