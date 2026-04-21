import { Home, PlaySquare, Users, History, Clock, ThumbsUp, Library, Flame, Music2, Gamepad2, Trophy, Settings, Flag, HelpCircle, MessageSquare, User } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  selectedTab: string;
  onTabChange: (tab: string) => void;
}

const SIDEBAR_ITEMS = [
  { group: '', items: [
    { icon: Home, label: 'Home', id: 'home' },
    { icon: PlaySquare, label: 'Shorts', id: 'shorts' },
    { icon: Users, label: 'Subscriptions', id: 'subscriptions' },
    { icon: User, label: 'You', id: 'you' },
  ]},
  { group: 'Explore', items: [
    { icon: Flame, label: 'Trending', id: 'trending' },
    { icon: Music2, label: 'Music', id: 'music' },
    { icon: Gamepad2, label: 'Gaming', id: 'gaming' },
  ]},
  { group: '', items: [
    { icon: Settings, label: 'Settings', id: 'settings' },
    { icon: HelpCircle, label: 'Help', id: 'help' },
  ]}
];

export default function Sidebar({ isOpen, selectedTab, onTabChange }: SidebarProps) {
  if (!isOpen) {
    return (
      <aside className="fixed left-0 top-14 bottom-0 w-[72px] bg-[#0F0F0F] z-40 flex flex-col items-center py-1 hidden sm:flex">
        {SIDEBAR_ITEMS[0].items.map((item) => (
          <button 
            key={item.id} 
            onClick={() => onTabChange(item.id)}
            className={`w-[64px] h-[74px] flex flex-col items-center justify-center rounded-lg transition-all 
              ${selectedTab === item.id ? 'text-[#F1F1F1] bg-[#272727]' : 'text-[#F1F1F1] hover:bg-[#272727]'}`}
          >
            <item.icon className="w-6 h-6 stroke-[1.5] mb-1" />
            <span className="text-[10px] tracking-tight truncate w-full px-1">{item.label}</span>
          </button>
        ))}
      </aside>
    );
  }

  return (
    <aside className="fixed left-0 top-14 bottom-0 w-[240px] bg-[#0F0F0F] z-[60] overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-hide">
      {SIDEBAR_ITEMS.map((group, idx) => (
        <div key={idx} className="pb-3 mb-3 border-b border-[#3F3F3F] last:border-0 last:mb-0 last:pb-0">
          {group.group && <h3 className="px-3 mb-1 font-semibold text-[16px] text-[#F1F1F1] leading-6 tracking-tight">{group.group}</h3>}
          <div className="space-y-0.5 mt-1">
            {group.items.map((item) => (
              <button 
                key={item.id} 
                onClick={() => onTabChange(item.id)}
                className={`w-full flex items-center space-x-5 px-3 h-10 rounded-lg transition-all text-[14px]
                  ${selectedTab === item.id 
                    ? 'bg-[#272727] text-[#F1F1F1] font-medium' 
                    : 'text-[#F1F1F1] hover:bg-[#272727]'}`}
              >
                <item.icon className={`w-6 h-6 stroke-[1.5] ${selectedTab === item.id ? 'fill-current' : ''}`} />
                <span className="flex-1 text-left truncate">{item.label}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </aside>
  );
}
