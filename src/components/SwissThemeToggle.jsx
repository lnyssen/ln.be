import { useEffect, useState } from 'react';

// Interrupteur clair/sombre : piste rectangulaire et curseur carré qui coulisse.
// Les angles vifs plutôt qu'une pilule, pour rester dans la grammaire suisse.
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
      className="relative h-[26px] w-[52px] shrink-0 border border-[var(--rule)] bg-transparent"
    >
      {/* Repères sous le curseur : soleil à gauche, lune à droite. */}
      <span className="pointer-events-none absolute inset-0 flex items-center justify-between px-[6px] text-[var(--ink-soft)]">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
          <circle cx="12" cy="12" r="4.5" />
          <path d="M12 1.5v2.5M12 20v2.5M3.9 3.9l1.8 1.8M18.3 18.3l1.8 1.8M1.5 12H4M20 12h2.5M3.9 20.1l1.8-1.8M18.3 5.7l1.8-1.8" />
        </svg>
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
        </svg>
      </span>

      <span
        className={`absolute top-[3px] h-[18px] w-[22px] bg-[var(--ink)] transition-[left] duration-200 ease-out ${
          isDark ? 'left-[27px]' : 'left-[3px]'
        }`}
        aria-hidden="true"
      />
    </button>
  );
}
