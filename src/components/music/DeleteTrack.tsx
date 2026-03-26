import { Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Track } from '../../types/music';

interface DeleteTrackProps {
  track: Track;
  onDeleted?: () => void;
}

export function DeleteTrack({ track, onDeleted }: DeleteTrackProps) {
  // Show delete button only in development or for admin users
  const isAdmin = import.meta.env.VITE_ADMIN_EMAIL && 
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      return user?.email === import.meta.env.VITE_ADMIN_EMAIL;
    })();
  
  const showDelete = import.meta.env.DEV || isAdmin;

  // Don't render if not in dev mode and not admin
  if (!showDelete) {
    return null;
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${track.title}" permanently?`)) return;

    try {
      // 1) Remove storage objects if they exist
      const deletePromises = [];
      
      if (track.audio_full) {
        // Extract filename from full URL path
        const pathParts = track.audio_full.split('/music/');
        if (pathParts.length === 2) {
          const fileKey = decodeURIComponent(pathParts[1]);
          deletePromises.push(
            supabase.storage.from('music').remove([fileKey])
          );
        }
      }
      
      if (track.audio_preview && track.audio_preview !== track.audio_full) {
        const pathParts = track.audio_preview.split('/music/');
        if (pathParts.length === 2) {
          const fileKey = decodeURIComponent(pathParts[1]);
          deletePromises.push(
            supabase.storage.from('music').remove([fileKey])
          );
        }
      }
      
      if (track.cover_url) {
        const pathParts = track.cover_url.split('/music/');
        if (pathParts.length === 2) {
          const fileKey = decodeURIComponent(pathParts[1]);
          deletePromises.push(
            supabase.storage.from('music').remove([fileKey])
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