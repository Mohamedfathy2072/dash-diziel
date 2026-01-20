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

  // If it's already a full URL (http/https), use it as is
  if (trimmedFile.startsWith('http://') || trimmedFile.startsWith('https://')) {
    return trimmedFile;
  }

  // It's a relative path (e.g., "/storage/users/xxx.jpg")
  // BUT skip if it's a local asset (handled by Vite bundler)
  if (trimmedFile.startsWith('/assets/') || trimmedFile.includes('/assets/')) {
    return null;
  }

  // Get backend URL from env and prepend it
  const backendUrl = 'https://newapi.diziel.com/api/v1';
  
  // Remove trailing slash from backend URL if present
  const cleanBackendUrl = backendUrl.endsWith('/') ? backendUrl.slice(0, -1) : backendUrl;
  
  // Ensure path starts with / if it doesn't already
  const path = trimmedFile.startsWith('/') ? trimmedFile : `/${trimmedFile}`;
  
  // If no backend URL is set, return null to avoid broken URLs
  if (!cleanBackendUrl || cleanBackendUrl.includes('localhost')) {
    console.warn('Backend URL not configured properly:', cleanBackendUrl);
    return null;
  }
  
  // Construct full URL
  return `${cleanBackendUrl}${path}`;
};
