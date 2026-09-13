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

  if (node.closest('[role="switch"]')) return 'THEME';

  const link = node.closest('a');
  if (!link) return node.closest('button') ? 'CLICK' : null;

  const href = link.getAttribute('href') || '';
  if (href.startsWith('mailto:')) return 'MAIL';
  if (href.startsWith('tel:')) return 'CALL';
  if (link.target === '_blank' || /^https?:/.test(href)) return 'VISIT ↗';
  if (href.startsWith('#')) return 'JUMP';
  return 'OPEN';
}

export default function SwissCursor() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [label, setLabel] = useState(null);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return undefined;

    const root = document.documentElement;
    root.dataset.swissCursor = '';

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

    const tick = () => {
      current.x += (target.x - current.x) * 0.22;
      current.y += (target.y - current.y) * 0.22;
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
      delete root.dataset.swissCursor;
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`swiss-cursor pointer-events-none fixed left-0 top-0 z-[60] flex items-center justify-center overflow-hidden rounded-full ${
        label
          ? 'is-labelled h-[34px] w-auto bg-[var(--ink)] px-[14px]'
          : 'h-[26px] w-[26px] bg-white px-0'
      } ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      {/* L'étiquette quitte la fusion : sur le violet, « difference » virait au
          vert olive. Elle devient une pastille pleine aux couleurs du thème. */}
      <span
        className={`whitespace-nowrap text-[11px] font-semibold uppercase leading-none tracking-[0.14em] text-[var(--paper)] ${
          label ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {label ?? ''}
      </span>
    </div>
  );
}
