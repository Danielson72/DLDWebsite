import { ChevronDown, Music as MusicIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Track, Artist } from '../types/music';
import { DotEdgeSides } from '../components/music/DotEdgeSides';
import { AuthWrapper } from '../components/music/AuthWrapper';
import { PurchasableTrackList } from '../components/music/PurchasableTrackList';

export function Music() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all active tracks
  useEffect(() => {
    fetchTracks();
  }, []);

  const fetchTracks = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('music_tracks')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      setTracks(data || []);
    } catch (err: any) {
      console.error('Error fetching tracks:', err);
      setError('Failed to load music tracks. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Check for successful payment on page load
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const success = urlParams.get('success');
    const sessionId = urlParams.get('session_id');
    
    if (success === 'true' && sessionId) {
      const successMessage = `🎉 Payment successful! Thank you for your purchase!\n\nYour music is now available in your library.`;
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

  // Group tracks by artist
  const groupedTracks = tracks.reduce((acc, track) => {
    if (!acc[track.artist]) {
      acc[track.artist] = [];
    }
    acc[track.artist].push(track);
    return acc;
  }, {} as Record<string, Track[]>);

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
              onClick={scrollToContent}
              className="px-4 py-2 font-bold rounded-lg shadow-lg transition-all transform hover:scale-105 bg-yellow-500 hover:bg-yellow-600 text-black"
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

      {/* Content Section */}
      <div id="music-content" className="relative bg-gradient-to-b from-green-900/20 to-black">
        <div className="relative py-24 overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="flex justify-center mb-6">
                <MusicIcon size={48} className="text-amber-500" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-amber-500 mb-6">
                Daniel in the Lion's Den Music
              </h1>
              <p className="text-xl text-emerald-400 max-w-2xl mx-auto mb-8">
                Support the ministry by purchasing original Kingdom music. Each track is crafted with purpose and divine inspiration.
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

            {/* Music Tracks Section */}
            <AuthWrapper>
              {(user) => (
                <div>
                  {/* Loading State */}
                  {loading && (
                    <div className="text-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500 mx-auto mb-4"></div>
                      <p className="text-amber-500">Loading music tracks...</p>
                    </div>
                  )}

                  {/* Error State */}
                  {error && (
                    <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-6 text-center mb-8">
                      <p className="text-red-300 mb-4">{error}</p>
                      <button
                        onClick={fetchTracks}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  )}

                  {/* Tracks by Artist */}
                  {!loading && !error && (
                    <div className="space-y-12">
                      {/* DLD Tracks */}
                      {groupedTracks['DLD'] && groupedTracks['DLD'].length > 0 && (
                        <div>
                          <h2 className="text-3xl font-bold text-amber-500 mb-8">
                            Daniel in the Lion's Den Tracks
                          </h2>
                          <PurchasableTrackList 
                            tracks={groupedTracks['DLD']} 
                            user={user}
                            artist="DLD"
                          />
                        </div>
                      )}

                      {/* The Tru Witnesses Tracks */}
                      {groupedTracks['The Tru Witnesses'] && groupedTracks['The Tru Witnesses'].length > 0 && (
                        <div>
                          <h2 className="text-3xl font-bold text-amber-500 mb-8">
                            The Tru Witnesses Tracks
                          </h2>
                          <PurchasableTrackList 
                            tracks={groupedTracks['The Tru Witnesses']} 
                            user={user}
                            artist="The Tru Witnesses"
                          />
                        </div>
                      )}

                      {/* Waves From IAM Tracks */}
                      {groupedTracks['Waves From IAM'] && groupedTracks['Waves From IAM'].length > 0 && (
                        <div>
                          <h2 className="text-3xl font-bold text-amber-500 mb-8">
                            Waves From IAM Tracks
                          </h2>
                          <PurchasableTrackList 
                            tracks={groupedTracks['Waves From IAM']} 
                            user={user}
                            artist="Waves From IAM"
                          />
                        </div>
                      )}

                      {/* No Tracks Available */}
                      {Object.keys(groupedTracks).length === 0 && (
                        <div className="text-center py-16">
                          <MusicIcon size={64} className="text-gray-500 mx-auto mb-4" />
                          <h3 className="text-2xl font-bold text-gray-400 mb-4">No Music Available Yet</h3>
                          <p className="text-gray-500 mb-6">
                            We're working on adding music to our collection. Check back soon for powerful Kingdom tracks!
                          </p>
                          <button
                            onClick={fetchTracks}
                            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-lg transition-colors"
                          >
                            Refresh
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Features Section */}
                  {!loading && !error && Object.keys(groupedTracks).length > 0 && (
                    <div className="mt-16 bg-gradient-to-r from-amber-500/10 to-green-500/10 border border-amber-500/30 rounded-xl p-8">
                      <h3 className="text-2xl font-bold text-amber-500 mb-6 text-center">
                        What You Get With Every Purchase
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                          <div className="text-3xl mb-3">🎵</div>
                          <h4 className="text-lg font-bold text-amber-500 mb-2">High Quality Audio</h4>
                          <p className="text-gray-300 text-sm">
                            Premium quality audio files for the best listening experience
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl mb-3">📚</div>
                          <h4 className="text-lg font-bold text-amber-500 mb-2">Instant Access</h4>
                          <p className="text-gray-300 text-sm">
                            Download immediately and access anytime from your library
                          </p>
                        </div>
                        <div className="text-center">
                          <div className="text-3xl mb-3">❤️</div>
                          <h4 className="text-lg font-bold text-amber-500 mb-2">Support Ministry</h4>
                          <p className="text-gray-300 text-sm">
                            Every purchase directly supports our ministry and outreach programs
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </AuthWrapper>
          </div>
        </div>
      </div>
    </div>
  );
}
</invoke>