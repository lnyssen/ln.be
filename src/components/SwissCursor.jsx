import { useEffect, useRef, useState } from 'react';

// Disque en fusion « difference » : il inverse ce qu'il survole, donc il reste
// lisible dans les deux thèmes sans rien savoir d'eux. Sur un élément
// interactif, il s'étire en étiquette qui dit ce qui va se passer.
function labelFor(node) {
  if (!node) return null;

  // La barre de navigation garde le disque nu : trop d'étiquettes y
  // défileraient pour trois liens courts.
  if (node.closest('header')) return null;

  const summary = node.closest('summary');
  if (summary) {
    return summary.closest('details')?.open ? 'CLOSE' : 'VIEW';
  }

  // Dans une ligne dépliée — visuels compris — tout referme, sauf les liens.
  const open = node.closest('details[open]');
  if (open && !node.closest('a, button')) return 'CLOSE';

  if (node.closest('[data-grid-toggle]')) return 'GRID';
  if (node.closest('[data-weight-toggle]')) return 'WEIGHT';
  if (node.closest('[role="switch"]')) return 'THEME';

  const link = node.closest('a');
  if (!link) return node.closest('button') ? 'CLICK' : null;

  const href = link.getAttribute('href') || '';
  // Le renvoi vers le Lab n'ouvre pas une page comme une autre : il propose.
  if (href === '/lab') return 'EXPLORE';
  if (href.startsWith('mailto:')) return 'MAIL';
  if (href.startsWith('tel:')) return 'CALL';
  if (link.target === '_blank' || /^https?:/.test(href)) return 'VISIT';
  if (href.startsWith('#')) return 'JUMP';
  return 'OPEN';
}

// Un signe par verbe : l'étiquette dit ce qui va se passer, le signe le montre
// avant même qu'on l'ait lue. Tous dessinés sur la même grille de 24, au même
// trait, pour qu'ils pèsent pareil à côté des capitales.
const GLYPHS = {
  VIEW: 'M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12Z M12 9.2a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6Z',
  CLOSE: 'M6 6l12 12M18 6L6 18',
  EXPLORE: 'M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Z M15.8 8.2l-2.1 5.5-5.5 2.1 2.1-5.5 5.5-2.1Z',
  VISIT: 'M7 17 17 7M9 7h8v8',
  OPEN: 'M4 12h15M13 6l6 6-6 6',
  JUMP: 'M12 4.5v14M6 13l6 6 6-6',
  MAIL: 'M3.5 6.5h17v11h-17z M3.5 7l8.5 6 8.5-6',
  CALL: 'M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a1.5 1.5 0 0 1-1.7 1.5A16.5 16.5 0 0 1 4.5 5.2 1.5 1.5 0 0 1 6 3.5Z',
  THEME: 'M12 2.8a9.2 9.2 0 1 0 0 18.4 9.2 9.2 0 0 0 0-18.4Z M12 2.8v18.4',
  GRID: 'M4.5 3.5v17M9.5 3.5v17M14.5 3.5v17M19.5 3.5v17',
  // Trois barres qui épaississent : le trait seul ne peut pas varier, on
  // les trace donc pleines.
  WEIGHT: 'M4 5.6h16v1.3H4zM4 10.8h16v2.2H4zM4 16.6h16v3.4H4z',
  CLICK: 'M6 3.5l12.5 8.2-5.4 1.2 2.6 5.6-2.4 1.1-2.6-5.6-3.7 4V3.5Z',
};

export default function SwissCursor() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return undefined;

    // Le drapeau est déjà posé avant la peinture par la mise en page ; on le
    // confirme seulement, sans jamais le retirer, pour qu'une transition de
    // vue ne laisse pas réapparaître la flèche.
    document.documentElement.dataset.swissCursor = '';

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame;
    let started = false;

    const onMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      if (!started) {
        current.x = target.x;
        current.y = target.y;
        started = true;
      }
      setVisible(true);
      setLabel(labelFor(event.target));
    };

    const onLeave = () => setVisible(false);

    // L'étiquette d'une ligne d'index bascule VIEW / CLOSE à l'ouverture.
    const onToggle = () => {
      const hovered = document.querySelector('summary:hover');
      if (hovered) setLabel(labelFor(hovered));
    };

    // Le disque rattrape le pointeur au lieu de lui coller : 0,13 laisse une
    // traîne perceptible sans que l'écart devienne gênant au clic, puisque
    // c'est le pointeur réel, invisible, qui atteint la cible.
    const tick = () => {
      current.x += (target.x - current.x) * 0.13;
      current.y += (target.y - current.y) * 0.13;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);
    document.addEventListener('toggle', onToggle, true);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      document.removeEventListener('toggle', onToggle, true);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`swiss-cursor pointer-events-none fixed left-0 top-0 z-[60] flex items-center justify-center overflow-hidden ${
        label
          ? 'is-labelled h-[34px] w-auto rounded-full bg-[var(--ink)] px-[18px]'
          : 'h-[21px] w-[21px] rounded-full bg-white px-0'
      } ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* L'étiquette quitte la fusion : sur le violet, « difference » virait au
          vert olive. Elle devient une pastille pleine aux couleurs du thème. */}
      <span
        className={`flex items-center gap-[7px] whitespace-nowrap text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-[var(--paper)] ${
          label ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {label && GLYPHS[label] && (
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path
              d={GLYPHS[label]}
              fill={label === 'WEIGHT' ? 'currentColor' : 'none'}
              stroke={label === 'WEIGHT' ? 'none' : 'currentColor'}
            />
          </svg>
        )}
        {label ?? ''}
      </span>
    </div>
  );
}
