import React, { useState, useRef, useEffect } from 'react';
import { Mic, Search, X, Loader2 } from 'lucide-react';

export default function SearchBar({ 
  query, 
  setQuery, 
  onSearch, 
  isParsing, 
  isListening, 
  setIsListening,
  parsedFilters 
}) {
  const textareaRef = useRef(null);
  const isCompact = !!parsedFilters;

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [query]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (query.trim() && !isParsing) {
        onSearch(query);
      }
    }
  };

  const toggleListening = () => {
    if (isListening) {
      // It will auto-stop, but we don't have the recognition instance here easily 
      // without keeping a ref. Usually clicking it again isn't strictly necessary 
      // if it stops on end, but we can manage it.
      return; 
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in your browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      onSearch(transcript);
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  const renderPills = () => {
    if (!parsedFilters) return null;
    
    const pills = [];

    if (parsedFilters.bhk) {
      pills.push({ id: 'bhk', label: `${parsedFilters.bhk} BHK` });
    }

    if (parsedFilters.minPrice !== null || parsedFilters.maxPrice !== null) {
      let label = "";
      if (parsedFilters.minPrice !== null && parsedFilters.maxPrice !== null) {
        label = `₹${parsedFilters.minPrice}L - ₹${parsedFilters.maxPrice}L`;
      } else if (parsedFilters.minPrice !== null) {
        label = `Min ₹${parsedFilters.minPrice}L`;
      } else {
        label = `Max ₹${parsedFilters.maxPrice}L`;
      }
      pills.push({ id: 'price', label });
    }

    if (parsedFilters.sectors && parsedFilters.sectors.length > 0) {
      parsedFilters.sectors.forEach((sec, idx) => {
        pills.push({ id: `sec-${idx}`, label: sec });
      });
    }

    if (parsedFilters.amenities && parsedFilters.amenities.length > 0) {
      parsedFilters.amenities.forEach((am, idx) => {
        pills.push({ id: `am-${idx}`, label: am.replace('_', ' ') });
      });
    }

    if (pills.length === 0) return null;

    return (
      <div className={`flex flex-wrap ${isCompact ? 'gap-1.5 mt-2.5' : 'gap-2 mt-4'}`}>
        {pills.map(pill => (
          <div key={pill.id} className={`inline-flex items-center gap-1 bg-white/10 text-orange-50 rounded-full font-medium border border-white/20 ${isCompact ? 'px-2 py-0.5 text-[11px]' : 'px-3 py-1.5 text-sm'}`}>
            <span>{pill.label}</span>
            <button className="hover:text-orange-200 transition-colors focus:outline-none ml-1">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`w-full bg-slate-900 shadow-xl relative overflow-hidden ${isCompact ? 'rounded-xl p-3 sm:p-4' : 'rounded-2xl p-4 sm:p-6'}`}>
      {/* Decorative gradient orb for luxury feel */}
      {!isCompact && <div className="absolute -top-24 -right-24 w-48 h-48 bg-orange-500/20 rounded-full blur-3xl pointer-events-none"></div>}
      
      <div className={`relative z-10 flex flex-col sm:flex-row items-end sm:items-center ${isCompact ? 'gap-2' : 'gap-3'}`}>
        <div className="relative flex-1 w-full bg-slate-800 rounded-xl border border-slate-700/50 focus-within:border-orange-500/50 focus-within:ring-1 focus-within:ring-orange-500/50 transition-all duration-300 flex items-center shadow-inner overflow-hidden">
          {isCompact ? (
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Describe your dream home...'
              className="w-full bg-transparent text-slate-50 placeholder-slate-400 px-4 h-[40px] text-[14px] outline-none"
              disabled={isParsing}
            />
          ) : (
            <textarea
              ref={textareaRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder='Describe your dream home... "2BHK in Sector 50 under 80 lakhs, good sunlight"'
              className="w-full bg-transparent text-slate-50 placeholder-slate-400 px-4 py-4 sm:py-5 resize-none outline-none min-h-[56px] max-h-[120px] overflow-y-auto leading-relaxed"
              rows={1}
              disabled={isParsing}
            />
          )}
          <button 
            onClick={toggleListening}
            disabled={isParsing}
            className={`mx-2 rounded-full transition-all duration-300 focus:outline-none flex-shrink-0 ${isCompact ? 'p-2' : 'p-3'}
              ${isListening 
                ? 'bg-red-500/20 text-red-400 animate-pulse ring-2 ring-red-500/50' 
                : 'text-slate-400 hover:text-orange-400 hover:bg-slate-700'
              }`}
            title="Voice Search"
          >
            <Mic className={`w-5 h-5 ${isCompact ? 'w-4 h-4' : ''}`} />
          </button>
        </div>

        <button
          onClick={() => query.trim() && !isParsing && onSearch(query)}
          disabled={!query.trim() || isParsing}
          className={`w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white rounded-xl font-semibold shadow-lg transition-all duration-300 flex-shrink-0 ${isCompact ? 'px-4 h-[40px] text-[14px]' : 'px-6 py-4 sm:py-5'}`}
        >
          {isParsing ? (
            <Loader2 className={`animate-spin ${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />
          ) : (
            <>
              <Search className={`${isCompact ? 'w-4 h-4' : 'w-5 h-5'}`} />
              <span className={isCompact ? 'text-[14px]' : ''}>Search</span>
            </>
          )}
        </button>
      </div>

      {renderPills()}
    </div>
  );
}
