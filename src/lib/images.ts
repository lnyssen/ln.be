const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

const byPublicPath = new Map<string, ImageMetadata>();

// Deux écritures pour le même fichier. « /images/x.jpg » est celle qu'ont
// tous les projets écrits à la main ; « src/assets/images/x.jpg » est le
// chemin réel dans le dépôt, celui que l'atelier d'édition inscrit désormais
// — c'est le seul qu'il sache retrouver pour en montrer l'aperçu, les
// visuels n'étant pas servis tels quels par le site.
for (const [path, module] of Object.entries(modules)) {
  const fichier = path.replace('../assets/images', '');
  byPublicPath.set(`/images${fichier}`, module.default);
  byPublicPath.set(`src/assets/images${fichier}`, module.default);
}

export function resolveImage(path: string | undefined): ImageMetadata | null {
  if (!path) return null;
  return byPublicPath.get(path) ?? null;
}
