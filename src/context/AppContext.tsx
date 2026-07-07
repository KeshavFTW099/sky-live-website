'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

interface AppContextType {
  content: any;
  updateContent: (newContent: any) => void;
  currentLang: string;
  contactOpen: boolean;
  contactContext: any;
  langOpen: boolean;
  openContact: (context?: any) => void;
  closeContact: () => void;
  openLang: () => void;
  closeLang: () => void;
  handleLanguageChange: (langName: string, langCode: string) => void;
  navigateTo: (path: string, targetId?: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({
  children,
  initialContent,
}: {
  children: React.ReactNode;
  initialContent: any;
}) {
  const [content, setContent] = useState(initialContent);
  const [currentLang, setCurrentLang] = useState('English (Global)');
  const [contactOpen, setContactOpen] = useState(false);
  const [contactContext, setContactContext] = useState<any>(null);
  const [langOpen, setLangOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // Keep content in sync with server component loads
  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    }
  }, [initialContent]);

  const updateContent = (newContent: any) => {
    setContent(newContent);
  };

  const openContact = (context = null) => {
    setContactContext(context);
    setContactOpen(true);
  };

  const closeContact = () => {
    setContactOpen(false);
    setContactContext(null);
  };

  const openLang = () => setLangOpen(true);
  const closeLang = () => setLangOpen(false);

  const handleLanguageChange = (langName: string, langCode: string) => {
    setCurrentLang(langName);
    const translateSelect = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
    if (translateSelect) {
      translateSelect.value = langCode;
      translateSelect.dispatchEvent(new Event('change'));
    } else {
      setTimeout(() => {
        const retrySelect = document.querySelector('.goog-te-combo') as HTMLSelectElement | null;
        if (retrySelect) {
          retrySelect.value = langCode;
          retrySelect.dispatchEvent(new Event('change'));
        }
      }, 500);
    }
  };

  const navigateTo = (path: string, targetId: string | null = null) => {
    const isSamePage = pathname === path || (path === '/' && pathname === '/');

    if (!isSamePage) {
      router.push(path);
    }

    if (targetId) {
      const scroll = () => {
        const el = document.getElementById(targetId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      };
      if (isSamePage) {
        scroll();
      } else {
        setTimeout(scroll, 300);
      }
    } else if (!isSamePage) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <AppContext.Provider
      value={{
        content,
        updateContent,
        currentLang,
        contactOpen,
        contactContext,
        langOpen,
        openContact,
        closeContact,
        openLang,
        closeLang,
        handleLanguageChange,
        navigateTo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
