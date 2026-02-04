/**
 * Cache Warmer Utility
 * 
 * Triggers a background request to warm the Cloudflare cache for PDF files
 * stored in the local library_storage folder on the cPanel server.
 */

const CACHE_WARMER_URL = 'https://bibliothecamacedonica.com/warm_cache.php';

/**
 * Triggers cache warming for a local storage file.
 * This is a fire-and-forget request - it doesn't block the user.
 * 
 * @param filename - The filename of the PDF (e.g., "book_name.pdf")
 */
export const warmCache = async (filename: string): Promise<void> => {
  if (!filename || !filename.trim()) {
    console.warn('[CacheWarmer] No filename provided, skipping cache warming');
    return;
  }

  const cleanFilename = filename.trim();
  const url = `${CACHE_WARMER_URL}?file=${encodeURIComponent(cleanFilename)}`;

  console.log(`[CacheWarmer] Warming cache for: ${cleanFilename}`);

  try {
    // Fire-and-forget: we don't await the full response
    // Using no-cors mode as fallback in case of CORS issues
    const response = await fetch(url, {
      method: 'GET',
      mode: 'cors', // Try cors first
    }).catch(() => {
      // Fallback to no-cors if cors fails
      return fetch(url, {
        method: 'GET',
        mode: 'no-cors',
      });
    });

    // If we got a response (cors mode worked), log the result
    if (response && response.ok) {
      const data = await response.json().catch(() => null);
      if (data) {
        console.log('[CacheWarmer] Response:', data);
      }
    }

    console.log(`[CacheWarmer] Cache warming triggered for: ${cleanFilename}`);
  } catch (error) {
    // Don't throw - cache warming failure shouldn't break the save flow
    console.warn('[CacheWarmer] Failed to trigger cache warming:', error);
  }
};

/**
 * Fire-and-forget cache warming.
 * Immediately returns after triggering the request.
 * 
 * @param filename - The filename of the PDF
 */
export const warmCacheFireAndForget = (filename: string): void => {
  // Fire and forget - don't await
  warmCache(filename);
};
