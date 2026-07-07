'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import ProductsView from './ProductsView';

export default function ProductsIndexClient() {
  const { content, navigateTo } = useApp();

  return (
    <ProductsView
      categories={content?.categories || []}
      onSelectCategory={(slug: string) => navigateTo(`/products/${slug}`)}
    />
  );
}


