import { useEffect, useState } from 'react';

// Interrupteur clair/sombre. Géométrie exacte : piste 56×28 bordée de 1px,
// gouttière de 3px, deux moitiés de 24×20 — le curseur couvre pile une moitié
// et les marges sont égales des deux côtés.
export default function SwissThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    setTheme(document.documentElement.dataset.swissTheme ?? 'light');
  }, []);

  const isDark = theme === 'dark';

  const toggle = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.dataset.swissTheme = next;
    localStorage.setItem('swiss-theme', next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="relative box-content h-[20px] w-[48px] shrink-0 border border-[var(--rule)] p-[3px]"
    >
      {/* Les deux repères, chacun centré dans sa moitié de 24px. */}
      <span className="pointer-events-none absolute inset-[3px] flex text-[var(--ink-soft)]">
        <span className="flex w-1/2 items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 1.5v2.5M12 20v2.5M3.9 3.9l1.8 1.8M18.3 18.3l1.8 1.8M1.5 12H4M20 12h2.5M3.9 20.1l1.8-1.8M18.3 5.7l1.8-1.8" />
          </svg>
        </span>
        <span className="flex w-1/2 items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>
        </span>
      </span>

      {/* Curseur : une moitié pleine, qui glisse exactement de sa largeur. */}
      <span
        className="pointer-events-none absolute left-[3px] top-[3px] h-[20px] w-[24px] bg-[var(--ink)] transition-transform duration-200 ease-out"
        style={{ transform: isDark ? 'translateX(24px)' : 'translateX(0)' }}
        aria-hidden="true"
      />
    </button>
  );
}
