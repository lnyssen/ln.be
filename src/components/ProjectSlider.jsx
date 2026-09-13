import { useEffect, useRef, useState } from 'react';

// Le site fait glisser la piste vers la gauche, un visuel toutes les ~1,8 s,
// avec un amorti d'environ 700 ms.
const AUTOPLAY_MS = 1800;
const SLIDE_MS = 700;

export default function ProjectSlider({ images = [], title = '' }) {
  const [index, setIndex] = useState(0);
  const [animated, setAnimated] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [stopped, setStopped] = useState(false);
  const count = images.length;
  const paused = hovered || stopped;

  // Commande de pause globale, rendue à côté de « Curated work ».
  useEffect(() => {
    const onMotion = (event) => setStopped(Boolean(event.detail?.paused));
    window.addEventListener('motionchange', onMotion);
    return () => window.removeEventListener('motionchange', onMotion);
  }, []);

  // Un clone du premier visuel ferme la piste : l'enchaînement du dernier vers
  // le premier glisse donc vers la gauche comme les autres, sans retour arrière.
  const slides = count > 1 ? [...images, images[0]] : images;

  useEffect(() => {
    if (count < 2 || paused) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const id = setTimeout(() => setIndex((i) => i + 1), AUTOPLAY_MS);
    return () => clearTimeout(id);
  }, [count, paused, index]);

  useEffect(() => {
    if (index !== count || count < 2) return undefined;

    // Arrivé sur le clone, on revient à l'original sans animation.
    const id = setTimeout(() => {
      setAnimated(false);
      setIndex(0);
    }, SLIDE_MS);
    return () => clearTimeout(id);
  }, [index, count]);

  useEffect(() => {
    if (animated) return undefined;
    const id = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(id);
  }, [animated]);

  if (count === 0) {
    return <div className="aspect-[3/2] w-full rounded-[10px] bg-[var(--surface)]" />;
  }

  const active = index % count;
  const goTo = (next) => {
    setAnimated(true);
    setIndex((next + count) % count);
  };

  return (
    <div
      className="relative overflow-hidden rounded-[10px] bg-[var(--surface)]"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocusCapture={() => setHovered(true)}
      onBlurCapture={() => setHovered(false)}
    >
      <div
        className="flex aspect-[3/2] w-full"
        style={{
          transform: `translate3d(-${index * 100}%, 0, 0)`,
          transition: animated ? `transform ${SLIDE_MS}ms cubic-bezier(0.22, 1, 0.36, 1)` : 'none',
        }}
      >
        {slides.map((src, i) => (
          <img
            key={`${src}-${i}`}
            src={src}
            alt={i === 0 ? title : ''}
            loading={i === 0 ? 'eager' : 'lazy'}
            className="h-full w-full shrink-0 object-cover"
          />
        ))}
      </div>

      {count > 1 && (
        <>
          <button
            type="button"
            onClick={() => goTo(active - 1)}
            aria-label="Previous image"
            className="absolute left-[15px] top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm hover:bg-black/85"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M15 5l-7 7 7 7" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(active + 1)}
            aria-label="Next image"
            className="absolute right-[15px] top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-black/65 text-white backdrop-blur-sm hover:bg-black/85"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-[15px] left-1/2 flex -translate-x-1/2 gap-2" aria-hidden="true">
            {images.map((src, i) => (
              <span
                key={src}
                className={`h-2 w-2 rounded-full bg-[var(--accent-strong)] ${
                  i === active ? 'opacity-100' : 'opacity-40'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
