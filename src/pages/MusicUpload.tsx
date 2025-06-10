import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Upload, Music, AlertCircle, CheckCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Artist } from '../types/music';
import { PageHero } from '../components/PageHero';

interface UploadForm {
  artist: Artist;
  title: string;
  description: string;
  price: string;
  fullFile: File | null;
  previewFile: File | null;
  coverFile: File | null;
}

export function MusicUpload() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);
  
  const [form, setForm] = useState<UploadForm>({
    artist: 'DLD',
    title: '',
    description: '',
    price: '',
    fullFile: null,
    previewFile: null,
    coverFile: null,
  });

  // Check authentication and admin status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Check if user is admin
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;

  const handleInputChange = (field: keyof UploadForm, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setStatus(null);
  };

  const validateForm = (): string | null => {
    if (!form.title.trim()) return 'Title is required';
    if (!form.price || isNaN(parseFloat(form.price)) || parseFloat(form.price) <= 0) {
      return 'Valid price is required';
    }
    if (!form.fullFile) return 'Full audio file is required';
    if (!form.previewFile) return 'Preview audio file is required';
    
    // Validate file types
    const audioTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3'];
    const imageTypes = ['image/jpeg', 'image/png', 'image/webp'];
    
    if (!audioTypes.includes(form.fullFile.type)) {
      return 'Full audio file must be MP3 or WAV';
    }
    if (!audioTypes.includes(form.previewFile.type)) {
      return 'Preview audio file must be MP3 or WAV';
    }
    if (form.coverFile && !imageTypes.includes(form.coverFile.type)) {
      return 'Cover image must be JPEG, PNG, or WebP';
    }

    return null;
  };

  const uploadFile = async (file: File, bucket: string, folder: string): Promise<string> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(fileName, file);

    if (error) throw error;

    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return publicUrl;
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      setStatus({ type: 'error', message: validationError });
      return;
    }

    setUploading(true);
    setStatus({ type: 'info', message: 'Uploading files...' });

    try {
      // Upload files to storage
      const [fullAudioUrl, previewAudioUrl, coverUrl] = await Promise.all([
        uploadFile(form.fullFile!, 'music', 'full'),
        uploadFile(form.previewFile!, 'music', 'preview'),
        form.coverFile ? uploadFile(form.coverFile, 'music', 'covers') : Promise.resolve(null),
      ]);

      setStatus({ type: 'info', message: 'Saving track information...' });

      // Insert track record
      const { error: dbError } = await supabase
        .from('music_tracks')
        .insert({
          artist: form.artist,
          title: form.title.trim(),
          description: form.description.trim() || null,
          price_cents: Math.round(parseFloat(form.price) * 100),
          audio_full: fullAudioUrl,
          audio_preview: previewAudioUrl,
          cover_url: coverUrl,
        });

      if (dbError) throw dbError;

      setStatus({ type: 'success', message: '✅ Track uploaded successfully!' });
      
      // Reset form
      setForm({
        artist: 'DLD',
        title: '',
        description: '',
        price: '',
        fullFile: null,
        previewFile: null,
        coverFile: null,
      });

      // Reset file inputs
      const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>;
      fileInputs.forEach(input => input.value = '');

    } catch (error: any) {
      console.error('Upload error:', error);
      setStatus({ type: 'error', message: error.message || 'Upload failed' });
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/music" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <AlertCircle size={64} className="text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-red-500 mb-2">Access Denied</h1>
          <p className="text-gray-300">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <PageHero title="Upload Music Track" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-xl p-8">
          <div className="flex items-center gap-3 mb-8">
            <Upload size={32} className="text-amber-500" />
            <h1 className="text-3xl font-bold text-amber-500">Upload New Track</h1>
          </div>

          {status && (
            <div className={`mb-6 p-4 rounded-lg border flex items-center gap-3 ${
              status.type === 'success' ? 'bg-green-900/20 border-green-500/30 text-green-300' :
              status.type === 'error' ? 'bg-red-900/20 border-red-500/30 text-red-300' :
              'bg-blue-900/20 border-blue-500/30 text-blue-300'
            }`}>
              {status.type === 'success' ? <CheckCircle size={20} /> :
               status.type === 'error' ? <AlertCircle size={20} /> :
               <Music size={20} />}
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleUpload} className="space-y-6">
            {/* Artist Selection */}
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                Artist
              </label>
              <select
                value={form.artist}
                onChange={(e) => handleInputChange('artist', e.target.value as Artist)}
                className="w-full p-3 bg-black/40 border border-green-500/30 rounded-lg text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="DLD">Daniel in the Lion's Den</option>
                <option value="True Witnesses">The Tru Witnesses</option>
                <option value="Project 3">Project 3</option>
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                Track Title *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter track title"
                className="w-full p-3 bg-black/40 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Enter track description (optional)"
                rows={3}
                className="w-full p-3 bg-black/40 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none resize-none"
              />
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                Price (USD) *
              </label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={form.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="e.g. 1.99"
                className="w-full p-3 bg-black/40 border border-green-500/30 rounded-lg text-white placeholder-gray-400 focus:border-amber-500 focus:outline-none"
                required
              />
            </div>

            {/* File Uploads */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Full Track */}
              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">
                  Full Track (MP3/WAV) *
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleInputChange('fullFile', e.target.files?.[0] || null)}
                  className="w-full p-3 bg-black/40 border border-green-500/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-black file:font-medium hover:file:bg-amber-600"
                  required
                />
              </div>

              {/* Preview Track */}
              <div>
                <label className="block text-sm font-medium text-amber-500 mb-2">
                  Preview (30-60 sec) *
                </label>
                <input
                  type="file"
                  accept="audio/*"
                  onChange={(e) => handleInputChange('previewFile', e.target.files?.[0] || null)}
                  className="w-full p-3 bg-black/40 border border-green-500/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-black file:font-medium hover:file:bg-amber-600"
                  required
                />
              </div>
            </div>

            {/* Cover Image */}
            <div>
              <label className="block text-sm font-medium text-amber-500 mb-2">
                Cover Image (Optional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleInputChange('coverFile', e.target.files?.[0] || null)}
                className="w-full p-3 bg-black/40 border border-green-500/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-amber-500 file:text-black file:font-medium hover:file:bg-amber-600"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-amber-500 hover:bg-amber-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-black font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={20} />
                    Upload Track
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}