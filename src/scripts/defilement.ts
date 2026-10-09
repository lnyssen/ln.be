import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

// Le défilement natif avance par crans à la molette : la page saute de
// cent pixels à chaque cran. Lenis lisse la molette et le pavé tactile —
// le doigt sur téléphone garde le défilement du système, qui est déjà
// fluide. Rien ne bouge pour qui demande moins de mouvement.
declare global {
  interface Window {
    __lenis?: Lenis;
    __defiler?: (top: number, doux?: boolean) => void;
  }
}

const calme = matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!calme && !window.__lenis) {
  const lenis = new Lenis({
    autoRaf: true,
    lerp: 0.11,
    // Les bandes qui défilent à l'horizontale, la palette ⌘K et la loupe
    // gardent leur propre défilement.
    prevent: (node: HTMLElement) =>
      !!node.closest?.('dialog, .filmstrip, .marquee-images, [data-loupe], [data-lenis-prevent]'),
  });
  window.__lenis = lenis;

  // Menu ouvert, la page ne doit plus bouger derrière l'affiche.
  const racine = document.documentElement;
  new MutationObserver(() => {
    if (racine.classList.contains('menu-rideau') || racine.classList.contains('menu-open')) lenis.stop();
    else lenis.start();
  }).observe(racine, { attributes: true, attributeFilter: ['class'] });

  // Après une transition de page, le routeur pose la page lui-même : Lenis
  // repart de là au lieu de glisser depuis l'ancienne position.
  document.addEventListener('astro:after-swap', () => {
    lenis.resize();
    lenis.scrollTo(window.scrollY, { immediate: true, force: true });
  });
}

// Un seul point d'entrée pour les défilements commandés par le site.
window.__defiler = (top, doux = true) => {
  if (window.__lenis) window.__lenis.scrollTo(top, { immediate: !doux, force: true });
  else window.scrollTo({ top, behavior: doux && !calme ? 'smooth' : 'instant' });
};
