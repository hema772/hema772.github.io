import { credlyThumb } from "./credlyThumb";

/**
 * Resolves a badge image URL:
 * - Root-relative paths (e.g. "/images/certifications/foo.png") are prefixed
 *   with Vite's base URL (e.g. "/portfolio-react/") so they resolve correctly
 *   in both dev server and GitHub Pages subpath deployment.
 * - External Credly URLs get resized retina thumbnails via credlyThumb.
 * - Other external URLs pass through untouched.
 */
export const resolveBadgeImage = (url: string, px?: number): string => {
   if (url.startsWith("/")) {
      const base = (import.meta.env?.BASE_URL ?? "/").replace(/\/$/, "");
      return `${base}${url}`;
   }
   return px ? credlyThumb(url, px) : url;
};
