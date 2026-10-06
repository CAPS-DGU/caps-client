/** Legacy wiki paths used literal + for spaces. Preserve encoded %2B (e.g. C++). */
export function normalizeWikiPathname(pathname: string): string {
  return pathname.startsWith("/wiki/") ? pathname.replace(/\+/g, "%20") : pathname;
}

/** Encode a document title while preserving the optional in-document anchor. */
export function wikiHref(target: string): string {
  const hash = target.indexOf("#");
  const title = hash < 0 ? target : target.slice(0, hash);
  const fragment = hash < 0 ? "" : target.slice(hash);
  return `/wiki/${encodeURIComponent(title)}${fragment}`;
}
