import defaultAvatar from "../assets/images/default_employee_male_avatar.webp";
import { handleGetFileFromServer } from "../functions/handleGetFileFromServer";

/**
 * Get avatar URL with fallback to default avatar.
 * Replaces http/https URLs with default avatar.
 * 
 * @param url - The image path or URL
 * @returns Avatar URL (default avatar for http/https URLs or processed relative paths)
 */
export const getAvatarUrl = (url: string | null | undefined): string => {
  // Always return defaultAvatar if no URL or empty string
  if (!url || typeof url !== 'string' || url.trim() === '') {
    return defaultAvatar;
  }
  
  const trimmedUrl = url.trim();
  
  // Block ALL placeholder service URLs immediately (before any processing)
  // These services cause CORB and network errors
  if (trimmedUrl.includes('placeholder.com') || 
      trimmedUrl.includes('placeholderapi') ||
      trimmedUrl.includes('via.placeholder') ||
      trimmedUrl.toLowerCase().includes('placeholder')) {
    return defaultAvatar;
  }
  
  // Block localhost URLs (development URLs that shouldn't be in production)
  if (trimmedUrl.includes('localhost') || trimmedUrl.includes('127.0.0.1')) {
    return defaultAvatar;
  }
  
  // If it's already a full HTTPS URL from backend (CDN/S3), use it as is
  // BUT only if it's from our domain or a trusted domain
  if (trimmedUrl.startsWith('https://')) {
    // Allow HTTPS URLs from our backend domain
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const serverUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
    const ourDomains = ['api.Diziel.com', 'Diziel.com', backendUrl, serverUrl].filter(Boolean);
    
    // Check if URL is from our domain
    const isFromOurDomain = ourDomains.some(domain => {
      if (!domain) return false;
      const domainName = domain.replace(/^https?:\/\//, '').split('/')[0];
      return trimmedUrl.includes(domainName);
    });
    
    if (isFromOurDomain) {
      return trimmedUrl;
    }
    
    // If it's HTTPS but from unknown domain, check if it's a common CDN
    const trustedDomains = ['amazonaws.com', 'cloudfront.net', 's3.', 'cdn.', 'storage.googleapis.com'];
    const isTrustedCDN = trustedDomains.some(domain => trimmedUrl.includes(domain));
    
    if (isTrustedCDN) {
      return trimmedUrl;
    }
    
    // Unknown HTTPS URL - use default avatar for safety
    return defaultAvatar;
  }
  
  // Replace insecure HTTP URLs with default avatar (security)
  if (trimmedUrl.startsWith('http://')) {
    return defaultAvatar;
  }
  
  // Handle relative paths (e.g., "/storage/users/xxx.jpg")
  // BUT skip if it looks like a local asset path (starts with /assets/)
  if (trimmedUrl.startsWith('/assets/')) {
    // This is a local asset, use it as-is or return defaultAvatar
    return defaultAvatar;
  }
  
  const processedUrl = handleGetFileFromServer(trimmedUrl);
  return processedUrl || defaultAvatar;
};

/**
 * Get image URL for non-avatar images.
 * Similar to getAvatarUrl but can be extended for different logic.
 * 
 * @param url - The image path or URL
 * @returns Image URL (default avatar for http/https URLs or processed relative paths)
 */
export const getImageUrl = (url: string | null | undefined): string => {
  return getAvatarUrl(url);
};

