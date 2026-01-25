/**
 * Get full image URL for preview.
 * Handles both relative paths and full URLs from backend.
 * 
 * Backend returns:
 * - Full URLs (if already full URL in database or remote storage like S3) - use as is
 * - Relative paths starting with "/storage/" (if local storage) - prepend VITE_BACKEND_URL
 * 
 * @param file - The image path or URL from backend
 * @returns Full URL for image preview
 */
export const handleGetFileFromServer = (file: string | null | undefined): string | null => {
  if (!file || file.trim() === '') {
    return null;
  }

  const trimmedFile = file.trim();

  // Block placeholder service URLs (may cause network errors)
  if (trimmedFile.includes('via.placeholder.com') || 
      trimmedFile.includes('placeholder.com') || 
      trimmedFile.includes('placeholderapi')) {
    return null;
  }

  // Block local asset paths (these are bundled assets, not backend files)
  // Vite bundles these assets and they should be loaded from the app origin, not backend
  if (trimmedFile.startsWith('/assets/') || 
      trimmedFile.includes('/assets/') ||
      trimmedFile.startsWith('assets/')) {
    return null;
  }

  // If it's already a full URL (http/https), check if it needs domain replacement
  if (trimmedFile.startsWith('http://') || trimmedFile.startsWith('https://')) {
    // Replace localhost URLs with production URLs
    if (trimmedFile.includes('localhost:3000') || trimmedFile.includes('localhost:8000') || trimmedFile.includes('localhost')) {
      // Extract the path after localhost:port
      const pathMatch = trimmedFile.match(/https?:\/\/localhost(?::\d+)?(.+)/);
      if (pathMatch) {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || (import.meta.env.MODE === 'production' ? 'https://newapi.diziel.com' : 'http://localhost:8000');
        return `${backendUrl}${pathMatch[1]}`;
      }
    }
    // For other full URLs, use as is
    return trimmedFile;
  }

  // It's a relative path (e.g., "/storage/users/xxx.jpg")
  // BUT skip if it's a local asset (handled by Vite bundler)
  if (trimmedFile.startsWith('/assets/') || trimmedFile.includes('/assets/')) {
    return null;
  }

  // Get backend URL from env
  const backendUrl = import.meta.env.VITE_BACKEND_URL || (import.meta.env.MODE === 'production' ? 'https://newapi.diziel.com' : 'http://localhost:8000');
  
  // Remove trailing slash from backend URL if present
  const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
  
  // Ensure path starts with / if it doesn't already
  const path = trimmedFile.startsWith('/') ? trimmedFile : `/${trimmedFile}`;
  
  // For storage paths, don't add /api/v1 - storage files are served directly from backend root
  // Construct full URL (storage files are at root level, not under /api/v1)
  return `${cleanBackendUrl}${path}`;
};
