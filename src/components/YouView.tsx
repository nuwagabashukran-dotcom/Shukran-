import { Clock, History, PlaySquare, ChevronRight, ThumbsUp, Shuffle, User, Download, Clapperboard, Plus, ChevronDown, Cast, Bell, Search, Settings, Youtube } from 'lucide-react';
import { Video } from '../types';
import VideoCard from './VideoCard';
import { MOCK_VIDEOS } from '../data/mock';

interface YouViewProps {
  watchHistoryIds: string[];
  watchLaterIds: string[];
  likedVideoIds: string[];
  onVideoClick: (video: Video) => void;
  onTabChange: (tab: string) => void;
  onWatchLaterToggle: (id: string) => void;
  isSignedIn: boolean;
  onSignIn: () => void;
  userState?: any;
  onSignOut?: () => void;
}

export default function YouView({
  watchHistoryIds,
  watchLaterIds,
  likedVideoIds,
  onVideoClick,
  onTabChange,
  onWatchLaterToggle,
  isSignedIn,
  onSignIn,
  userState,
  onSignOut
}: YouViewProps) {
  const historyVideos = watchHistoryIds.map(id => MOCK_VIDEOS.find(v => v.id === id)).filter(Boolean) as Video[];
  // Fallbacks if history is empty just for demonstration matching the image
  const displayHistory = historyVideos.length > 0 ? historyVideos : MOCK_VIDEOS.slice(0, 4);

  return (
    <div className="text-white pb-20 w-full max-w-[800px] mx-auto overflow-x-hidden pt-2 min-h-screen">
      {/* View-specific Header (Matching YouTube Mobile Image) */}
      <div className="flex items-center justify-between px-4 pb-2">
        {isSignedIn ? (
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 rounded-full hover:bg-white/20 transition-colors font-medium text-sm">
            Accounts <ChevronDown className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => onTabChange('home')}>
             <Youtube className="w-[30px] h-[30px] text-[#FF0000] fill-current" />
             <span className="text-[20px] font-[500] tracking-tighter text-white font-sans hidden sm:block" style={{ letterSpacing: "-1px" }}>Shazam</span>
          </div>
        )}
        <div className="flex items-center gap-4">
          <button className="text-white/90 hover:text-white"><Cast className="w-6 h-6 stroke-[1.5]" /></button>
          <button className="text-white/90 hover:text-white relative">
            <Bell className="w-6 h-6 stroke-[1.5]" />
            <span className="absolute -top-1 -right-1.5 bg-[#FF0000] text-[10px] font-bold px-1 rounded-full border border-black">9+</span>
          </button>
          <button className="text-white/90 hover:text-white"><Search className="w-6 h-6 stroke-[1.5]" /></button>
          <button className="text-white/90 hover:text-white" onClick={() => onTabChange('settings')}>
            <Settings className="w-6 h-6 stroke-[1.5]" />
          </button>
        </div>
      </div>

      {!isSignedIn ? (
        <div className="flex flex-col items-center justify-center pt-24 px-6 text-center">
          <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center mb-6 border border-white/10 shadow-2xl">
            <User className="w-12 h-12 text-[#3ea6ff]" />
          </div>
          <h2 className="text-[22px] font-bold text-white mb-2 tracking-tight">Sign in to your profile</h2>
          <p className="text-[#aaaaaa] mb-8 text-[15px] max-w-[280px] leading-relaxed">
            Sign in to upload videos, save content to playlists, and view your viewing history.
          </p>
          <button 
            onClick={onSignIn} 
            className="px-8 py-2.5 rounded-full bg-[#3ea6ff] text-black font-semibold hover:bg-blue-400 transition-colors tracking-wide text-[15px]"
          >
            Sign in
          </button>
        </div>
      ) : (
        <>
          {/* Profile Section */}
      <div className="flex items-center gap-4 px-4 py-4">
        <div className="w-20 h-20 rounded-full bg-white/20 overflow-hidden flex-shrink-0">
          <img src={userState?.photoURL || "https://picsum.photos/seed/avatar123/200/200"} alt="Channel avatar" className="w-full h-full object-cover" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold leading-tight line-clamp-2">{userState?.displayName || 'Your Profile'}</h1>
          <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
            <span>{userState?.email ? `@${userState.email.split('@')[0]}` : '@username'}</span>
            <span>•</span>
            <button className="flex items-center hover:text-white transition-colors" onClick={onSignOut}>
              Sign out <ChevronRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* History Section */}
      <div className="mt-2 text-white">
        <div 
          className="flex items-center justify-between px-4 py-2 cursor-pointer active:bg-white/10"
          onClick={() => onTabChange('history')}
        >
          <div className="flex items-center gap-1 font-bold text-xl">
            History <ChevronRight className="w-5 h-5 ml-1 text-white" />
          </div>
        </div>
        
        <div className="flex overflow-x-auto gap-3 px-4 pb-4 pt-1 snap-x scrollbar-hide">
          {displayHistory.slice(0, 8).map(video => (
            <div key={video.id} className="w-[160px] flex-shrink-0 snap-start cursor-pointer" onClick={() => onVideoClick(video)}>
              <div className="relative aspect-video rounded-xl overflow-hidden bg-[#272727] mb-2">
                <img src={video.thumbnailUrl} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                <div className="absolute bottom-1 right-1 bg-black/80 px-1 rounded text-xs font-medium">
                  {video.duration}
                </div>
              </div>
              <h3 className="text-sm font-semibold line-clamp-2 leading-tight mb-1">{video.title}</h3>
              <p className="text-xs text-[#aaa]">{video.channelName}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Playlists Section */}
      <div className="mt-4">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center gap-1 font-bold text-xl">
            Playlists <ChevronRight className="w-5 h-5 ml-1 text-white" />
          </div>
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors active:bg-white/20">
            <Plus className="w-6 h-6" />
          </button>
        </div>
        
        <div className="flex overflow-x-auto gap-3 px-4 pb-4 pt-1 snap-x scrollbar-hide">
          
          {/* Liked Videos Playlist */}
          <div className="w-[160px] flex-shrink-0 snap-start cursor-pointer group" onClick={() => onTabChange('liked')}>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-[#1a2a6c] via-[#b21f1f] to-[#fdbb2d] mb-2 flex items-center justify-center shadow-lg group-hover:opacity-90">
               {likedVideoIds.length > 0 && MOCK_VIDEOS.find(v => v.id === likedVideoIds[0]) ? (
                 <>
                   <img src={MOCK_VIDEOS.find(v => v.id === likedVideoIds[0])!.thumbnailUrl} className="w-full h-full object-cover opacity-50" alt="" referrerPolicy="no-referrer" />
                   <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center">
                     <ThumbsUp className="w-8 h-8 text-white mb-1" />
                     <span className="text-white font-medium text-sm">{likedVideoIds.length}</span>
                   </div>
                 </>
               ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <ThumbsUp className="w-8 h-8 text-white mb-1" />
                 </div>
               )}
            </div>
            <h3 className="text-sm font-semibold line-clamp-1 leading-tight">Liked videos</h3>
            <p className="text-xs text-[#aaa]">Private</p>
          </div>

          {/* Watch Later Playlist */}
          <div className="w-[160px] flex-shrink-0 snap-start cursor-pointer group" onClick={() => onTabChange('watch-later')}>
            <div className="relative aspect-video rounded-xl overflow-hidden bg-[#272727] mb-2 flex flex-col items-center justify-center shadow-lg group-hover:opacity-90">
               {watchLaterIds.length > 0 && MOCK_VIDEOS.find(v => v.id === watchLaterIds[0]) ? (
                 <>
                   <img src={MOCK_VIDEOS.find(v => v.id === watchLaterIds[0])!.thumbnailUrl} className="w-full h-full object-cover opacity-70 border-b-2 border-transparent" style={{ transform: 'translateY(-10%)' }} alt="" referrerPolicy="no-referrer" />
                   <div className="absolute bottom-0 right-0 left-0 bg-black/60 pt-6 pb-1 px-1 flex flex-col items-end">
                     <div className="absolute right-1 bottom-1 text-white font-medium text-xs flex items-center bg-black/80 rounded px-1">
                        <Clock className="w-3 h-3 mr-1" /> {watchLaterIds.length}
                     </div>
                   </div>
                 </>
               ) : (
                 <div className="absolute inset-0 flex flex-col items-center justify-center text-white/50">
                    <Clock className="w-8 h-8 mb-1" />
                 </div>
               )}
            </div>
            <h3 className="text-sm font-semibold line-clamp-1 leading-tight">Watch later</h3>
            <p className="text-xs text-[#aaa]">Private</p>
          </div>

          {/* User Playlist example (Sounds from Shorts) */}
          <div className="w-[160px] flex-shrink-0 snap-start cursor-pointer group">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-tr from-purple-500 to-orange-400 mb-2 flex items-center justify-center shadow-lg group-hover:opacity-90">
               <div className="absolute bottom-1 right-1 bg-black/80 rounded px-1 flex items-center text-xs font-medium tracking-widest text-white">
                 <svg className="fill-current w-3 h-3 mr-1" viewBox="0 0 24 24"><path d="M22 7H2v1h20V7zm-9 5H2v-1h11v1zm0 4H2v-1h11v1zm2-3.99V18l8-4-8-3.99z"></path></svg>
                 1
               </div>
               <img src="https://picsum.photos/seed/shorts/200/200" className="w-[70px] h-[70px] object-cover rounded-xl shadow-lg -rotate-12 outline outline-2 outline-white/20" alt="Shorts" referrerPolicy="no-referrer" />
            </div>
            <h3 className="text-sm font-semibold line-clamp-1 leading-tight break-all">Sounds from Shorts</h3>
            <p className="text-xs text-[#aaa]">Private • Playlist</p>
          </div>
          
        </div>
      </div>

      {/* Vertical Navigation Items */}
      <div className="mt-4 px-2 space-y-1 border-t border-white/10 pt-4 pb-12 w-full max-w-[600px]">
        
        <button onClick={() => onTabChange('your-videos')} className="w-full flex items-center gap-4 px-3 py-3.5 hover:bg-white/10 rounded-xl active:bg-white/20 transition-colors group">
          <PlaySquare className="w-7 h-7 font-light stroke-[1.2] text-white" />
          <span className="text-[17px] text-white">Your videos</span>
        </button>

        <button onClick={() => onTabChange('downloads')} className="w-full flex items-center gap-4 px-3 py-3.5 hover:bg-white/10 rounded-xl active:bg-white/20 transition-colors group">
           <Download className="w-7 h-7 font-light stroke-[1.2] text-white" />
           <span className="text-[17px] text-white flex-1 text-left">Downloads</span>
           <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
             <Download className="w-3 h-3 text-white" />
           </div>
        </button>

        <button onClick={() => onTabChange('movies')} className="w-full flex items-center gap-4 px-3 py-3.5 hover:bg-white/10 rounded-xl active:bg-white/20 transition-colors group">
           <Clapperboard className="w-7 h-7 font-light stroke-[1.2] text-white" />
           <span className="text-[17px] text-white">Movies</span>
        </button>
        
      </div>
      
        </>
      )}
    </div>
  );
}
