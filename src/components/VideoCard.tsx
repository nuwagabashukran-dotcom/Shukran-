import React, { useState } from 'react';
import { Video } from '../types';
import { motion } from 'motion/react';
import { CheckCircle2, Clock, Check, MoreVertical } from 'lucide-react';

interface VideoCardProps {
  video: Video;
  onClick: (video: Video) => void;
  onWatchLaterToggle?: (videoId: string) => void;
  isWatchLater?: boolean;
  key?: string | number;
}

export default function VideoCard({ video, onClick, onWatchLaterToggle, isWatchLater }: VideoCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleWatchLaterClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onWatchLaterToggle?.(video.id);
  };

  return (
    <motion.div 
      whileHover={{ y: -8 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="flex flex-col cursor-pointer group relative sm:space-y-3"
      onClick={() => onClick(video)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video sm:rounded-xl overflow-hidden bg-[#181818]">
        <img 
          src={video.thumbnailUrl} 
          alt={video.title}
          className={`w-full h-full object-cover transition-all duration-300 ${isHovered ? 'object-contain delay-300 scale-105' : ''}`}
          referrerPolicy="no-referrer"
        />
        
        {/* Hover Controls */}
        <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={handleWatchLaterClick}
            className={`p-1 rounded bg-black/80 text-white hover:bg-black transition-colors ${isWatchLater ? 'text-blue-400' : ''}`}
            title={isWatchLater ? "Remove from Watch Later" : "Add to Watch Later"}
          >
            {isWatchLater ? <Check className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
          </button>
        </div>

        <div className={`absolute bottom-1 right-1 bg-black/80 text-[#FFF] text-[12px] font-medium px-1 rounded transition-opacity ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
          {video.duration}
        </div>
        {video.isLive && (
          <div className={`absolute top-2 left-2 bg-[#CC0000] text-white text-[12px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 transition-opacity ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
            LIVE
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex gap-3 px-3 sm:px-0 pb-4 sm:pb-0 pr-6 relative">
        <img 
          src={video.channelAvatar} 
          alt={video.channelName}
          className="w-[36px] h-[36px] mt-0.5 rounded-full object-cover shrink-0"
          referrerPolicy="no-referrer"
        />
        <div className="flex flex-col overflow-hidden w-full">
          <h3 className="text-[16px] font-medium leading-[22px] line-clamp-2 text-[#F1F1F1] mb-1">
            {video.title}
          </h3>
          <div className="flex flex-col">
            <div className="flex items-center gap-1 text-[#AAAAAA] text-[14px] leading-[20px] hover:text-[#F1F1F1] transition-colors">
              <span className="truncate">{video.channelName}</span>
              <CheckCircle2 className="w-[14px] h-[14px] fill-current shrink-0" />
            </div>
            <div className="text-[#AAAAAA] text-[14px] leading-[20px] truncate">
              {video.views} • {video.postedAt}
            </div>
          </div>
        </div>

        <button 
          className="absolute right-0 top-0.5 p-1.5 opacity-0 group-hover:opacity-100 active:bg-white/10 rounded-full text-white/100 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            /* Add menu logically later if requested, just UI visual for now mapping Youtube */
          }}
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );
}
