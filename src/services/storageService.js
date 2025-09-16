import { supabase } from '../lib/supabase';

export const storageService = {
  /**
   * Uploads a file to a specified Supabase storage bucket.
   * @param {File} file The file to upload.
   * @param {string} bucketName The name of the storage bucket.
   * @param {string} path The path within the bucket (e.g., 'receipts/user_id/file_name.jpg').
   * @returns {Promise<{ data: { path: string, url: string } | null, error: Error | null }>}
   */
  async uploadFile(file, bucketName, path) {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(path, file, { cacheControl: '3600', upsert: false });

      if (error) {
        throw error;
      }

      const { data: publicUrlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(data.path);

      return { data: { path: data.path, url: publicUrlData.publicUrl }, error: null };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { data: null, error };
    }
  },

  /**
   * Deletes files from a specified Supabase storage bucket.
   * @param {string[]} paths An array of paths to the files within the bucket.
   * @param {string} bucketName The name of the storage bucket.
   * @returns {Promise<{ data: any | null, error: Error | null }>}
   */
  async deleteFiles(paths, bucketName) {
    try {
      const { data, error } = await supabase.storage
        .from(bucketName)
        .remove(paths);

      if (error) {
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error deleting files:', error);
      return { data: null, error };
    }
  },

  /**
   * Retrieves a public URL for a file in a specified Supabase storage bucket.
   * @param {string} bucketName The name of the storage bucket.
   * @param {string} path The path to the file within the bucket.
   * @returns {string}
   */
  getPublicUrl(bucketName, path) {
    const { data } = supabase.storage.from(bucketName).getPublicUrl(path);
    return data.publicUrl;
  },
};