import { Home, PlaySquare, PlusCircle, Users, User, Plus } from 'lucide-react';

interface BottomNavProps {
  selectedTab: string;
  onTabChange: (tab: string) => void;
  onUploadClick: () => void;
  isSignedIn: boolean;
  userState?: any;
}

export default function BottomNav({ selectedTab, onTabChange, onUploadClick, isSignedIn, userState }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-14 bg-[#0F0F0F] border-t border-[#3F3F3F] flex items-center justify-around sm:hidden z-50 px-1 pb-1">
      <button 
        onClick={() => onTabChange('home')}
        className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${selectedTab === 'home' ? 'text-white' : 'text-white/80'}`}
      >
        <Home className={`w-6 h-6 stroke-[1.5] ${selectedTab === 'home' ? 'fill-current' : ''}`} />
        <span className="text-[10px] tracking-tight">Home</span>
      </button>
      
      <button 
        onClick={() => onTabChange('shorts')}
        className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${selectedTab === 'shorts' ? 'text-white' : 'text-white/80'}`}
      >
        <PlaySquare className={`w-6 h-6 stroke-[1.5] ${selectedTab === 'shorts' ? 'fill-current' : ''}`} />
        <span className="text-[10px] tracking-tight">Shorts</span>
      </button>
      
      <button 
        className="flex items-center justify-center w-16 h-full text-white active:scale-95 transition-transform"
        onClick={onUploadClick}
      >
        <div className="w-10 h-10 rounded-full border border-white flex items-center justify-center">
            <Plus className="w-6 h-6 stroke-[1.5]" />
        </div>
      </button>
      
      <button 
        onClick={() => onTabChange('subscriptions')}
        className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${selectedTab === 'subscriptions' ? 'text-white' : 'text-white/80'}`}
      >
        <Users className={`w-6 h-6 stroke-[1.5] ${selectedTab === 'subscriptions' ? 'fill-current' : ''}`} />
        <span className="text-[10px] tracking-tight">Subscriptions</span>
      </button>
      
      <button 
        onClick={() => onTabChange('you')}
        className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors ${['you', 'history', 'liked', 'watch-later'].includes(selectedTab) ? 'text-white' : 'text-white/80'}`}
      >
        <div className={`w-6 h-6 rounded-full overflow-hidden border-2 ${['you', 'history', 'liked', 'watch-later'].includes(selectedTab) ? 'border-white' : 'border-transparent'}`}>
           {isSignedIn ? (
             userState?.photoURL ? (
               <img src={userState.photoURL} alt="You" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
             ) : (
               <div className="w-full h-full bg-blue-600 flex items-center justify-center">
                 <User className="w-4 h-4 text-white" />
               </div>
             )
           ) : (
             <div className="w-full h-full bg-[#272727] flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
             </div>
           )}
        </div>
        <span className="text-[10px] tracking-tight">You</span>
      </button>
    </nav>
  );
}
