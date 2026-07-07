'use client';

import React from 'react';
import { useApp } from '@/context/AppContext';
import CategoryView from './CategoryView';
import ProductDetailView from './ProductDetailView';

export default function DynamicProductClient({ slug }: { slug: string }) {
  const { content, navigateTo, openContact } = useApp();

  const categories = content?.categories || [];
  const products = content?.products || [];

  // Determine if it is a category or product slug
  const category = categories.find((c: any) => c.slug === slug || c.id === slug);
  const product = products.find((p: any) => p.slug === slug || p.id === slug);

  if (category) {
    // Filter products belonging to this category
    const categoryProducts = products.filter((p: any) => p.category === category.id);
    return (
      <CategoryView
        category={category}
        products={categoryProducts}
        onSelectProduct={(prodSlug: string) => navigateTo(`/products/${prodSlug}`)}
        onBackToCategories={() => navigateTo('/products')}
      />
    );
  }

  if (product) {
    const parentCategory = categories.find((c: any) => c.id === product.category);
    return (
      <ProductDetailView
        product={product}
        category={parentCategory}
        onOpenContact={openContact}
        onBackToCategory={() => {
          if (parentCategory) {
            navigateTo(`/products/${parentCategory.slug || parentCategory.id}`);
          } else {
            navigateTo('/products');
          }
        }}
        onBackToCategories={() => navigateTo('/products')}
      />
    );
  }

  // Fallback if neither found
  return (
    <div className="container mx-auto py-24 text-center">
      <h2 className="text-2xl font-bold mb-4">Item Not Found</h2>
      <p className="text-gray-600 mb-8">The product or category you are looking for does not exist.</p>
      <button
        onClick={() => navigateTo('/products')}
        className="px-6 py-3 bg-[#136B36] text-white rounded-lg hover:bg-[#0E5129] transition-colors"
      >
        Back to Products Catalog
      </button>
    </div>
  );
}


