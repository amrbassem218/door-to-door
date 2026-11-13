const checked = new Map<string, Promise<boolean>>();

/** Resolves true only if the image at `src` actually loads. Results are cached. */
export const canLoadImage = (src?: string | null, timeoutMs = 8000) => {
  if (!src || typeof window === "undefined") return Promise.resolve(false);
  const cached = checked.get(src);
  if (cached) return cached;
  const p = new Promise<boolean>((resolve) => {
    const img = new Image();
    const timer = setTimeout(() => resolve(false), timeoutMs);
    img.onload = () => {
      clearTimeout(timer);
      resolve(img.naturalWidth > 0);
    };
    img.onerror = () => {
      clearTimeout(timer);
      resolve(false);
    };
    img.src = src;
  });
  checked.set(src, p);
  return p;
};

/** Keeps only the items whose thumbnail loads, preserving order. */
export const filterLoadable = async <T extends { thumbnail?: string | null }>(
  items: T[],
) => {
  const ok = await Promise.all(items.map((i) => canLoadImage(i.thumbnail)));
  return items.filter((_, i) => ok[i]);
};
