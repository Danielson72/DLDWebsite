import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, Download, Music, ArrowRight } from 'lucide-react';
import { PageHero } from '../components/PageHero';

export function Success() {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto mb-4"></div>
          <p className="text-amber-500 text-lg">Processing your purchase...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      <PageHero title="Purchase Successful!" />
      
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#00ff00_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        <div className="relative text-center">
          {/* Success Icon */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <CheckCircle size={80} className="text-green-500 filter drop-shadow-[0_0_20px_rgba(34,197,94,0.5)]" />
              <div className="absolute inset-0 animate-pulse bg-green-500/20 rounded-full blur-xl"></div>
            </div>
          </div>

          {/* Success Message */}
          <div className="bg-black/60 backdrop-blur-sm border border-green-500/30 rounded-xl p-8 mb-8">
            <h2 className="text-3xl font-bold text-amber-500 mb-4">
              🎉 Thank You for Your Purchase!
            </h2>
            <p className="text-xl text-green-300 mb-6">
              Your payment has been processed successfully. You now have access to your purchased music.
            </p>
            
            {sessionId && (
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-200">
                  <strong>Transaction ID:</strong> {sessionId}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
                <Download size={32} className="text-amber-500 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-amber-500 mb-2">Download Ready</h3>
                <p className="text-gray-300 text-sm">
                  Your music is ready for download in your library
                </p>
              </div>

              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                <Music size={32} className="text-green-500 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-green-500 mb-2">High Quality</h3>
                <p className="text-gray-300 text-sm">
                  Premium audio quality for the best listening experience
                </p>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <CheckCircle size={32} className="text-blue-500 mx-auto mb-2" />
                <h3 className="text-lg font-bold text-blue-500 mb-2">Lifetime Access</h3>
                <p className="text-gray-300 text-sm">
                  Re-download your music anytime from your library
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/library"
              className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-lg transition-colors transform hover:scale-105"
            >
              <Download size={20} />
              Go to My Library
            </Link>
            
            <Link
              to="/music"
              className="inline-flex items-center gap-2 bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-bold px-6 py-3 rounded-lg transition-colors"
            >
              <Music size={20} />
              Browse More Music
            </Link>
          </div>

          {/* Support Information */}
          <div className="mt-12 bg-black/40 border border-green-500/20 rounded-lg p-6">
            <h3 className="text-lg font-bold text-amber-500 mb-3">Need Help?</h3>
            <p className="text-gray-300 mb-4">
              If you have any issues with your download or need assistance, we're here to help.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-green-300 hover:text-green-200 font-medium transition-colors"
            >
              Contact Support
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}