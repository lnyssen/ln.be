import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    setTheme(document.documentElement.getAttribute('data-theme') ?? 'dark');
  }, []);

  const isDark = theme === 'dark';

  const toggle = () => {
    const next = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    setTheme(next);
  };

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={!isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative h-11 w-[70px] rounded-full border border-line bg-[var(--surface)]"
    >
      <span
        className={`absolute top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--fg)] text-[var(--bg)] transition-all duration-300 ${
          isDark ? 'left-1.5' : 'left-[32px]'
        }`}
      >
        {isDark ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </svg>
        )}
      </span>
    </button>
  );
}
