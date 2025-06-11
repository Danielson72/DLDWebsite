import { useState, useEffect } from 'react';
import { Upload, AlertCircle, CheckCircle, Music } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Artist } from '../../types/music';
import type { User } from '@supabase/supabase-js';

interface UploadSongProps {
  onUploaded?: () => void;
}

interface UploadForm {
  title: string;
  artist: Artist;
  description: string;
  price: string;
  file: File | null;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50 MB in bytes

export function UploadSong({ onUploaded }: UploadSongProps) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [form, setForm] = useState<UploadForm>({
    title: '',
    artist: 'DLD',
    description: '',
    price: '0.99',
    file: null,
  });

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  // Show upload component only in development or for admin users
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;
  const showUpload = (import.meta.env.DEV || isAdmin) && user;

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.file || !form.title.trim()) {
      setStatus({ type: 'error', message: 'Please provide a file and title' });
      return;
    }

    if (!user) {
      setStatus({ type: 'error', message: 'You must be logged in to upload files' });
      return;
    }

    if (form.file.size > MAX_FILE_SIZE) {
      setStatus({ 
        type: 'error', 
        message: `File size (${formatFileSize(form.file.size)}) exceeds the maximum allowed size of ${formatFileSize(MAX_FILE_SIZE)}. Please choose a smaller file.` 
      });
      return;
    }

    setUploading(true);
    setStatus(null);

    try {
      // Upload file to storage with proper user folder structure
      const fileExt = form.file.name.split('.').pop();
      const fileName = `tracks/${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('my-music')
        .upload(fileName, form.file, { 
          upsert: true,
          metadata: {
            owner: user.id,
            originalName: form.file.name
          }
        });

      if (uploadError) {
        console.error('Storage upload error:', uploadError);
        throw new Error(`Upload failed: ${uploadError.message}`);
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('my-music')
        .getPublicUrl(uploadData.path);

      // Insert track record into database with user ownership
      const { error: dbError } = await supabase
        .from('music_tracks')
        .insert({
          title: form.title.trim(),
          artist: form.artist,
          description: form.description.trim() || null,
          price_cents: Math.round(parseFloat(form.price) * 100),
          audio_full: publicUrl,
          audio_preview: publicUrl, // Using same file for preview
          user_id: user.id, // Set ownership
        });

      if (dbError) {
        console.error('Database insert error:', dbError);
        // If database insert fails, clean up the uploaded file
        await supabase.storage.from('my-music').remove([fileName]);
        throw new Error(`Database error: ${dbError.message}`);
      }

      setStatus({ type: 'success', message: `✅ Successfully uploaded "${form.title}"` });
      
      // Reset form
      setForm({
        title: '',
        artist: 'DLD',
        description: '',
        price: '0.99',
        file: null,
      });
      
      // Reset file input
      const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      
      // Call callback to refresh tracks
      if (onUploaded) {
        onUploaded();
      }

      // Hide form after successful upload
      setTimeout(() => setShowForm(false), 2000);

    } catch (error: any) {
      console.error('Upload error:', error);
      setStatus({ type: 'error', message: `❌ Upload failed: ${error.message}` });
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        setStatus({ 
          type: 'error', 
          message: `Selected file (${formatFileSize(file.size)}) exceeds the maximum allowed size of ${formatFileSize(MAX_FILE_SIZE)}. Please choose a smaller file.` 
        });
        e.target.value = '';
        return;
      }
      
      setForm(prev => ({ ...prev, file }));
      setStatus(null);
      
      // Auto-fill title from filename if empty
      if (!form.title) {
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, '');
        setForm(prev => ({ ...prev, title: nameWithoutExt }));
      }
    }
  };

  // Don't render anything if not authorized
  if (!showUpload) {
    return null;
  }

  if (loading) {
    return (
      <div className="bg-black/40 p-4 rounded-lg border border-green-500/30 mb-6">
        <div className="flex items-center gap-2 text-gray-400">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-amber-500"></div>
          Loading...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-black/40 p-4 rounded-lg border border-red-500/30 mb-6">
        <div className="flex items-center gap-2 text-red-400">
          <AlertCircle size={16} />
          You must be logged in to upload music tracks.
        </div>
      </div>
    );
  }

  if (!showForm) {
    return (
      <div className="bg-black/40 p-4 rounded-lg border border-green-500/30 mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg transition-colors"
        >
          <Music size={16} />
          Add New Track
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black/40 p-6 rounded-lg border border-green-500/30 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Upload size={20} className="text-amber-500" />
          <h3 className="text-lg font-semibold text-amber-500">Upload New Track</h3>
        </div>
        <button
          onClick={() => setShowForm(false)}
          className="text-gray-400 hover:text-white text-xl"
        >
          ×
        </button>
      </div>
      
      {status && (
        <div className={`mb-4 p-3 rounded flex items-center gap-2 text-sm ${
          status.type === 'success' 
            ? 'bg-green-900/20 text-green-300 border border-green-500/30' 
            : 'bg-red-900/20 text-red-300 border border-red-500/30'
        }`}>
          {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-amber-500 mb-1">Artist</label>
          <select
            value={form.artist}
            onChange={(e) => setForm(prev => ({ ...prev, artist: e.target.value as Artist }))}
            className="w-full p-2 bg-black/60 border border-green-500/30 rounded text-white focus:border-amber-500 focus:outline-none"
          >
            <option value="DLD">Daniel in the Lion's Den</option>
            <option value="True Witnesses">The Tru Witnesses</option>
            <option value="Project 3">Project 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-500 mb-1">Track Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            placeholder="Enter track title"
            className="w-full p-2 bg-black/60 border border-green-500/30 rounded text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-500 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Optional description"
            rows={2}
            className="w-full p-2 bg-black/60 border border-green-500/30 rounded text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-500 mb-1">Price (USD)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.price}
            onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
            placeholder="0.99"
            className="w-full p-2 bg-black/60 border border-green-500/30 rounded text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-amber-500 mb-1">
            Audio File * <span className="text-xs text-gray-400">(Max: {formatFileSize(MAX_FILE_SIZE)})</span>
          </label>
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileChange}
            className="w-full p-2 bg-black/60 border border-green-500/30 rounded text-white file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-amber-500 file:text-black file:text-sm hover:file:bg-amber-600"
            required
          />
          {form.file && (
            <p className="text-xs text-green-300 mt-1">
              Selected: {form.file.name} ({formatFileSize(form.file.size)})
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={uploading || !form.file || !form.title.trim()}
          className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
        >
          {uploading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
              Uploading...
            </>
          ) : (
            <>
              <Upload size={16} />
              Upload Track
            </>
          )}
        </button>
      </form>
    </div>
  );
}