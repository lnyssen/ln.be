import { useEffect, useRef, useState } from 'react';

// Pastille smiley qui suit le pointeur, en plus du curseur natif (le site garde
// `cursor: auto`). Au survol d'un élément interactif, le visage bascule à 180°.
export default function SmileyCursor() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!fine || reduced) return undefined;

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let frame;

    const onMove = (event) => {
      target.x = event.clientX;
      target.y = event.clientY;
      setVisible(true);
      setHovering(Boolean(event.target.closest?.('a, button, [role="switch"]')));
    };

    const onLeave = () => setVisible(false);

    const tick = () => {
      current.x += (target.x - current.x) * 0.18;
      current.y += (target.y - current.y) * 0.18;
      if (ref.current) {
        ref.current.style.transform = `translate3d(${current.x}px, ${current.y}px, 0) translate(-50%, -50%)`;
      }
      frame = requestAnimationFrame(tick);
    };

    window.addEventListener('pointermove', onMove);
    document.addEventListener('pointerleave', onLeave);
    frame = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`pointer-events-none fixed left-0 top-0 z-[60] h-[60px] w-[60px] transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
    >
      <div
        className={`flex h-full w-full items-center justify-center rounded-full border-[3px] border-white bg-[var(--lab)] transition-transform duration-300 ${
          hovering ? 'rotate-180' : 'rotate-0'
        }`}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
          <ellipse cx="13.2" cy="13" rx="2.5" ry="3.3" fill="#fff" />
          <ellipse cx="22.8" cy="13" rx="2.5" ry="3.3" fill="#fff" />
          <path
            d="M11.4 22.6a8 8 0 0 0 13.2 0"
            stroke="#fff"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
}
