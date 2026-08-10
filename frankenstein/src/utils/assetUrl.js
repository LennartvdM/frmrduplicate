/**
 * Prefix a public asset path with the Vite base URL.
 * In dev mode (base = "/"), this is a no-op.
 * In production with base = "/frankenstein/", this prefixes correctly.
 */
export function assetUrl(path) {
  // `import.meta.env` is substituted by Vite at build time, but the build-time
  // prerenderer imports the data modules that call this straight from Node,
  // where it is undefined. Guard so both consumers work off the same source.
  const base = (import.meta.env && import.meta.env.BASE_URL) || '/';
  // Avoid double slashes
  if (path.startsWith('/')) {
    return base.endsWith('/') ? base + path.slice(1) : base + path;
  }
  return base.endsWith('/') ? base + path : base + '/' + path;
}
