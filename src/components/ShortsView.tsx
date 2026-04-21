import { motion } from 'motion/react';
import { ThumbsUp, ThumbsDown, MessageSquare, Share2, MoreVertical, Music2 } from 'lucide-react';
import { Video } from '../types';
import React, { useRef, useEffect, useState } from 'react';

interface ShortsViewProps {
  shorts: Video[];
  likedVideoIds: string[];
  subscribedChannels: string[];
  onLikeToggle: (id: string) => void;
  onSubscribeToggle: (name: string) => void;
}

const ShortVideo: React.FC<{ 
  short: Video; 
  isLiked: boolean; 
  isSubscribed: boolean; 
  onLikeToggle: (id: string) => void; 
  onSubscribeToggle: (name: string) => void; 
}> = ({ 
  short, 
  isLiked, 
  isSubscribed, 
  onLikeToggle, 
  onSubscribeToggle 
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          videoRef.current?.play().catch(e => console.error("Auto-play blocked:", e));
          setIsPlaying(true);
        } else {
          videoRef.current?.pause();
          setIsPlaying(false);
          // Optional: reset video to start
          if (videoRef.current) {
             videoRef.current.currentTime = 0;
          }
        }
      },
      { threshold: 0.6 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play().catch(e => console.error("Play error:", e));
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="h-full min-h-[calc(100vh-56px)] w-full snap-start relative flex items-center justify-center bg-[#0f0f0f] sm:py-4 pt-0">
      <div className="relative h-full w-full sm:max-w-[450px] sm:max-h-[850px] sm:rounded-2xl overflow-hidden bg-black shadow-2xl">
        <video 
          ref={videoRef}
          src={short.videoUrl} 
          className="w-full h-full object-cover cursor-pointer"
          loop
          playsInline
          onClick={togglePlay}
          poster={short.thumbnailUrl}
        />
        
        {/* Play/Pause Overlay Indicator (visible only when paused) */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-16 h-16 bg-black/40 rounded-full flex items-center justify-center backdrop-blur-md">
               <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
            </div>
          </div>
        )}

        {/* Bottom Overlay Info */}
        <div className="absolute bottom-[56px] sm:bottom-0 left-0 right-16 p-4 pt-32 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none">
          <div className="flex flex-col gap-3 pointer-events-auto">
            <div className="flex items-center gap-3">
              <img src={short.channelAvatar} className="w-9 h-9 rounded-full object-cover border border-white/10" alt="" referrerPolicy="no-referrer" />
              <span className="font-semibold text-white text-[15px]">@{short.channelName}</span>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onSubscribeToggle(short.channelName);
                }}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  isSubscribed ? 'bg-white/20 text-white hover:bg-white/30' : 'bg-white text-black hover:bg-gray-200'
                }`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>
            <p className="text-[15px] text-white font-normal line-clamp-2 leading-snug drop-shadow-md">{short.title}</p>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <Music2 className="w-4 h-4" />
              <span className="whitespace-nowrap overflow-hidden">Original Sound - {short.channelName}</span>
            </div>
          </div>
        </div>

        {/* Action Sidebar (Bottom Right) */}
        <div className="absolute right-2 bottom-[72px] sm:bottom-4 flex flex-col gap-5 items-center pb-2 pointer-events-auto">
          <div 
            onClick={(e) => {
              e.stopPropagation();
              onLikeToggle(short.id);
            }}
            className="flex flex-col items-center gap-1.5 group cursor-pointer"
          >
            <motion.div 
              whileTap={{ scale: 0.8 }}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isLiked ? 'text-black bg-white' : 'text-white bg-black/40 hover:bg-black/60'
              } backdrop-blur-md`}
            >
              <ThumbsUp className={`w-6 h-6 ${isLiked ? 'fill-current' : 'fill-current'}`} />
            </motion.div>
            <span className="text-xs font-semibold drop-shadow-md text-white">{isLiked ? 'Liked' : '1.2M'}</span>
          </div>
          
          <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all">
              <ThumbsDown className="w-6 h-6 fill-current" />
            </div>
            <span className="text-xs font-semibold drop-shadow-md text-white">Dislike</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all">
              <MessageSquare className="w-6 h-6 fill-current" />
            </div>
            <span className="text-xs font-semibold drop-shadow-md text-white">4.5K</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all">
              <Share2 className="w-6 h-6 fill-current" />
            </div>
            <span className="text-xs font-semibold drop-shadow-md text-white">Share</span>
          </div>

          <div className="flex flex-col items-center gap-1.5 group cursor-pointer">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white bg-black/40 backdrop-blur-md hover:bg-black/60 transition-all">
              <MoreVertical className="w-6 h-6 fill-current" />
            </div>
          </div>

          <div className="w-10 h-10 rounded-md border-2 border-white overflow-hidden mt-2 flex-shrink-0 relative">
            <div className="absolute inset-0 bg-black/20" />
            <img src={short.channelAvatar} className="w-full h-full object-cover animate-[spin_4s_linear_infinite]" alt="" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ShortsView({ 
  shorts, 
  likedVideoIds, 
  subscribedChannels, 
  onLikeToggle, 
  onSubscribeToggle 
}: ShortsViewProps) {
  return (
    <div className="relative h-[calc(100vh-56px)] sm:h-[calc(100vh-56px)] pb-14 sm:pb-0 bg-[#0f0f0f] w-full flex justify-center">
      <div 
        className="h-full w-full overflow-y-scroll snap-y snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col scroll-smooth"
      >
        {shorts.map((short) => (
          <ShortVideo 
            key={short.id}
            short={short}
            isLiked={likedVideoIds.includes(short.id)}
            isSubscribed={subscribedChannels.includes(short.channelName)}
            onLikeToggle={onLikeToggle}
            onSubscribeToggle={onSubscribeToggle}
          />
        ))}
      </div>
    </div>
  );
}
