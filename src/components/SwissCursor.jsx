import { useEffect, useRef, useState } from 'react';

// Disque en fusion « difference » : il inverse ce qu'il survole, donc il reste
// lisible dans les deux thèmes sans rien savoir d'eux. Sur un élément
// interactif, il s'étire en étiquette qui dit ce qui va se passer.
function labelFor(node) {
  if (!node) return null;

  // La barre de navigation garde le disque nu : trop d'étiquettes y
  // défileraient pour trois liens courts. Un bouton marqué en miroir fait
  // exception — il est traité plus bas.
  if (node.closest('header') && !node.closest('[data-cursor-mirror]')) return null;

  // Certains boutons portent déjà leur libellé et leur signe. Le disque n'a
  // rien à leur ajouter : il devient le bouton, mot pour mot et trait pour
  // trait. On relève son allure sur place plutôt que de la recopier dans la
  // feuille de style — deux boutons n'ont pas le même corps ni la même
  // couleur, et le disque doit épouser celui qu'il survole.
  const miroir = node.closest('[data-cursor-mirror]');
  if (miroir) {
    const style = getComputedStyle(miroir);
    const boite = miroir.getBoundingClientRect();
    return {
      mot: miroir.dataset.cursorMirror || miroir.textContent.trim(),
      signe: miroir.dataset.cursorSign || 'VISIT',
      miroir: true,
      cadre: {
        height: `${Math.round(boite.height)}px`,
        paddingLeft: style.paddingLeft,
        paddingRight: style.paddingRight,
        borderColor: style.borderTopColor,
      },
      // L'écart entre le mot et le signe, et la taille du signe lui-même, se
      // relèvent aussi : sans eux le disque était six points plus large que
      // le bouton qu'il double.
      taille: Number(miroir.querySelector('svg')?.getAttribute('width')) || 13,
      lettres: {
        columnGap: style.columnGap,
        fontSize: style.fontSize,
        fontWeight: style.fontWeight,
        letterSpacing: style.letterSpacing,
        textTransform: style.textTransform,
        color: style.color,
      },
    };
  }

  // La loupe couvre tout : elle se referme d'un clic, où qu'il tombe.
  if (node.closest('[data-loupe]')) return 'CLOSE';

  // Un visuel de planche s'agrandit. La règle passe avant celle de la ligne
  // dépliée, qui referme tout le reste.
  if (node.closest('.filmstrip img')) return 'ZOOM';

  const summary = node.closest('summary');
  if (summary) {
    return summary.closest('details')?.open ? 'CLOSE' : 'VIEW';
  }

  // Dans une ligne dépliée — visuels compris — tout referme, sauf les liens.
  const open = node.closest('details[open]');
  if (open && !node.closest('a, button')) return 'CLOSE';

  if (node.closest('[data-accent-cycle]')) return 'TINT';
  if (node.closest('[data-grid-toggle]')) return 'GRID';
  if (node.closest('[data-weight-toggle]')) return 'WEIGHT';
  if (node.closest('[role="switch"]')) return 'THEME';

  const link = node.closest('a');
  if (!link) return node.closest('button') ? 'CLICK' : null;

  // Les petits liens en capitales gardent le disque nu. L'étiquette y était
  // plus large que le lien qu'elle commente : à ce rapport de taille elle
  // n'aide plus, elle couvre. Le mail et le téléphone du pied de page font
  // exception — ce sont les deux seules actions du site qui en sortent.
  const href = link.getAttribute('href') || '';
  const petit = link.closest('.swiss-meta');
  if (petit && !href.startsWith('mailto:') && !href.startsWith('tel:')) return null;
  // Les deux terrains personnels n'ouvrent pas une page comme une autre :
  // l'un propose, l'autre n'attend rien qu'un regard.
  if (href === '/lab') return 'EXPLORE';
  if (href === '/lepolographe') return 'ENJOY';
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
  // Un astérisque à six branches : rien à faire, seulement à regarder.
  ENJOY: 'M12 3.5v17M4.6 7.75l14.8 8.5M19.4 7.75l-14.8 8.5',
  // Deux coins qui s'écartent : le visuel prend toute la place.
  ZOOM: 'M4.5 10V4.5H10M19.5 14v5.5H14M4.5 4.5l6 6M19.5 19.5l-6-6',
  // Une goutte : le geste change l'encre du site.
  TINT: 'M12 3.2c3.4 4 5.6 6.9 5.6 9.6a5.6 5.6 0 0 1-11.2 0c0-2.7 2.2-5.6 5.6-9.6Z',
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

  // L'étiquette est soit un verbe du site — le mot et son signe portent alors
  // le même nom — soit les mots repris d'un bouton.
  const mot = typeof label === 'string' ? label : label?.mot;
  const signe = typeof label === 'string' ? label : label?.signe;
  const miroir = typeof label === 'object' && label?.miroir;
  const cadre = miroir ? label.cadre : undefined;
  const lettres = miroir ? label.lettres : undefined;
  const taille = miroir ? label.taille : 13;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className={`swiss-cursor pointer-events-none fixed left-0 top-0 z-[90] flex items-center justify-center overflow-hidden ${
        label
          ? `is-labelled w-auto rounded-full ${
              miroir ? 'is-mirror border' : 'h-[34px] bg-[var(--ink)] px-[18px]'
            }`
          : 'h-[21px] w-[21px] rounded-full bg-white px-0'
      } ${visible ? 'opacity-100' : 'opacity-0'}`}
      style={cadre}
    >
      {/* Le mot passe devant le signe, comme sur les boutons du site, où la
          flèche suit toujours ce qu'elle annonce. */}
      <span
        className={`flex items-center whitespace-nowrap leading-none ${
          miroir ? '' : 'gap-[7px] text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--paper)]'
        } ${label ? 'opacity-100' : 'opacity-0'}`}
        style={lettres}
      >
        {mot}
        {signe && GLYPHS[signe] && (
          <svg
            width={taille}
            height={taille}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path
              d={GLYPHS[signe]}
              fill={signe === 'WEIGHT' ? 'currentColor' : 'none'}
              stroke={signe === 'WEIGHT' ? 'none' : 'currentColor'}
            />
          </svg>
        )}
      </span>
    </div>
  );
}
