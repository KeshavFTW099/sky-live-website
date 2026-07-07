'use client';

import React from 'react';
import { AppProvider, useApp } from '@/context/AppContext';
import Header from './Header';
import Footer from './Footer';
import ContactModal from './ContactModal';
import LangModal from './LangModal';
import { usePathname } from 'next/navigation';

function LayoutInner({ children }: { children: React.ReactNode }) {
  const {
    content,
    contactOpen,
    closeContact,
    contactContext,
    langOpen,
    closeLang,
    currentLang,
    handleLanguageChange,
    navigateTo,
    openContact,
    openLang,
  } = useApp();

  const pathname = usePathname();

  return (
    <>
      <Header
        onOpenContact={openContact}
        onOpenLang={openLang}
        currentLang={currentLang}
        currentView={pathname === '/' ? 'home' : pathname.substring(1)}
        currentPath={pathname}
        navigateTo={navigateTo}
        categories={content?.categories}
        products={content?.products}
        services={content?.services}
      />
      <main style={{ position: 'relative', overflow: 'hidden' }}>
        {children}
      </main>
      <Footer
        footerContent={content?.footer}
        onOpenContact={openContact}
        navigateTo={navigateTo}
        categories={content?.categories}
        services={content?.services}
        serviceCategories={content?.serviceCategories}
        whatWeDo={content?.whatWeDo}
      />
      <ContactModal
        isOpen={contactOpen}
        onClose={closeContact}
        context={contactContext}
      />
      <LangModal
        isOpen={langOpen}
        onClose={closeLang}
        currentLang={currentLang}
        onChangeLang={handleLanguageChange}
      />
    </>
  );
}

export default function ClientLayout({
  children,
  initialContent,
}: {
  children: React.ReactNode;
  initialContent: any;
}) {
  return (
    <AppProvider initialContent={initialContent}>
      <LayoutInner>{children}</LayoutInner>
    </AppProvider>
  );
}


