'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import WhatWeDo from './WhatWeDo';

export default function WhatWeDoClient() {
  const { content, openContact } = useApp();

  return (
    <WhatWeDo
      content={content}
      onOpenContact={openContact}
    />
  );
}


