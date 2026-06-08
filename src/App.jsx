import React, { useState, useCallback, useEffect } from 'react';
import { PROPERTIES } from './data/properties';
import SearchBar from './components/SearchBar';
import PropertyGrid from './components/PropertyGrid';
import PropertyModal from './components/PropertyModal';
import CompareModal from './components/CompareModal';
import { parseSearchQuery } from './services/openrouter';
import { filterAndRankProperties } from './services/filterEngine';

function App() {
  const [query, setQuery] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedFilters, setParsedFilters] = useState(null);
  const [properties, setProperties] = useState(PROPERTIES);
  const [filteredProperties, setFilteredProperties] = useState(PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [compareList, setCompareList] = useState([]);
  const [showCompare, setShowCompare] = useState(false);

  const toggleCompare = useCallback((property) => {
    setCompareList(prev => {
      const exists = prev.find(p => p.id === property.id);
      if (exists) return prev.filter(p => p.id !== property.id);
      if (prev.length >= 2) return prev; // max 2, silently ignore
      return [...prev, property];
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlQuery = params.get("q");
    if (urlQuery) {
      setQuery(urlQuery);
      handleSearch(urlQuery);
    }
  }, []);

  const clearSearch = useCallback(() => {
    setQuery("");
    setParsedFilters(null);
    setFilteredProperties([]);
    setHasSearched(false);
    window.history.replaceState({}, "", window.location.pathname);
  }, []);

  const handleSearch = useCallback(async (queryText) => {
    if (!queryText.trim()) return;
    setHasSearched(true);
    setIsParsing(true);
    setSelectedProperty(null);
    
    const filters = await parseSearchQuery(queryText);
    
    if (filters) {
      setParsedFilters(filters);
      const ranked = filterAndRankProperties(properties, filters);
      setFilteredProperties(ranked);
      
      const params = new URLSearchParams();
      params.set("q", queryText);
      window.history.replaceState({}, "", `?${params.toString()}`);
    }
    
    setIsParsing(false);
  }, [properties]);

  const handleChipClick = (chipQuery) => {
    setQuery(chipQuery);
    handleSearch(chipQuery);
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900 font-sans flex flex-col scroll-smooth">
      {/* HEADER */}
      <header className={`sticky top-0 z-30 transition-all duration-300 backdrop-blur-md bg-white/85 border-b border-slate-200/50 ${hasSearched ? 'py-3' : 'py-4'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex flex-col cursor-pointer" onClick={clearSearch}>
            <div className="flex items-center gap-1.5 font-playfair leading-none">
              <span className="text-2xl font-black text-orange-500 tracking-tight">360°</span>
              <span className="text-2xl font-black text-slate-900 tracking-wider">GHAR</span>
            </div>
            <span className="text-[9px] text-slate-500 font-bold tracking-widest uppercase mt-1">Verified VR Properties · NCR</span>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden sm:block text-sm font-bold text-slate-600 hover:text-slate-900 transition-colors px-3 py-2">
              Sign In
            </button>
            <button className="bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold px-5 py-2.5 rounded-lg transition-colors shadow-sm shadow-slate-900/10">
              List Property
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      {!hasSearched && (
        <main className="flex-1 flex flex-col items-center justify-center relative bg-slate-900 overflow-hidden min-h-[calc(100vh-80px)]">
          {/* Subtle grain + grid overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-20 pointer-events-none"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-slate-900/50 pointer-events-none"></div>
          
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 w-full text-center pb-20 pt-10">
            <div className="inline-block mb-6 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-orange-400 text-xs font-bold tracking-widest uppercase animate-fade-in shadow-[0_0_15px_rgba(249,115,22,0.1)]">
              India's First AI + VR Real Estate Platform
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-bold text-white tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '100ms', animationFillMode: 'both' }}>
              Find your home,<br className="hidden sm:block" />
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-300"> describe it in words</span>
            </h1>
            
            <p className="text-lg sm:text-xl text-slate-400 mb-12 max-w-2xl mx-auto animate-fade-in font-medium" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
              Our AI understands what you truly want — not just filters.
            </p>
            
            <div className="w-full max-w-3xl mx-auto animate-fade-in" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
              <SearchBar 
                query={query}
                setQuery={setQuery}
                onSearch={handleSearch}
                isParsing={isParsing}
                isListening={isListening}
                setIsListening={setIsListening}
                parsedFilters={null} /* Don't show pills in hero normally, or maybe yes? Let's hide them if not searched */
              />
              
              {/* Example Chips */}
              <div className="mt-8 flex flex-wrap justify-center gap-3">
                {[
                  "2BHK Sector 50 under 80L near school",
                  "3BHK DLF Phase 4 with gym and pool",
                  "1BHK under 50 lakhs metro accessible"
                ].map((chip, idx) => (
                  <button 
                    key={idx}
                    onClick={() => handleChipClick(chip)}
                    className="bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 text-sm px-4 py-2.5 rounded-full transition-all hover:border-orange-500/50 hover:text-orange-200 hover:-translate-y-0.5"
                  >
                    "{chip}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* RESULTS SECTION */}
      {hasSearched && (
        <div className="flex-1 flex flex-col bg-slate-50 min-h-screen">
          <div className="sticky top-[73px] z-20 bg-white/95 backdrop-blur-md border-b border-slate-200/50 shadow-sm py-2">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <SearchBar 
                query={query}
                setQuery={setQuery}
                onSearch={handleSearch}
                isParsing={isParsing}
                isListening={isListening}
                setIsListening={setIsListening}
                parsedFilters={parsedFilters}
              />
            </div>
          </div>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
            <PropertyGrid 
              properties={filteredProperties} 
              onSelect={setSelectedProperty} 
              isParsing={isParsing} 
              parsedFilters={parsedFilters} 
              compareList={compareList}
              toggleCompare={toggleCompare}
            />
          </main>
        </div>
      )}

      {selectedProperty && (
        <PropertyModal 
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          userQuery={query}
        />
      )}

      {compareList.length === 2 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900 text-white px-6 py-4 flex items-center justify-between shadow-2xl animate-[slide-up_0.3s_ease-out_forwards]">
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Comparing:</span>
            <span className="font-semibold">{compareList[0].title}</span>
            <span className="text-slate-500">vs</span>
            <span className="font-semibold">{compareList[1].title}</span>
          </div>
          <div className="flex gap-4 items-center">
            <button onClick={() => setCompareList([])} className="text-slate-400 hover:text-white text-sm underline transition-colors">
              Clear
            </button>
            <button onClick={() => setShowCompare(true)} className="bg-orange-500 hover:bg-orange-600 px-6 py-2.5 rounded-full text-sm font-bold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all active:scale-95">
              Compare Side by Side →
            </button>
          </div>
        </div>
      )}

      {showCompare && compareList.length === 2 && (
        <CompareModal
          properties={compareList}
          onClose={() => setShowCompare(false)}
          onSelectProperty={(p) => { setShowCompare(false); setSelectedProperty(p); }}
        />
      )}
    </div>
  );
}

export default App;
