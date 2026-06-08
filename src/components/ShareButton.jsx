import React, { useState } from 'react';
import { Share2 } from 'lucide-react';

export default function ShareButton() {
  const [showToast, setShowToast] = useState(false);

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2500);
    } catch (err) {
      console.error("Failed to copy URL:", err);
    }
  };

  return (
    <>
      <button 
        onClick={handleShare}
        className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-600 text-sm font-medium transition-colors shadow-sm active:scale-95"
      >
        <Share2 className="w-4 h-4" />
        Share Search
      </button>

      <div className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-5 py-3 rounded-full text-sm font-semibold shadow-xl transition-all duration-300 pointer-events-none ${showToast ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        🔗 Search link copied!
      </div>
    </>
  );
}
