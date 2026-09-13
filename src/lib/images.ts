const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

const byPublicPath = new Map<string, ImageMetadata>();

for (const [path, module] of Object.entries(modules)) {
  const publicPath = path.replace('../assets/images', '/images');
  byPublicPath.set(publicPath, module.default);
}

export function resolveImage(path: string | undefined): ImageMetadata | null {
  if (!path) return null;
  return byPublicPath.get(path) ?? null;
}
