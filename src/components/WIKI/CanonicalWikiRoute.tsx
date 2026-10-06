import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { normalizeWikiPathname } from "../../utils/wikiUrl";

/** Normalize before mounting a page, so no request is made for the legacy + title. */
export default function CanonicalWikiRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const pathname = normalizeWikiPathname(location.pathname);
  if (pathname !== location.pathname) {
    return <Navigate replace to={{ pathname, search: location.search, hash: location.hash }} />;
  }
  return <>{children}</>;
}
