import { Cast, Bell, Search, Youtube, ChevronDown } from 'lucide-react';
import { Video } from '../types';

interface SubscriptionsViewProps {
  subscribedChannels: string[];
  displayVideos: Video[];
  onVideoClick: (video: Video) => void;
  onSubscribeToggle: (channelName: string) => void;
  onTabChange: (tab: string) => void;
}

// Mock channel recommendations for empty state
const RECOMMENDED_CHANNELS = [
  {
    category: 'Beauty & Fashion',
    channels: [
      { name: 'Lauren Elizabeth', handle: '@LaurenElizabeth', avatar: 'https://picsum.photos/seed/lauren/200/200' },
      { name: 'Cherry Dollface', handle: '@Thecherrydollface', avatar: 'https://picsum.photos/seed/cherry/200/200' },
      { name: 'Yolanda Beck', handle: '@etcblogmag', avatar: 'https://picsum.photos/seed/yolanda/200/200' },
    ]
  },
  {
    category: 'Comedy',
    channels: [
      { name: 'ERB', handle: '@ERB', avatar: 'https://picsum.photos/seed/erb/200/200' },
      { name: 'nigahiga', handle: '@ryanhiga', avatar: 'https://picsum.photos/seed/niga/200/200' },
    ]
  }
];

export default function SubscriptionsView({
  subscribedChannels,
  displayVideos,
  onVideoClick,
  onSubscribeToggle,
  onTabChange
}: SubscriptionsViewProps) {
  return (
    <div className="text-white pb-20 w-full max-w-[800px] mx-auto overflow-x-hidden pt-2 min-h-screen">
      {/* Top Mobile Header similar to the You view but with YouTube logo */}
      <div className="flex items-center justify-between px-4 pb-2">
        <div className="flex items-center gap-1 cursor-pointer" onClick={() => onTabChange('home')}>
          <Youtube className="w-[30px] h-[30px] text-[#FF0000] fill-current" />
          <span className="text-[20px] font-[500] tracking-tighter text-white font-sans hidden sm:block" style={{ letterSpacing: "-1px" }}>Shazam</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="text-white/90 hover:text-white"><Cast className="w-6 h-6 stroke-[1.5]" /></button>
          <button className="text-white/90 hover:text-white relative">
            <Bell className="w-6 h-6 stroke-[1.5]" />
            <span className="absolute -top-1 -right-1.5 bg-[#FF0000] text-[10px] font-bold px-1 rounded-full border border-black">9+</span>
          </button>
          <button className="text-white/90 hover:text-white"><Search className="w-6 h-6 stroke-[1.5]" /></button>
        </div>
      </div>

      {subscribedChannels.length === 0 ? (
        <div className="flex flex-col items-center">
          {/* Empty State Graphic */}
          <div className="w-full flex justify-center py-10 relative">
            <div className="relative w-48 h-40">
               {/* Simplified Parachute and Play icon representation */}
               <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a1a] to-transparent rounded-full opacity-50 blur-xl"></div>
               <svg viewBox="0 0 200 150" className="w-full h-full relative z-10" fill="none" xmlns="http://www.w3.org/2000/svg">
                 {/* Clouds */}
                 <path d="M40 40 Q50 30 70 30 Q80 20 100 20 Q120 20 130 30 Q150 30 160 40 Z" fill="#2d2d2d" />
                 <path d="M20 70 Q30 60 50 60 Q70 60 80 70 Z" fill="#2d2d2d" />
                 <path d="M120 80 Q130 70 150 70 Q170 70 180 80 Z" fill="#2d2d2d" />
                 <path d="M30 50 L170 50" stroke="#404040" strokeWidth="2" />
                 
                 {/* Parachute Canopy */}
                 <path d="M100 40 C 40 40 40 100 40 100 L 160 100 C 160 100 160 40 100 40 Z" fill="#f0f0f0" />
                 <path d="M100 40 C 70 40 55 100 55 100 L 85 100 C 85 100 85 40 100 40 Z" fill="#e0e0e0" />
                 <path d="M100 40 C 130 40 145 100 145 100 L 115 100 C 115 100 115 40 100 40 Z" fill="#d0d0d0" />
                 
                 {/* Cords */}
                 <line x1="50" y1="100" x2="90" y2="130" stroke="#888" strokeWidth="1.5" />
                 <line x1="100" y1="100" x2="100" y2="130" stroke="#888" strokeWidth="1.5" />
                 <line x1="150" y1="100" x2="110" y2="130" stroke="#888" strokeWidth="1.5" />
                 
                 {/* Film Box */}
                 <rect x="80" y="125" width="40" height="25" fill="#5f71b8" transform="rotate(-15 100 137)" />
                 <circle cx="85" cy="130" r="1.5" fill="#1f295c" transform="rotate(-15 100 137)" />
                 <circle cx="85" cy="137" r="1.5" fill="#1f295c" transform="rotate(-15 100 137)" />
                 <circle cx="85" cy="144" r="1.5" fill="#1f295c" transform="rotate(-15 100 137)" />
                 <circle cx="115" cy="130" r="1.5" fill="#1f295c" transform="rotate(-15 100 137)" />
                 <circle cx="115" cy="137" r="1.5" fill="#1f295c" transform="rotate(-15 100 137)" />
                 <circle cx="115" cy="144" r="1.5" fill="#1f295c" transform="rotate(-15 100 137)" />
               </svg>
            </div>
          </div>

          <h2 className="text-xl font-bold mb-2">New videos right to you</h2>
          <p className="text-[#aaaaaa] text-center max-w-xs text-sm mb-10 px-4 leading-relaxed">
            Subscribe to get the latest videos from channels you love.
          </p>

          {/* Recommended Channels List */}
          <div className="w-full">
            {RECOMMENDED_CHANNELS.map((group, gIdx) => (
              <div key={gIdx} className="mb-8">
                <h3 className="px-4 text-lg font-bold mb-4">{group.category}</h3>
                <div className="flex flex-col gap-5 px-4">
                  {group.channels.map((channel, cIdx) => (
                    <div key={cIdx} className="flex items-center justify-between group">
                      <div className="flex items-center gap-4 cursor-pointer">
                        <img 
                          src={channel.avatar} 
                          alt={channel.name} 
                          className="w-12 h-12 rounded-full object-cover bg-white/10"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex flex-col">
                          <span className="text-[15px] text-white tracking-wide">{channel.name}</span>
                          <span className="text-[13px] text-[#aaaaaa] mt-0.5">{channel.handle}</span>
                        </div>
                      </div>
                      <button 
                        onClick={() => onSubscribeToggle(channel.name)}
                        className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                          subscribedChannels.includes(channel.name)
                            ? 'bg-white/10 text-white'
                            : 'bg-white text-black hover:bg-gray-200'
                        }`}
                      >
                        {subscribedChannels.includes(channel.name) ? 'Subscribed' : 'Subscribe'}
                      </button>
                    </div>
                  ))}
                  <div className="w-full flex justify-center py-2 text-[#aaaaaa] cursor-pointer hover:text-white transition-colors">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="px-4">
           {/* Replace this block later if the user actually has subscriptions */}
           <h3 className="text-lg font-bold mb-4 mt-6">Latest from Subscriptions</h3>
           {/* If they do have subscriptions, show standard videos or just mock feed */}
           <div className="text-white/60 text-sm">
              Your subscriptions are active. Go back to Home to see videos.
           </div>
        </div>
      )}
    </div>
  );
}
