'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import Hero from './Hero';
import WhoWeAre from './WhoWeAre';
import Products from './Products';
import Services from './Services';
import DynamicSections from './DynamicSections';
import Statistics from './Statistics';
import CTA from './CTA';

export default function HomeClient() {
  const { content, openContact, navigateTo } = useApp();

  const layout = content?.homepageLayout || [
    { id: 'hero', visible: true },
    { id: 'who-we-are', visible: true },
    { id: 'products', visible: true },
    { id: 'services', visible: true },
    { id: 'dynamic-sections', visible: true },
    { id: 'statistics', visible: true },
    { id: 'cta', visible: true }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
      className="w-full"
    >
      {layout
        .filter((sec: any) => sec.visible !== false)
        .map((sec: any) => {
          switch (sec.id) {
            case 'hero':
              return (
                <Hero
                  key="hero"
                  content={content?.hero}
                  onOpenContact={openContact}
                />
              );
            case 'highlights':
              return (
                <WhoWeAre
                  key="highlights"
                  mode="highlights"
                  highlights={content?.highlights}
                />
              );
            case 'who-we-are':
              return (
                <WhoWeAre
                  key="who-we-are"
                  mode="profile"
                  description={content?.aboutUs?.description}
                  profileImage={content?.aboutUs?.profileImage}
                />
              );
            case 'products':
              return (
                <Products
                  key="products"
                  categories={content?.categories}
                  onSelectCategory={(slug: string) => navigateTo(`/products/${slug}`)}
                />
              );
            case 'services':
              return (
                <Services
                  key="services"
                  services={content?.services}
                  navigateTo={navigateTo}
                  onOpenContact={openContact}
                />
              );
            case 'dynamic-sections':
              return (
                <DynamicSections
                  key="dynamic-sections"
                  sections={content?.dynamicSections}
                  onOpenContact={openContact}
                />
              );
            case 'statistics':
              return (
                <Statistics
                  key="statistics"
                  stats={content?.statistics}
                />
              );
            case 'cta':
              return (
                <CTA
                  key="cta"
                  ctaContent={content?.cta}
                  onOpenContact={openContact}
                />
              );
            default:
              return null;
          }
        })}
    </motion.div>
  );
}


