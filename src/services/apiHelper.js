/**
 * Handles common network/fetch errors from Supabase.
 * @param {Error} error - The error object.
 * @returns {{success: false, error: string}|null} - An error object or null if it's not a network error.
 */
const handleNetworkError = (error) => {
  if (error?.message?.includes('Failed to fetch') ||
      error?.message?.includes('NetworkError') ||
      error?.message?.includes('AuthRetryableFetchError') ||
      (error?.name === 'TypeError' && error?.message?.includes('fetch'))) {
    return {
      success: false,
      error: 'Cannot connect to the server. Your Supabase project may be paused or there might be a network issue. Please check your Supabase dashboard and internet connection.'
    };
  }
  return null;
};

/**
 * A wrapper for Supabase requests to handle loading, data, and errors consistently.
 * @param {Promise} request - The Supabase query promise (e.g., supabase.from(...).select(...)).
 * @param {string} failureMessage - The generic failure message for non-network errors.
 * @returns {Promise<{success: boolean, data?: any, error?: string}>}
 */
export const handleSupabaseRequest = async (request, failureMessage) => {
  try {
    const { data, error } = await request;
    if (error) {
      return handleNetworkError(error) || { success: false, error: error.message };
    }
    // For delete() or signOut() which returns { data: null, error: null } on success
    // we can return a generic success object.
    return { success: true, data: data === null ? true : data };
  } catch (error) {
    return handleNetworkError(error) || { success: false, error: failureMessage };
  }
};