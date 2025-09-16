import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';
import { storageService } from '../../../services/storageService';
import { useAuth } from '../../../contexts/AuthContext';

const PhotoAttachment = ({ photos, onPhotosChange }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const { user } = useAuth();

  const uploadPhoto = async (file) => {
    if (!user?.id) return { error: new Error("User not authenticated.") };

    const fileExtension = file?.name?.split('.')?.pop();
    const fileName = `${Date.now()}-${Math.random()}.${fileExtension}`;
    const path = `${user.id}/${fileName}`;

    const { data, error } = await storageService.uploadFile(file, 'receipts', path);
    return { data, error };
  };

  const handleFileSelect = async (files) => {
    const newPhotos = Array.from(files)?.map(file => ({
      id: Date.now() + Math.random(), // Temporary ID
      file,
      url: URL.createObjectURL(file), // Temporary URL for preview
      name: file?.name,
      size: file?.size,
      status: 'uploading', // Add upload status
      storagePath: null, // To store the path in Supabase Storage
      publicUrl: null, // To store the public URL from Supabase
    }));
    
    onPhotosChange([...photos, ...newPhotos]);

    // Upload files one by one
    for (const photo of newPhotos) {
      const { data, error } = await uploadPhoto(photo.file);
      if (error) {
        console.error('Error uploading photo:', error);
        onPhotosChange(prevPhotos => prevPhotos.map(p => 
          p.id === photo.id ? { ...p, status: 'failed', error: error.message } : p
        ));
      } else {
        onPhotosChange(prevPhotos => prevPhotos.map(p => 
          p.id === photo.id ? { ...p, status: 'completed', storagePath: data.path, publicUrl: data.url } : p
        ));
      }
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files)?.filter(file => 
      file?.type?.startsWith('image/')
    );
    
    if (files?.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const removePhoto = async (photoId) => {
    const photoToRemove = photos?.find(photo => photo?.id === photoId);
    if (photoToRemove && photoToRemove.storagePath) {
      // Attempt to delete from storage if it was uploaded
      const { error } = await storageService.deleteFiles([photoToRemove.storagePath], 'receipts');
      if (error) {
        console.error('Error deleting photo from storage:', error);
        // Optionally, show an error to the user but still remove from UI
      }
    }
    const updatedPhotos = photos?.filter(photo => photo?.id !== photoId);
    onPhotosChange(updatedPhotos);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i))?.toFixed(2)) + ' ' + sizes?.[i];
  };

  return (
    <div className="space-y-4">
      <label className="text-sm font-medium text-foreground">
        Receipt Photos
      </label>
      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-6 transition-colors ${
          isDragOver
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
        }`}
      >
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
              <Icon name="Camera" size={24} className="text-muted-foreground" />
            </div>
          </div>
          
          <div className="space-y-2">
            <p className="text-foreground font-medium">
              Add receipt photos
            </p>
            <p className="text-sm text-muted-foreground">
              Drag and drop images here, or click to select
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('photo-input')?.click()}
            >
              <Icon name="Upload" size={16} className="mr-2" />
              Choose Files
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('camera-input')?.click()}
            >
              <Icon name="Camera" size={16} className="mr-2" />
              Take Photo
            </Button>
          </div>
        </div>
        
        <input
          id="photo-input"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => handleFileSelect(e?.target?.files)}
        />
        
        <input
          id="camera-input"
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => handleFileSelect(e?.target?.files)}
        />
      </div>
      {/* Photo Preview Grid */}
      {photos?.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">
            Attached Photos ({photos?.length})
          </h4>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {photos?.map((photo) => (
              <div key={photo?.id} className="relative group">
                <div className="aspect-square bg-muted rounded-lg overflow-hidden">
                  {photo.status === 'uploading' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                      <Icon name="Loader" className="animate-spin text-primary" size={24} />
                    </div>
                  )}
                  {photo.status === 'failed' && (
                    <div className="absolute inset-0 flex items-center justify-center bg-destructive/70 text-destructive-foreground text-center p-2">
                      <Icon name="AlertTriangle" size={24} className="mr-1" />
                      <span className="text-xs">Failed</span>
                    </div>
                  )}
                  <Image
                    src={photo?.url}
                    alt={photo?.name}
                    className={`w-full h-full object-cover ${photo.status === 'uploading' || photo.status === 'failed' ? 'opacity-50' : ''}`}
                  />
                </div>
                
                <button
                  type="button"
                  onClick={() => removePhoto(photo?.id)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-error text-error-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-soft"
                >
                  <Icon name="X" size={12} />
                </button>
                
                <div className="mt-2 space-y-1">
                  <p className="text-xs text-foreground font-medium truncate">
                    {photo?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatFileSize(photo?.size)}
                  </p>
                  {photo.status === 'uploading' && (
                    <p className="text-xs text-primary">Uploading...</p>
                  )}
                  {photo.status === 'failed' && (
                    <p className="text-xs text-error">Upload Failed: {photo.error}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoAttachment;