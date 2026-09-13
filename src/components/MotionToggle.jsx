import { useEffect, useState } from 'react';

// Commande unique pour arrêter tout ce qui bouge seul : les onze carrousels et
// la bande défilante. WCAG 2.2.2 demande un moyen d'arrêt pour une animation
// automatique de plus de cinq secondes.
export const MOTION_EVENT = 'motionchange';

export default function MotionToggle() {
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (paused) {
      root.dataset.motion = 'paused';
    } else {
      delete root.dataset.motion;
    }
    window.dispatchEvent(new CustomEvent(MOTION_EVENT, { detail: { paused } }));
  }, [paused]);

  return (
    <button
      type="button"
      onClick={() => setPaused((p) => !p)}
      aria-pressed={paused}
      className="flex h-[38px] items-center gap-[10px] rounded-full border border-line px-[18px] text-base text-muted hover:border-accent hover:text-accent"
    >
      {paused ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
          <path d="M2 1l9 5-9 5z" />
        </svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" aria-hidden="true">
          <rect x="1.5" y="1" width="3" height="10" rx="1" />
          <rect x="7.5" y="1" width="3" height="10" rx="1" />
        </svg>
      )}
      {paused ? 'Play slideshows' : 'Pause slideshows'}
    </button>
  );
}
