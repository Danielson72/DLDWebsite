import { useState } from 'react';
import { Upload, X, AlertCircle, CheckCircle } from 'lucide-react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../../lib/supabase';
import { Artist } from '../../types/music';

interface TrackUploadModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface UploadForm {
  title: string;
  artist: Artist;
  description: string;
  price: string;
  audioFile: File | null;
  coverFile: File | null;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const HARDCODED_STRIPE_PRICE_ID = 'price_1MlFZQGKbDbFMYBRKOBe8Kf4'; // $0.99 price

export function TrackUploadModal({ user, isOpen, onClose, onSuccess }: TrackUploadModalProps) {
  const [form, setForm] = useState<UploadForm>({
    title: '',
    artist: 'DLD',
    description: '',
    price: '0.99',
    audioFile: null,
    coverFile: null,
  });
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  const resetForm = () => {
    setForm({
      title: '',
      artist: 'DLD',
      description: '',
      price: '0.99',
      audioFile: null,
      coverFile: null,
    });
    setStatus(null);
    // Reset file inputs
    const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
    fileInputs.forEach(input => input.value = '');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const validateForm = (): string | null => {
    if (!form.title.trim()) return 'Title is required';
    if (!form.audioFile) return 'Audio file is required';
    if (form.audioFile.size > MAX_FILE_SIZE) {
      return `Audio file size (${formatFileSize(form.audioFile.size)}) exceeds maximum of ${formatFileSize(MAX_FILE_SIZE)}`;
    }
    if (form.coverFile && form.coverFile.size > MAX_FILE_SIZE) {
      return `Cover image size (${formatFileSize(form.coverFile.size)}) exceeds maximum of ${formatFileSize(MAX_FILE_SIZE)}`;
    }
    const price = parseFloat(form.price);
    if (isNaN(price) || price <= 0) return 'Valid price is required';
    return null;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const uploadFile = async (file: File, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('music')
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from('music')
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const generatePreview = async (trackId: string) => {
    try {
      setStatus({ type: 'info', message: 'Generating 30-second preview...' });

      const { data, error } = await supabase.functions.invoke('make-preview', {
        body: { trackId }
      });

      if (error) {
        console.warn('Preview generation failed:', error);
        // Don't fail the upload for preview generation errors
        setStatus({ type: 'info', message: 'Track uploaded successfully. Preview generation in progress...' });
      } else {
        console.log('Preview generated:', data);
        setStatus({ type: 'success', message: '✅ Track uploaded with 30-second preview!' });
      }
    } catch (error) {
      console.warn('Preview generation error:', error);
      // Don't fail the upload for preview generation errors
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setStatus({ type: 'error', message: validationError });
      return;
    }

    setUploading(true);
    setStatus({ type: 'info', message: 'Uploading files...' });

    try {
      // Upload files
      const audioUrl = await uploadFile(form.audioFile!, 'tracks');
      const coverUrl = form.coverFile ? await uploadFile(form.coverFile, 'covers') : null;

      setStatus({ type: 'info', message: 'Saving track information...' });

      // Insert track record with hardcoded Stripe Price ID and is_active = true
      const { data: insertedTrack, error: dbError } = await supabase
        .from('music_tracks')
        .insert({
          title: form.title.trim(),
          artist: form.artist,
          description: form.description.trim() || null,
          price_cents: Math.round(parseFloat(form.price) * 100),
          stripe_price_id: HARDCODED_STRIPE_PRICE_ID, // Hardcoded Stripe price ID
          audio_full: audioUrl,
          audio_preview: audioUrl, // Using same file for preview
          cover_url: coverUrl,
          cover_image_url: coverUrl, // Use the same image for both fields
          user_id: user.id,
          is_active: true, // Explicitly set to true
        })
        .select()
        .single();

      if (dbError) throw dbError;

      // Generate preview clip after successful upload
      if (insertedTrack) {
        await generatePreview(insertedTrack.id);
      }

      setTimeout(() => {
        onSuccess();
        handleClose();
      }, 1500);

    } catch (error: any) {
      console.error('Upload error:', error);
      setStatus({ type: 'error', message: `Upload failed: ${error.message}` });
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-black/90 border border-green-500/30 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Upload size={24} className="text-amber-500" />
              <h2 className="text-xl font-bold text-amber-500">Upload New Track</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Status Message */}
          {status && (
            <div className={`mb-4 p-3 rounded flex items-center gap-2 ${
              status.type === 'success' 
                ? 'bg-green-900/20 text-green-300 border border-green-500/30' 
                : status.type === 'error'
                ? 'bg-red-900/20 text-red-300 border border-red-500/30'
                : 'bg-blue-900/20 text-blue-300 border border-blue-500/30'
            }`}>
              {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
              {status.message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Artist */}
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-1">Artist</label>
              <select
                value={form.artist}
                onChange={(e) => setForm(prev => ({ ...prev, artist: e.target.value as Artist }))}
                className="w-full p-2 bg-black/60 border border-green-500/30 rounded text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="DLD">Daniel in the Lion's Den</option>
                <option value="The Tru Witnesses">The Tru Witnesses</option>
                <option value="Waves From IAM">Waves From IAM</option>
              </select>
            </div>

            {/* Title */}
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

            {/* Description */}
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

            {/* Price (for display only) */}
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-1">
                Display Price (USD) *
                <span className="text-xs text-gray-400 ml-2">(automatically set to $0.99)</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.price}
                onChange={(e) => setForm(prev => ({ ...prev, price: e.target.value }))}
                placeholder="0.99"
                className="w-full p-2 bg-black/60 border border-green-500/30 rounded text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none"
                required
              />
              <div className="mt-1 p-2 bg-green-900/20 border border-green-500/30 rounded text-xs text-green-200">
                <p>💡 All tracks are automatically configured with Stripe payment processing at $0.99</p>
                <p>🎵 30-second preview clips will be generated automatically after upload</p>
              </div>
            </div>

            {/* Audio File */}
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-1">
                Audio File * <span className="text-xs text-gray-400">(Max: {formatFileSize(MAX_FILE_SIZE)})</span>
              </label>
              <input
                type="file"
                accept=".mp3,.wav,.m4a,.aac,.ogg,.flac"
                onChange={(e) => setForm(prev => ({ ...prev, audioFile: e.target.files?.[0] || null }))}
                className="w-full p-2 bg-black/60 border border-green-500/30 rounded text-white file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-amber-500 file:text-black file:text-sm hover:file:bg-amber-600"
                required
              />
              {form.audioFile && (
                <p className="text-xs text-green-300 mt-1">
                  Selected: {form.audioFile.name} ({formatFileSize(form.audioFile.size)})
                </p>
              )}
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-1">
                Cover Artwork * <span className="text-xs text-gray-400">(Custom artwork for this track)</span>
              </label>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.webp,.gif"
                onChange={(e) => setForm(prev => ({ ...prev, coverFile: e.target.files?.[0] || null }))}
                className="w-full p-2 bg-black/60 border border-green-500/30 rounded text-white file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:bg-amber-500 file:text-black file:text-sm hover:file:bg-amber-600"
                required
              />
              {form.coverFile && (
                <p className="text-xs text-green-300 mt-1">
                  Selected: {form.coverFile.name} ({formatFileSize(form.coverFile.size)})
                </p>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="flex-1 bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-medium py-2 px-4 rounded transition-colors flex items-center justify-center gap-2"
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
              <button
                type="button"
                onClick={handleClose}
                className="px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}