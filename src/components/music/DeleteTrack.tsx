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
  const [deleting, setDeleting] = useState(false);

  // Only show in Bolt development environment
  if (!import.meta.env.VITE_BOLT_NEW) {
    return null;
  }

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

  // Show delete button only for authenticated users who own the track or are admin
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;
  const isOwner = user && track.user_id === user.id;
  const canDelete = user && (isOwner || isAdmin || import.meta.env.DEV);

  // Don't render if not authorized or still loading
  if (loading || !canDelete) {
    return null;
  }

  const handleDelete = async () => {
    if (!confirm(`Delete "${track.title}" permanently?`)) return;

    setDeleting(true);

    try {
      // Use service role function to delete track (bypassing RLS)
      const { error } = await supabase.functions.invoke('admin-delete-track', {
        body: { trackId: track.id }
      });

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
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="ml-2 p-1 bg-red-600 hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed text-white rounded transition-colors"
      title={`Delete track${isOwner ? ' (you own this)' : isAdmin ? ' (admin)' : ''}`}
    >
      {deleting ? (
        <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
      ) : (
        <Trash2 size={14} />
      )}
    </button>
  );
}