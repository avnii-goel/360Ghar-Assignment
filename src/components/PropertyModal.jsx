import React, { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, MapPin, Building2, Ruler, Compass, Grid, Dumbbell, BookOpen, Train, Sun, TreePine, Waves, ShieldCheck, Share2 } from 'lucide-react';
import { generatePropertySummary } from '../services/openrouter';

const AMENITY_ICONS = {
  gym: Dumbbell,
  school_nearby: BookOpen,
  metro: Train,
  sunlight: Sun,
  park: TreePine,
  pool: Waves,
  security: ShieldCheck
};

export default function PropertyModal({ 
  property, 
  onClose, 
  userQuery
}) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [toastMessage, setToastMessage] = useState("");
  
  const images = property.images || [property.image];

  useEffect(() => {
    // Prevent scrolling on body
    document.body.style.overflow = 'hidden';
    
    // Close on escape
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const [aiSummary, setAiSummary] = useState("");
  const [summaryLoading, setSummaryLoading] = useState(true);

  useEffect(() => {
    if (!property || !userQuery) {
      setAiSummary("Enter a search query first to get a personalized summary.");
      setSummaryLoading(false);
      return;
    }

    setSummaryLoading(true);
    setAiSummary("");

    generatePropertySummary(property, userQuery)
      .then((summary) => {
        setAiSummary(summary);
      })
      .catch((err) => {
        console.error(err);
        setAiSummary("Could not load summary.");
      })
      .finally(() => {
        setSummaryLoading(false);
      });
  }, [property?.id, userQuery]);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setToastMessage("Link copied!");
    setTimeout(() => setToastMessage(""), 3000);
  };

  const nextImage = () => setCurrentImageIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);

  const pricePerSqFt = property.area > 0 ? Math.round((property.price * 100000) / property.area) : 0;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-end sm:items-start justify-center md:items-center sm:p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="bg-white w-full sm:w-[90vw] md:max-w-5xl sm:rounded-3xl rounded-t-3xl shadow-2xl relative z-10 sm:animate-[modalScale_0.3s_ease-out_forwards] animate-[fade-in_0.3s_ease-out_forwards] flex flex-col sm:flex-row sm:max-h-[90vh] max-h-[95vh] overflow-y-auto md:my-8 mx-auto">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-md transition-colors focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col md:flex-row w-full h-full overflow-y-auto sm:overflow-hidden">
          
          {/* LEFT COLUMN (60%) */}
          <div className="w-full md:w-[60%] flex flex-col sm:overflow-y-auto scrollbar-hide">
            {/* Image Carousel */}
            <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-slate-200 group flex-shrink-0">
              <img 
                src={images[currentImageIndex]} 
                alt={`${property.title} view ${currentImageIndex + 1}`}
                onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop" }}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              
              <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none">
                <ChevronRight className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/50 w-2'}`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Property Details */}
            <div className="p-6 md:p-8 flex-shrink-0">
              <h2 className="font-playfair font-bold text-3xl text-slate-900 mb-3 leading-tight">
                {property.title}
              </h2>
              <div className="flex items-center gap-1.5 text-slate-500 mb-8">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium uppercase tracking-wide">{property.sector}, {property.locality}</span>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10 bg-slate-50/50 rounded-2xl p-5 border border-slate-100/80">
                <div className="flex flex-col">
                  <span className="text-slate-400 text-xs uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Type</span>
                  <span className="font-bold text-slate-900 text-lg">{property.bhk} BHK</span>
                </div>
                <div className="flex flex-col border-l border-slate-200/60 pl-4 sm:border-l-0 sm:pl-0">
                  <span className="text-slate-400 text-xs uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Ruler className="w-3.5 h-3.5" /> Area</span>
                  <span className="font-bold text-slate-900 text-lg">{property.area} <span className="text-sm font-semibold text-slate-500">sq ft</span></span>
                </div>
                <div className="flex flex-col border-t sm:border-t-0 sm:border-l border-slate-200/60 pt-4 sm:pt-0 sm:pl-4">
                  <span className="text-slate-400 text-xs uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Grid className="w-3.5 h-3.5" /> Floor</span>
                  <span className="font-bold text-slate-900 text-lg">{property.floor} <span className="text-sm font-semibold text-slate-500">of {property.totalFloors}</span></span>
                </div>
                <div className="flex flex-col border-t sm:border-t-0 border-l border-slate-200/60 pt-4 sm:pt-0 pl-4">
                  <span className="text-slate-400 text-xs uppercase tracking-widest mb-1.5 flex items-center gap-1.5"><Compass className="w-3.5 h-3.5" /> Facing</span>
                  <span className="font-bold text-slate-900 text-lg">{property.facing}</span>
                </div>
              </div>

              {/* Amenities */}
              {property.amenities && property.amenities.length > 0 && (
                <div className="mb-10">
                  <h3 className="font-bold text-slate-900 mb-5 text-lg">Premium Amenities</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-5 gap-x-4">
                    {property.amenities.map((amenity, idx) => {
                      const Icon = AMENITY_ICONS[amenity] || Sparkles;
                      return (
                        <div key={idx} className="flex items-center gap-3 text-slate-700">
                          <div className="bg-orange-50 p-2.5 rounded-xl text-orange-600 shadow-sm border border-orange-100/50">
                            <Icon className="w-4 h-4" />
                          </div>
                          <span className="text-sm font-medium capitalize">{amenity.replace('_', ' ')}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Tags */}
              {property.tags && property.tags.length > 0 && (
                <div className="pb-8 sm:pb-0">
                  <h3 className="font-bold text-slate-900 mb-4 text-lg">Property Highlights</h3>
                  <div className="flex flex-wrap gap-2.5">
                    {property.tags.map((tag, idx) => (
                      <span key={idx} className="bg-white border border-slate-200 text-slate-600 px-3.5 py-1.5 rounded-full text-sm font-medium shadow-sm">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN (40%) */}
          <div className="w-full md:w-[40%] bg-[#FAFAF8] border-t md:border-t-0 md:border-l border-slate-200 p-6 md:p-8 flex flex-col flex-shrink-0">
            <div className="mb-8">
              <div className="text-sm text-slate-400 font-semibold uppercase tracking-widest mb-2">Asking Price</div>
              <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">{property.priceLabel}</div>
              <div className="text-sm font-medium text-slate-500 mt-2">₹{pricePerSqFt.toLocaleString('en-IN')} per sq.ft</div>
            </div>

            <div className="flex-1">
              <h3 className="flex items-center gap-2 font-bold text-lg text-slate-900 mb-5">
                <Sparkles className="w-5 h-5 text-orange-500" />
                Why this matches your search
              </h3>
              
              <div className="bg-white border border-slate-100 border-l-4 border-l-orange-500 shadow-sm rounded-r-2xl p-6 relative">
                <div className="text-6xl text-orange-100 absolute top-2 left-3 font-serif leading-none select-none pointer-events-none">"</div>
                
                {summaryLoading ? (
                  <div className="space-y-2 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-full" />
                    <div className="h-4 bg-gray-200 rounded w-5/6" />
                    <div className="h-4 bg-gray-200 rounded w-4/6" />
                  </div>
                ) : (
                  <p className="text-gray-700 italic leading-relaxed pt-2 font-medium text-sm sm:text-base">
                    {aiSummary}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-slate-200 space-y-3">
              <button className="w-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-semibold py-4 rounded-xl shadow-lg shadow-orange-500/20 transition-all active:scale-[0.98]">
                Schedule a 360° Tour
              </button>
              
              <button 
                onClick={handleCopyLink}
                className="w-full bg-white border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Share2 className="w-4 h-4" />
                Share Property
              </button>
              
              <div className="h-6 mt-2">
                {toastMessage && (
                  <div className="text-center text-sm font-semibold text-green-600 animate-fade-in">
                    {toastMessage}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
