'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import AboutDirector from './AboutDirector';

export default function AboutDirectorClient() {
  const { content, openContact } = useApp();

  return (
    <AboutDirector
      content={content?.director}
    />
  );
}


