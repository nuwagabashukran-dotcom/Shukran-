import { useState } from 'react';
import { Video } from '../types';
import { ThumbsUp, ThumbsDown, Share2, Download, MoreHorizontal, Bell, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface VideoPlayerProps {
  video: Video;
  relatedVideos: Video[];
  onVideoClick: (video: Video) => void;
  isLiked: boolean;
  onLikeToggle: (videoId: string) => void;
  isSubscribed: boolean;
  onSubscribeToggle: (channelName: string) => void;
  isWatchLater: boolean;
  onWatchLaterToggle: (videoId: string) => void;
  autoplay?: boolean;
  captions?: boolean;
}

export default function VideoPlayer({ 
  video, 
  relatedVideos, 
  onVideoClick, 
  isLiked, 
  onLikeToggle, 
  isSubscribed, 
  onSubscribeToggle,
  isWatchLater,
  onWatchLaterToggle,
  autoplay = true,
  captions = false
}: VideoPlayerProps) {
  const [cinemaMode, setCinemaMode] = useState(false);

  return (
    <div className={`flex flex-col lg:flex-row gap-6 p-4 lg:p-6 max-w-[1700px] mx-auto mt-14 transition-all duration-700 ${cinemaMode ? 'bg-black/40 rounded-3xl' : ''}`}>
      {/* Primary Content */}
      <div className="flex-1 min-w-0">
        <div className={`aspect-video w-full rounded-xl overflow-hidden bg-black relative group shadow-2xl transition-all duration-500 ${cinemaMode ? 'scale-[1.02] shadow-blue-500/10' : ''}`}>
          <video 
            src={video.videoUrl} 
            className="w-full h-full object-contain"
            controls
            autoPlay={autoplay}
            poster={video.thumbnailUrl}
          />
          {captions && (
            <div className="absolute bottom-16 left-0 right-0 flex justify-center pointer-events-none">
              <div className="bg-black/80 backdrop-blur-sm px-4 py-2 rounded-xl text-white text-sm font-medium border border-white/10">
                [ Captions Active ]
              </div>
            </div>
          )}
          <button 
            onClick={() => setCinemaMode(!cinemaMode)}
            className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-black rounded-lg opacity-0 group-hover:opacity-100 transition-opacity text-[10px] uppercase font-bold tracking-widest"
          >
            {cinemaMode ? 'Exit Cinema' : 'Cinema Mode'}
          </button>
        </div>

        <div className="mt-4">
          <h1 className="text-xl font-bold tracking-tight leading-tight text-white">{video.title}</h1>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-3 pb-4">
            <div className="flex items-center gap-3">
              <img 
                src={video.channelAvatar} 
                alt={video.channelName} 
                className="w-10 h-10 rounded-full object-cover shrink-0 ring-2 ring-white/5"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-base text-white whitespace-nowrap truncate">{video.channelName}</span>
                <span className="text-[12px] text-[#AAAAAA] whitespace-nowrap">{video.subscriberCount} subscribers</span>
              </div>
              <button 
                onClick={() => onSubscribeToggle(video.channelName)}
                className={`px-4 py-2 rounded-full font-bold text-sm ml-3 transition-all active:scale-95
                  ${isSubscribed 
                    ? 'bg-[#272727] text-white hover:bg-[#3f3f3f]' 
                    : 'bg-white text-black hover:bg-[#d9d9d9]'}`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap no-scrollbar">
              <div className="flex items-center bg-[#272727] rounded-full overflow-hidden border border-white/5 shadow-lg">
                <button 
                  onClick={() => onLikeToggle(video.id)}
                  className={`flex items-center gap-2 px-4 py-2 hover:bg-[#3f3f3f] border-r border-white/10 transition-colors
                    ${isLiked ? 'text-blue-400' : 'text-white/90'}`}
                >
                  <ThumbsUp className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span className="text-sm font-bold">1.2K</span>
                </button>
                <button className="px-4 py-2 hover:bg-[#3f3f3f] transition-colors text-white/90">
                  <ThumbsDown className="w-5 h-5" />
                </button>
              </div>
              
              <button 
                onClick={() => onWatchLaterToggle(video.id)}
                className={`flex items-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#3f3f3f] rounded-full transition-all border border-white/5
                  ${isWatchLater ? 'text-blue-400' : 'text-white'}`}
              >
                <Clock className={`w-5 h-5 ${isWatchLater ? 'fill-current text-blue-400' : ''}`} />
                <span className="text-sm font-bold">Later</span>
              </button>

              <button className="flex items-center gap-2 px-4 py-2 bg-[#272727] hover:bg-[#3f3f3f] rounded-full transition-all border border-white/5">
                <Share2 className="w-5 h-5 text-white" />
                <span className="text-sm font-bold">Share</span>
              </button>
              
              <button className="p-2 bg-[#272727] hover:bg-[#3f3f3f] rounded-full transition-all border border-white/5">
                <MoreHorizontal className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>

          <div className="mt-6 p-5 bg-white/5 rounded-2xl border border-white/5">
            <div className="flex gap-4 text-sm font-black">
              <span>{video.views}</span>
              <span>{video.postedAt}</span>
            </div>
            <p className="mt-3 text-sm text-white/70 whitespace-pre-wrap leading-relaxed">
              {video.description}
            </p>
            <button className="mt-3 text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors">
              Show more
            </button>
          </div>
        </div>
      </div>

      {/* Suggested Videos */}
      <div className="lg:w-[400px] flex flex-col gap-4">
        <h2 className="text-sm font-bold text-white/40 uppercase tracking-widest px-1 mb-1">Up Next</h2>
        {relatedVideos.map((suggested) => (
          <motion.div 
            key={suggested.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-4 cursor-pointer group"
            onClick={() => onVideoClick(suggested)}
          >
            <div className="relative w-44 aspect-video rounded-xl overflow-hidden bg-white/5 border border-white/5 shrink-0">
              <img 
                src={suggested.thumbnailUrl} 
                alt={suggested.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-[10px] font-bold px-1 rounded">
                {suggested.duration}
              </div>
            </div>
            <div className="flex flex-col min-w-0">
              <h3 className="text-[13px] font-medium line-clamp-2 leading-snug text-white">
                {suggested.title}
              </h3>
              <div className="mt-1 flex flex-col">
                <span className="text-[12px] text-[#AAAAAA] hover:text-white transition-colors">
                  {suggested.channelName}
                </span>
                <span className="text-[12px] text-[#AAAAAA]">
                  {suggested.views} • {suggested.postedAt}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
