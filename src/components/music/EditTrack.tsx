import { Edit2, Check, X } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Track } from '../../types/music';

interface EditTrackProps {
  track: Track;
  user: any;
  onUpdated?: () => void;
}

export function EditTrack({ track, user, onUpdated }: EditTrackProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editForm, setEditForm] = useState({
    title: track.title,
    description: track.description || '',
    price_cents: track.price_cents,
  });

  // Only show in Bolt development environment
  if (!import.meta.env.VITE_BOLT_NEW) {
    return null;
  }

  // Show edit button only for authenticated users who own the track or are admin
  const isAdmin = user?.email === import.meta.env.VITE_ADMIN_EMAIL;
  const isOwner = user && track.user_id === user.id;
  const canEdit = user && (isOwner || isAdmin || import.meta.env.DEV);

  if (!canEdit) {
    return null;
  }

  const handleSave = async () => {
    if (!editForm.title.trim()) {
      alert('Title cannot be empty');
      return;
    }

    setSaving(true);

    try {
      // Use service role function to update track (bypassing RLS)
      const { error } = await supabase.functions.invoke('admin-update-track', {
        body: {
          trackId: track.id,
          title: editForm.title.trim(),
          description: editForm.description.trim() || null,
          price_cents: editForm.price_cents,
        }
      });

      if (error) {
        throw error;
      }

      setIsEditing(false);
      if (onUpdated) {
        onUpdated();
      }
    } catch (error: any) {
      console.error('Update error:', error);
      alert(`Failed to update track: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditForm({
      title: track.title,
      description: track.description || '',
      price_cents: track.price_cents,
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={editForm.title}
            onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
            className="flex-1 px-2 py-1 bg-black/60 border border-green-500/30 rounded text-yellow-300 text-sm focus:border-amber-500 focus:outline-none"
            placeholder="Track title"
          />
          <input
            type="number"
            step="0.01"
            min="0"
            value={(editForm.price_cents / 100).toFixed(2)}
            onChange={(e) => setEditForm(prev => ({ ...prev, price_cents: Math.round(parseFloat(e.target.value || '0') * 100) }))}
            className="w-20 px-2 py-1 bg-black/60 border border-green-500/30 rounded text-green-200 text-sm focus:border-amber-500 focus:outline-none"
            placeholder="Price"
          />
        </div>
        <textarea
          value={editForm.description}
          onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-2 py-1 bg-black/60 border border-green-500/30 rounded text-green-200/80 text-sm focus:border-amber-500 focus:outline-none resize-none"
          rows={2}
          placeholder="Description (optional)"
        />
        <div className="flex items-center gap-1">
          <button
            onClick={handleSave}
            disabled={saving}
            className="p-1 bg-green-600 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed text-white rounded transition-colors"
            title="Save changes"
          >
            {saving ? (
              <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
            ) : (
              <Check size={14} />
            )}
          </button>
          <button
            onClick={handleCancel}
            disabled={saving}
            className="p-1 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded transition-colors"
            title="Cancel editing"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setIsEditing(true)}
      className="ml-2 p-1 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
      title={`Edit track${isOwner ? ' (you own this)' : isAdmin ? ' (admin)' : ''}`}
    >
      <Edit2 size={14} />
    </button>
  );
}