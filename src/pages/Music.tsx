import { ChevronDown, Music as MusicIcon, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Track, Artist } from '../types/music';
import { DotEdgeSides } from '../components/music/DotEdgeSides';
import { AuthWrapper } from '../components/music/AuthWrapper';
import { TrackUploadModal } from '../components/music/TrackUploadModal';
import { TrackList } from '../components/music/TrackList';

export function Music() {
  const [selectedArtist, setSelectedArtist] = useState<Artist | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // Query tracks when artist changes or refresh is triggered
  useEffect(() => {
    if (!selectedArtist) return;
    
    const fetchTracks = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('music_tracks')
          .select('*')
          .eq('artist', selectedArtist)
          .order('created_at', { ascending: false });
        
        if (error) {
          console.error('Error fetching tracks:', error);
        } else {
          setTracks(data || []);
        }
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, [selectedArtist, refreshKey]);

  // Check for successful payment on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const trackId = urlParams.get('track');
    
    if (success === 'true' && trackId) {
      // Show success message with more details
      const successMessage = `🎉 Payment successful! Thank you for your purchase!\n\nYour download should begin shortly. If not, please check your email for download instructions.`;
      alert(successMessage);
      
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    if (urlParams.get('canceled') === 'true') {
      alert('Payment was canceled. You can try again anytime.');
      // Clean up URL
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const closePlayer = () => {
    setSelectedArtist(null);
    setTracks([]);
  };

  const handleTrackChange = () => {
    // Refresh the tracks for the currently selected artist
    setRefreshKey(prev => prev + 1);
  };

  const scrollToContent = () => {
    const contentSection = document.getElementById('music-content');
    contentSection?.scrollIntoView({ behavior: 'smooth' });
  };

  const artistButtons = [
    { id: 'DLD' as Artist, label: 'Daniel in the Lion\'s Den' },
    { id: 'The Tru Witnesses' as Artist, label: 'The Tru Witnesses' },
    { id: 'Waves From IAM' as Artist, label: 'Waves From IAM' },
  ];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative w-full h-screen overflow-hidden">
        {/* Hero background */}
        <div 
          className="absolute inset-0 bg-center bg-contain bg-no-repeat"
          style={{ backgroundImage: "url('/ChatGPT Image Jun 6, 2025, 10_19_50 PM (1).png')" }}
        />

        {/* Green-dot edge panels */}
        <DotEdgeSides />

        {/* Artist Selection Buttons */}
        <div className="absolute bottom-6 inset-x-0 flex justify-center gap-4 z-30 px-4">
          {artistButtons.map((btn) => (
            <button
              key={btn.id}
              onClick={() => setSelectedArtist(btn.id)}
              className={`px-4 py-2 font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 ${
                selectedArtist === btn.id
                  ? 'bg-yellow-600 text-black ring-2 ring-yellow-300 scale-105'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-black'
              }`}
            >
              {btn.label}
            </button>
          ))}
        </div>
        
        {/* Scroll Indicator */}
        <button
          onClick={scrollToContent}
          className="absolute bottom-20 left-1/2 -translate-x-1/2 text-amber-500 hover:text-amber-400 transition-colors animate-bounce z-10"
        >
          <ChevronDown size={32} />
        </button>
      </section>

      {/* Music Player Panel */}
      {selectedArtist && (
        <div
          className="fixed inset-0 flex items-center justify-center z-40 bg-black/50 backdrop-blur-sm"
          onClick={closePlayer}
        >
          <div
            className="relative w-11/12 md:w-4/5 lg:w-3/4 max-h-[80vh] overflow-y-auto rounded-xl backdrop-blur-md bg-white/5 p-8 border border-yellow-400/20 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closePlayer}
              className="absolute top-3 right-3 text-yellow-300 hover:text-yellow-100 text-2xl font-bold w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/30 transition-colors"
            >
              ×
            </button>

            {/* Header */}
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-yellow-300 mb-2">
                {artistButtons.find(a => a.id === selectedArtist)?.label}
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-yellow-400 to-green-400 rounded"></div>
            </div>

            {/* Auth Wrapper */}
            <AuthWrapper>
              {(user) => (
                <>
                  {/* Upload Button for Authenticated Users */}
                  {user && (
                    <div className="mb-6">
                      <button
                        onClick={() => setShowUploadModal(true)}
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-medium rounded-lg transition-colors"
                      >
                        <Plus size={16} />
                        Add New Track
                      </button>
                    </div>
                  )}

                  {/* Loading State */}
                  {loading ? (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
                      <p className="text-yellow-200">Loading tracks...</p>
                    </div>
                  ) : (
                    <TrackList 
                      tracks={tracks} 
                      user={user}
                      onTrackDeleted={handleTrackChange}
                    />
                  )}

                  {/* Upload Modal */}
                  {user && (
                    <TrackUploadModal
                      user={user}
                      isOpen={showUploadModal}
                      onClose={() => setShowUploadModal(false)}
                      onSuccess={handleTrackChange}
                    />
                  )}
                </>
              )}
            </AuthWrapper>
          </div>
        </div>
      )}

      {/* Content Section */}
      <div id="music-content" className="relative bg-gradient-to-b from-green-900/20 to-black pb-0">
        <div className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="flex justify-center mb-6">
              <MusicIcon size={48} className="text-amber-500" />
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-500 mb-6">
              Daniel in the Lion's Den Music
            </h1>
            <p className="text-xl text-emerald-400 max-w-2xl mx-auto mb-8">
              Support the mission by purchasing original Kingdom music crafted by Daniel in the Lion's Den.
            </p>
            
            {/* Payment Security Notice */}
            <div className="bg-black/40 border border-green-500/30 rounded-lg p-4 max-w-md mx-auto">
              <p className="text-sm text-green-300">
                🔒 Secure payments powered by Stripe
              </p>
              <p className="text-xs text-gray-400 mt-1">
                All transactions are encrypted and secure
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}