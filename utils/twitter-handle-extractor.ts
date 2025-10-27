/**
 * Extract Twitter handle from various input formats
 * Supports:
 * - Direct handles: @username or username
 * - Profile URLs: https://twitter.com/username or https://x.com/username
 * - Tweet URLs: https://twitter.com/username/status/123456
 */
export function extractTwitterHandle(input: string): string | null {
  if (!input || typeof input !== 'string') {
    return null;
  }

  const trimmedInput = input.trim();

  // Direct handle format (@username or username)
  if (trimmedInput.startsWith('@')) {
    const handle = trimmedInput.split(/[\s\/]/)[0]; // Get first part before space or slash
    if (handle.length > 1) {
      return handle;
    }
  }

  // Check if it's a URL
  try {
    const url = new URL(trimmedInput);
    
    // Check if it's a Twitter/X domain
    if (url.hostname === 'twitter.com' || 
        url.hostname === 'www.twitter.com' || 
        url.hostname === 'x.com' || 
        url.hostname === 'www.x.com' ||
        url.hostname === 'mobile.twitter.com' ||
        url.hostname === 'mobile.x.com') {
      
      // Extract username from path
      // Paths can be: /username, /username/status/123456, etc.
      const pathParts = url.pathname.split('/').filter(part => part.length > 0);
      
      if (pathParts.length > 0) {
        const username = pathParts[0];
        
        // Filter out common non-username paths
        const excludedPaths = ['home', 'explore', 'notifications', 'messages', 'i', 'settings', 'search'];
        if (!excludedPaths.includes(username.toLowerCase())) {
          return '@' + username;
        }
      }
    }
  } catch (e) {
    // Not a valid URL, might be a plain username
    // Check if it looks like a username (alphanumeric + underscore)
    if (/^[a-zA-Z0-9_]+$/.test(trimmedInput)) {
      return '@' + trimmedInput;
    }
  }

  return null;
}

/**
 * Extract Twitter handle from share intent data
 * Checks both text and webUrl fields
 */
export function extractHandleFromShareIntent(shareIntent: {
  text?: string | null;
  webUrl?: string | null;
}): string | null {
  // Try webUrl first (more reliable for Twitter shares)
  if (shareIntent.webUrl) {
    const handle = extractTwitterHandle(shareIntent.webUrl);
    if (handle) return handle;
  }

  // Try text field
  if (shareIntent.text) {
    const handle = extractTwitterHandle(shareIntent.text);
    if (handle) return handle;
  }

  return null;
}
