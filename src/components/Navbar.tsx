import { Search, Mic, PlusCircle, Bell, User, Menu, Youtube } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useState, useMemo } from 'react';

interface NavbarProps {
  onToggleSidebar: () => void;
  onSearch: (query: string) => void;
  onUploadClick: () => void;
  isSignedIn: boolean;
  onSignIn: () => void;
  userState?: any;
  videos?: any[];
}

export default function Navbar({ onToggleSidebar, onSearch, onUploadClick, isSignedIn, onSignIn, userState, videos = [] }: NavbarProps) {
  const [localSearch, setLocalSearch] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const searchSuggestions = useMemo(() => {
    if (!localSearch.trim()) return [];
    
    const queryTerm = localSearch.toLowerCase();
    const matches: string[] = [];
    
    // Extract titles
    const titles = videos.map(v => v.title).filter(t => t.toLowerCase().includes(queryTerm));
    // Extract channels
    const channels = videos.map(v => v.channelName).filter(c => c.toLowerCase().includes(queryTerm));
    // Extract categories
    const categories = videos.map(v => v.category).filter(c => c.toLowerCase().includes(queryTerm));
    
    matches.push(...titles.slice(0, 5));
    matches.push(...channels.slice(0, 2));
    matches.push(...categories.slice(0, 2));
    
    return Array.from(new Set(matches)).slice(0, 8);
  }, [localSearch, videos]);

  const handleSearchCommit = (term: string) => {
    setLocalSearch(term);
    onSearch(term);
    setIsFocused(false);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-[#0F0F0F] z-50 flex items-center justify-between px-4 h-14 border-b border-white/5">
      <div className="flex items-center gap-1">
        <button 
          onClick={onToggleSidebar}
          className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
        >
          <Menu className="w-6 h-6 stroke-[1.5]" />
        </button>
        <div className="flex items-center gap-1 cursor-pointer px-1" onClick={() => window.location.href = '/'}>
          <div className="flex items-center gap-1">
            <Youtube className="w-[30px] h-[30px] text-[#FF0000] fill-current" />
            <span className="text-[20px] font-[500] tracking-tighter text-white font-sans" style={{ letterSpacing: "-1px" }}>Shazam</span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-[720px] px-4 flex items-center gap-4">
        <div className="flex flex-1 items-center">
          <div className="relative flex-1 flex" onFocus={() => setIsFocused(true)} onBlur={() => setTimeout(() => setIsFocused(false), 200)}>
            <input 
              type="text" 
              placeholder="Search" 
              value={localSearch}
              className="w-full bg-[#121212] border border-[#303030] rounded-l-full py-1.5 px-4 focus:outline-none focus:border-blue-500 transition-all text-sm text-white placeholder-[#888888]"
              onChange={(e) => {
                setLocalSearch(e.target.value);
                onSearch(e.target.value);
              }}
              onKeyDown={(e) => {
                if(e.key === 'Enter') {
                  handleSearchCommit(localSearch);
                }
              }}
            />
            <button 
              onClick={() => handleSearchCommit(localSearch)}
              className="bg-[#222222] border border-l-0 border-[#303030] rounded-r-full px-5 py-1.5 hover:bg-[#2c2c2c] transition-colors group"
            >
              <Search className="w-5 h-5 text-white/70 group-hover:text-white" />
            </button>

            <AnimatePresence>
              {isFocused && searchSuggestions.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-12 left-0 right-14 bg-[#282828] py-4 rounded-xl shadow-2xl border border-white/10 z-50 flex flex-col"
                >
                  {searchSuggestions.map((suggestion, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => handleSearchCommit(suggestion)}
                      className="px-4 py-1.5 hover:bg-white/10 cursor-pointer flex items-center gap-4 text-[15px] font-medium"
                    >
                      <Search className="w-4 h-4 text-white/40" />
                      <span className="truncate">{suggestion}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button className="ml-4 p-2 bg-[#181818] hover:bg-white/10 rounded-full transition-colors flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button 
          onClick={onUploadClick}
          className="p-2 hover:bg-white/10 rounded-full text-white hidden sm:block"
        >
          <PlusCircle className="w-6 h-6" />
        </button>
        <button className="p-2 hover:bg-white/10 rounded-full text-white hidden sm:block">
          <Bell className="w-6 h-6" />
        </button>
        <div className="p-2 flex items-center">
          {isSignedIn ? (
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold cursor-pointer overflow-hidden border border-white/10">
              {userState?.photoURL ? (
                 <img src={userState.photoURL} alt="Profile" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
              ) : (
                 <User className="w-5 h-5 text-white" />
              )}
            </div>
          ) : (
            <button 
              onClick={onSignIn}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/20 text-[#3ea6ff] hover:bg-[#3ea6ff]/10 hover:border-transparent transition-all font-medium text-sm"
            >
              <User className="w-4 h-4" />
              Sign in
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
