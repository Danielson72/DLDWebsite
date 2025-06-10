import { Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Track } from '../../types/music';
import { useState, useEffect } from 'react';

interface DeleteTrackProps {
  track: Track;
  onDeleted?: () => void;
}

export function DeleteTrack({ track, onDeleted }: DeleteTrackProps) {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

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

  // Show delete button only in development or for admin users
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;
  const showDelete = (import.meta.env.DEV || isAdmin) && user;

  // Don't render if not authenticated or not authorized
  if (loading || !showDelete) {
    return null;
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${track.title}" permanently?`)) return;

    try {
      // 1) Remove storage objects if they exist
      const deletePromises = [];
      
      if (track.audio_full) {
        // Extract filename from full URL path
        const pathParts = track.audio_full.split('/my-music/');
        if (pathParts.length === 2) {
          const fileKey = decodeURIComponent(pathParts[1]);
          deletePromises.push(
            supabase.storage.from('my-music').remove([fileKey])
          );
        }
      }
      
      if (track.audio_preview && track.audio_preview !== track.audio_full) {
        const pathParts = track.audio_preview.split('/my-music/');
        if (pathParts.length === 2) {
          const fileKey = decodeURIComponent(pathParts[1]);
          deletePromises.push(
            supabase.storage.from('my-music').remove([fileKey])
          );
        }
      }
      
      if (track.cover_url) {
        const pathParts = track.cover_url.split('/my-music/');
        if (pathParts.length === 2) {
          const fileKey = decodeURIComponent(pathParts[1]);
          deletePromises.push(
            supabase.storage.from('my-music').remove([fileKey])
          );
        }
      }

      // Execute storage deletions (ignore errors for missing files)
      await Promise.allSettled(deletePromises);

      // 2) Delete database record
      const { error } = await supabase
        .from('music_tracks')
        .delete()
        .eq('id', track.id);

      if (error) {
        throw error;
      }

      // Call callback to refresh the track list
      if (onDeleted) {
        onDeleted();
      }

    } catch (error: any) {
      console.error('Delete error:', error);
      alert(`Failed to delete track: ${error.message}`);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="ml-2 p-1 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
      title="Delete track"
    >
      <Trash2 size={14} />
    </button>
  );
}