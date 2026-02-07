'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface UploadPostProps {
  onSuccess: () => void;
}

export default function UploadPost({ onSuccess }: UploadPostProps) {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        showToast('File size must be less than 5MB', 'error');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!user) {
      showToast('Please log in to upload a post', 'error');
      return;
    }

    if (!file) {
      showToast('Please select an image', 'error');
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('caption', caption);
      formData.append('userName', user.name);

      const response = await fetch('/api/community', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload post');
      }

      showToast('Post uploaded successfully!', 'success');
      setFile(null);
      setCaption('');
      setPreview(null);
      onSuccess();
    } catch (error) {
      console.error('Error uploading post:', error);
      showToast('Failed to upload post. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  }

  if (!user) {
    return (
      <div className="bg-background-surface rounded-card border border-border p-8 text-center">
        <p className="text-text-secondary mb-4">
          Please log in to share your Drop Fit photos
        </p>
        <a
          href="/auth/login"
          className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-bold hover:bg-primary-dark transition-colors"
        >
          Log In
        </a>
      </div>
    );
  }

  return (
    <div className="bg-background-surface rounded-card border border-border p-6">
      <h3 className="text-xl font-bold text-text-primary mb-4">
        Share Your Fit
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-2">
            Upload Photo
          </label>
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            onChange={handleFileChange}
            className="block w-full text-sm text-text-secondary
              file:mr-4 file:py-2 file:px-4
              file:rounded-lg file:border-0
              file:text-sm file:font-semibold
              file:bg-primary file:text-white
              file:cursor-pointer
              hover:file:bg-primary-dark"
          />
        </div>

        {/* Preview */}
        {preview && (
          <div className="relative w-full h-64 rounded-lg overflow-hidden">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Caption */}
        <Input
          type="text"
          placeholder="Add a caption (optional)"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          maxLength={200}
        />

        {/* Submit */}
        <Button type="submit" fullWidth disabled={!file || loading}>
          {loading ? 'Uploading...' : 'Upload Post'}
        </Button>
      </form>
    </div>
  );
}
