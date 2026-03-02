import React, { useMemo, useState } from 'react';
import type { Locale } from './messages';
import { LocaleContext } from './context';
import { translate } from './translate';

const STORAGE_KEY = 'locale';

// (role: safe locale parser, type: (unknown)=>Locale)
function parseLocale(value: unknown): Locale {
  if (value === 'en' || value === 'ko' || value === 'ja') return value;
  return 'en';
}

// (role: safe storage read, type: ()=>Locale)
function loadLocale(): Locale {
  try {
    return parseLocale(localStorage.getItem(STORAGE_KEY));
  } catch {
    return 'en';
  }
}

export function LocaleProvider(props: {
  children: React.ReactNode; // (role: subtree, type: React.ReactNode)
}) {
  const [locale, setLocaleState] = useState<Locale>(() => loadLocale());

  // (role: set locale and persist, type: (Locale)=>void)
  const setLocale = (next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore storage failure
    }
  };

  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>) =>
      translate(locale, key, params);
  }, [locale]);

  // value 객체가 매 렌더마다 바뀌지 않게 메모이즈 (불필요한 re-render 감소)
  const value = useMemo(() => ({ locale, setLocale, t }), [locale, t]);

  return (
    <LocaleContext.Provider value={value}>
      {props.children}
    </LocaleContext.Provider>
  );
}
