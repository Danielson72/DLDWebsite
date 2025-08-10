import { useState } from 'react';
import { User as UserIcon, LogOut, Settings, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { User } from '@supabase/supabase-js';

interface UserAvatarProps {
  user: User;
  onSignOut: () => void;
}

export function UserAvatar({ user, onSignOut }: UserAvatarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const getUserInitials = () => {
    const email = user.email || '';
    return email.charAt(0).toUpperCase();
  };

  const getUserDisplayName = () => {
    return user.email?.split('@')[0] || 'User';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-green-300 hover:text-green-200 transition-colors"
      >
        <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center text-black font-bold">
          {getUserInitials()}
        </div>
        <span className="text-sm font-medium hidden xl:inline">
          {getUserDisplayName()}
        </span>
        <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-black/95 backdrop-blur-sm border border-green-500/30 rounded-lg shadow-lg py-2 z-50">
          <div className="px-4 py-2 border-b border-green-500/20">
            <p className="text-sm text-gray-300">Signed in as</p>
            <p className="text-sm font-medium text-amber-500 truncate">{user.email}</p>
          </div>
          
          <Link
            to="/dashboard"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
          >
            <UserIcon size={16} />
            Dashboard
          </Link>
          
          <Link
            to="/my-music"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-2 px-4 py-2 text-white hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
          >
            <Settings size={16} />
            My Music
          </Link>
          
          <div className="border-t border-green-500/20 mt-2 pt-2">
            <button
              onClick={() => {
                onSignOut();
                setIsOpen(false);
              }}
              className="flex items-center gap-2 w-full px-4 py-2 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}