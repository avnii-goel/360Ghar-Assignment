import React from 'react';
import { MapPin, Play } from 'lucide-react';
import { GitCompare } from 'lucide-react';

const REASON_EMOJIS = {
  "gym": "💪",
  "school": "🏫",
  "schools": "🏫",
  "metro": "🚇",
  "sunlight": "🌞",
  "light": "🌞",
  "park": "🌳",
  "pool": "🏊",
  "security": "👮",
  "budget": "💰",
  "bhk": "🛏️",
  "area": "📍",
  "facing": "🧭"
};

const getEmojiForReason = (reason) => {
  const lowerReason = reason.toLowerCase();
  for (const [key, emoji] of Object.entries(REASON_EMOJIS)) {
    if (lowerReason.includes(key)) return emoji;
  }
  return "✨";
};

export default function PropertyCard({ property, onSelect, index = 0, compareList = [], toggleCompare }) {
  const isLessRelevant = property.matchScore === 0;

  const isInCompare = compareList.some(p => p.id === property.id);
  const isDisabled = compareList.length >= 2 && !isInCompare;

  return (
    <div 
      onClick={() => onSelect && onSelect(property)}
      className={`bg-[#FAFAF8] rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-100 flex flex-col relative animate-fade-in ${
        isLessRelevant ? 'opacity-60 grayscale-[0.3]' : ''
      }`}
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
    >
      {/* Image Section */}
      <div className="relative aspect-video bg-slate-200 overflow-hidden">
        <img 
          src={property.image} 
          alt={property.title} 
          onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=500&fit=crop" }}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />

        {/* Compare Button */}
        {toggleCompare && (
          <button
            onClick={(e) => { e.stopPropagation(); toggleCompare(property); }}
            disabled={isDisabled}
            className={`absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2.5 py-1 
              rounded-full text-xs font-semibold transition-all
              ${isInCompare 
                ? "bg-orange-500 text-white shadow-md" 
                : isDisabled 
                  ? "bg-slate-200/80 backdrop-blur-md text-slate-400 cursor-not-allowed"
                  : "bg-white/90 backdrop-blur-md text-slate-700 hover:bg-orange-500 hover:text-white"
              }`}
          >
            <GitCompare size={14} /> {isInCompare ? "Added" : "Compare"}
          </button>
        )}
        
        {/* 360 Tour Pill */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md text-white text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5">
          <Play className="w-3.5 h-3.5 fill-white text-white" />
          <span>360° Tour</span>
        </div>

        {/* VERIFIED Badge */}
        {property.matchScore > 60 && !isLessRelevant && (
          <div className="absolute top-3 right-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm tracking-wider uppercase">
            Verified Match
          </div>
        )}

        {/* Less Relevant Overlay */}
        {isLessRelevant && (
          <div className="absolute top-3 right-3 bg-slate-500 text-white text-[10px] font-bold px-2 py-1 rounded shadow-sm tracking-wider uppercase">
            Less Relevant
          </div>
        )}
      </div>

      {/* Body Section */}
      <div className="p-5 flex-1 flex flex-col font-sans">
        <h3 className="font-playfair font-bold text-xl leading-snug line-clamp-2 text-slate-900 mb-3">
          {property.title}
        </h3>
        
        <div className="text-slate-700 text-sm font-medium mb-2">
          {property.bhk}BHK · {property.area} sq ft · {property.facing} Facing
        </div>
        
        <div className="flex items-start gap-1 text-slate-500 text-sm mb-4">
          <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span className="line-clamp-1">{property.sector}, {property.locality}</span>
        </div>

        <div className="mb-4">
          <span className="text-2xl font-bold text-slate-900">{property.priceLabel}</span>
          <span className="text-sm text-slate-500 ml-1">onwards</span>
        </div>

        {/* Match Reasons Horizontal Scroll */}
        {property.matchReasons && property.matchReasons.length > 0 && !isLessRelevant && (
          <div className="flex overflow-x-auto gap-2 pb-2 mb-2 scrollbar-hide -mx-1 px-1">
            {property.matchReasons.map((reason, i) => (
              <div key={i} className="flex-shrink-0 bg-orange-100 text-orange-900 text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap border border-orange-200">
                <span className="mr-1">{getEmojiForReason(reason)}</span>
                {reason}
              </div>
            ))}
          </div>
        )}

        {/* Tags Row */}
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {property.tags && property.tags.slice(0, 3).map((tag, i) => (
            <div key={i} className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider border border-slate-200 px-2 py-0.5 rounded-sm">
              {tag}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
