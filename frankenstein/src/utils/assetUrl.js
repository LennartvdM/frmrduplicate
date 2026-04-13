/**
 * Prefix a public asset path with the Vite base URL.
 * In dev mode (base = "/"), this is a no-op.
 * In production with base = "/frankenstein/", this prefixes correctly.
 */
export function assetUrl(path) {
  const base = import.meta.env.BASE_URL || '/';
  // Avoid double slashes
  if (path.startsWith('/')) {
    return base.endsWith('/') ? base + path.slice(1) : base + path;
  }
  return base.endsWith('/') ? base + path : base + '/' + path;
}
