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
    const root = document.documentElement;

    // Les jetons changent d'un bloc, mais les éléments qui portent une
    // transition de couleur mettraient 200 ms à suivre : on voyait le cadre
    // de « Get in touch » virer au blanc après le fond. Le temps d'une image,
    // plus personne ne transitionne — sauf le curseur, dont la glissade est
    // justement ce qu'on veut voir.
    root.dataset.themeSwitching = '';
    root.dataset.swissTheme = next;
    localStorage.setItem('swiss-theme', next);
    setTheme(next);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        delete root.dataset.themeSwitching;
      });
    });
  };

  return (
    <button
      type="button"
      onClick={toggle}
      role="switch"
      aria-checked={isDark}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
      className="relative box-content h-[20px] w-[48px] shrink-0 border border-[var(--rule)] p-[3px] transition-colors duration-200 hover:border-[var(--accent)]"
    >
      {/* Les deux repères, chacun centré dans sa moitié de 24px. */}
      <span className="pointer-events-none absolute inset-[3px] flex text-[var(--ink-soft)]">
        <span className="flex w-1/2 items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" aria-hidden="true">
            <circle cx="12" cy="12" r="4.5" />
            <path d="M12 1.5v2.5M12 20v2.5M3.9 3.9l1.8 1.8M18.3 18.3l1.8 1.8M1.5 12H4M20 12h2.5M3.9 20.1l1.8-1.8M18.3 5.7l1.8-1.8" />
          </svg>
        </span>
        <span className="flex w-1/2 items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
          </svg>
        </span>
      </span>

      {/* Curseur : une moitié pleine, qui glisse exactement de sa largeur. Sa
          position vient du CSS, lu sur l'attribut de thème que le script
          d'avant-peinture a déjà posé — l'état React arriverait une image
          trop tard et le curseur traverserait la piste à chaque page. */}
      <span
        className="theme-knob pointer-events-none absolute left-[3px] top-[3px] h-[20px] w-[24px] bg-[var(--ink)]"
        aria-hidden="true"
      />
    </button>
  );
}
