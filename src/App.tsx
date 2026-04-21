/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import CategoryBar from './components/CategoryBar';
import VideoCard from './components/VideoCard';
import VideoPlayer from './components/VideoPlayer';
import BottomNav from './components/BottomNav';
import ShortsView from './components/ShortsView';
import SettingsView from './components/SettingsView';
import UploadModal from './components/UploadModal';
import YouView from './components/YouView';
import SubscriptionsView from './components/SubscriptionsView';
import { MOCK_VIDEOS, CATEGORIES } from './data/mock';
import { Video } from './types';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Sparkles, Flame } from 'lucide-react';
import { auth, signInWithGoogle, logOut } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [activeTab, setActiveTab] = useState('home');

  // Personalization & Auth States
  const [user, setUser] = useState<User | null>(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [watchLaterIds, setWatchLaterIds] = useState<string[]>([]);
  const [likedVideoIds, setLikedVideoIds] = useState<string[]>([]);
  const [watchHistoryIds, setWatchHistoryIds] = useState<string[]>([]);
  const [subscribedChannels, setSubscribedChannels] = useState<string[]>([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [customVideos, setCustomVideos] = useState<Video[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsSignedIn(!!currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user' && error?.code !== 'auth/cancelled-popup-request') {
        console.error("Sign-in error:", error);
      }
    }
  };

  const handleUploadClickAction = () => {
    if (isSignedIn) {
      setIsUploadModalOpen(true);
    } else {
      setActiveTab('you');
    }
  };

  const handlePublish = (videoData: { title: string, description: string, fileName: string }) => {
    const newVideo: Video = {
      id: `custom-${Date.now()}`,
      title: videoData.title,
      thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop',
      channelName: user?.displayName || 'Your Channel',
      channelAvatar: user?.photoURL || 'https://picsum.photos/seed/avatar123/200/200',
      views: '0 views',
      postedAt: 'Just now',
      duration: '0:00', // We don't know the exact file duration here ideally but mock it
      category: 'Recent',
    };
    
    setCustomVideos(prev => [newVideo, ...prev]);
  };

  // Global Settings State
  const [appSettings, setAppSettings] = useState({
    dataSaving: false,
    notifications: true,
    autoplay: true,
    captions: false,
    quality: 'Auto',
    language: 'English (US)',
    restrictedMode: false
  });

  const handleUpdateSettings = (newSettings: Partial<typeof appSettings>) => {
    setAppSettings(prev => ({ ...prev, ...newSettings }));
  };

  const handleToggleWatchLater = (videoId: string) => {
    setWatchLaterIds(prev => 
      prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]
    );
  };

  const handleVideoClick = (video: Video) => {
    setSelectedVideo(video);
    setWatchHistoryIds(prev => {
      const newHistory = [video.id, ...prev.filter(id => id !== video.id)];
      return newHistory.slice(0, 50); // Keep last 50
    });
    window.scrollTo(0, 0);
  };

  const allVideos = useMemo(() => [...customVideos, ...MOCK_VIDEOS], [customVideos]);

  const recommendedVideos = useMemo(() => {
    // Basic recommendation logic:
    // 1. Get categories from history and likes
    const historyVideos = allVideos.filter(v => watchHistoryIds.includes(v.id));
    const likedVideos = allVideos.filter(v => likedVideoIds.includes(v.id));
    
    const categoryScores: Record<string, number> = {};
    [...historyVideos, ...likedVideos].forEach(v => {
      categoryScores[v.category] = (categoryScores[v.category] || 0) + 1;
    });

    // 2. Score all videos
    const scored = allVideos.map(video => {
      let score = 0;
      if (video.id.startsWith('custom-')) score += 100; // Always bump custom published videos up high
      // Boost if in preferred category
      score += (categoryScores[video.category] || 0) * 10;
      // Boost if from subscribed channel
      if (subscribedChannels.includes(video.channelName)) score += 50;
      // Penalty if already watched (to show variety)
      if (watchHistoryIds.includes(video.id)) score -= 5;
      
      return { video, score: score + Math.random() * 10 }; // Add noise for variety
    });

    return scored.sort((a, b) => b.score - a.score).map(s => s.video);
  }, [allVideos, watchHistoryIds, likedVideoIds, subscribedChannels]);

  const displayVideos = useMemo(() => {
    let source = recommendedVideos;
    
    if (activeTab === 'watch-later') {
      source = MOCK_VIDEOS.filter(v => watchLaterIds.includes(v.id));
    } else if (activeTab === 'liked') {
      source = MOCK_VIDEOS.filter(v => likedVideoIds.includes(v.id));
    } else if (activeTab === 'history') {
      source = MOCK_VIDEOS.filter(v => watchHistoryIds.includes(v.id));
    } else if (activeTab === 'subscriptions') {
      source = MOCK_VIDEOS.filter(v => subscribedChannels.includes(v.channelName));
    } else if (activeTab === 'shorts') {
      // Simulate shorts as short videos or just a different set
      source = MOCK_VIDEOS.filter(v => v.duration.split(':').length === 2 && parseInt(v.duration.split(':')[0]) < 5);
    } else if (activeTab === 'trending') {
      source = [...MOCK_VIDEOS].sort((a, b) => {
        const getVal = (v: string) => {
          const num = parseFloat(v);
          if (v.includes('M')) return num * 1000000;
          if (v.includes('K')) return num * 1000;
          return num;
        };
        return getVal(b.views) - getVal(a.views);
      });
    }

    return source.filter(video => {
      // Apply Restricted Mode (if enabled, hide videos with certain keywords or categories)
      if (appSettings.restrictedMode) {
        const restrictedKeywords = ['horror', 'scary', 'fight', 'action']; // Example keywords
        const isRestricted = restrictedKeywords.some(keyword => 
          video.title.toLowerCase().includes(keyword) || 
          video.category.toLowerCase().includes(keyword)
        );
        if (isRestricted) return false;
      }

      const matchesCategory = selectedCategoryId === 'all' || video.category === selectedCategoryId;
      const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            video.channelName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [recommendedVideos, activeTab, watchLaterIds, likedVideoIds, watchHistoryIds, selectedCategoryId, searchQuery, appSettings.restrictedMode]);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedVideo(null);
    setSelectedCategoryId('all');
  };

  const handleToggleLike = (videoId: string) => {
    setLikedVideoIds(prev => 
      prev.includes(videoId) ? prev.filter(id => id !== videoId) : [...prev, videoId]
    );
  };

  const handleToggleSubscribe = (channelName: string) => {
    setSubscribedChannels(prev => 
      prev.includes(channelName) ? prev.filter(name => name !== channelName) : [...prev, channelName]
    );
  };

  const handleSurpriseMe = () => {
    const randomVideo = MOCK_VIDEOS[Math.floor(Math.random() * MOCK_VIDEOS.length)];
    handleVideoClick(randomVideo);
  };

  return (
    <div className={`min-h-screen bg-[#0F0F0F] text-white transition-colors duration-300 ${appSettings.dataSaving ? 'grayscale-[0.5]' : ''}`}>
      <div className={`${activeTab === 'you' || activeTab === 'subscriptions' ? 'hidden sm:block' : ''}`}>
        <Navbar 
          onToggleSidebar={handleToggleSidebar} 
          onSearch={setSearchQuery} 
          onUploadClick={handleUploadClickAction}
          isSignedIn={isSignedIn}
          onSignIn={handleSignIn}
          userState={user}
          videos={allVideos}
        />
      </div>
      
      <div className="flex">
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/60 z-[55] sm:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        {!selectedVideo && (
          <Sidebar 
            isOpen={sidebarOpen} 
            selectedTab={activeTab}
            onTabChange={handleTabChange}
          />
        )}

        <main 
          className={`flex-1 transition-all duration-300 pb-[56px] sm:pb-0 ${
            !selectedVideo 
              ? (sidebarOpen ? 'sm:ml-[240px]' : 'sm:ml-[72px]') 
              : 'ml-0'
          }`}
        >
          <AnimatePresence mode="wait">
            {selectedVideo ? (
              <motion.div
                key="player"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
              >
                <VideoPlayer 
                  video={selectedVideo} 
                  relatedVideos={recommendedVideos.filter(v => v.id !== selectedVideo.id).slice(0, 10)}
                  onVideoClick={handleVideoClick}
                  isLiked={likedVideoIds.includes(selectedVideo.id)}
                  onLikeToggle={handleToggleLike}
                  isSubscribed={subscribedChannels.includes(selectedVideo.channelName)}
                  onSubscribeToggle={handleToggleSubscribe}
                  isWatchLater={watchLaterIds.includes(selectedVideo.id)}
                  onWatchLaterToggle={handleToggleWatchLater}
                  autoplay={appSettings.autoplay}
                  captions={appSettings.captions}
                />
              </motion.div>
            ) : (
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={activeTab === 'you' || activeTab === 'subscriptions' ? 'pt-4 sm:pt-14' : 'pt-14'}
              >
                {activeTab !== 'shorts' && activeTab !== 'settings' && activeTab !== 'you' && activeTab !== 'subscriptions' && (
                  <div className="px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {activeTab === 'trending' && (
                        <div className="p-2 bg-orange-500/10 rounded-xl">
                          <Flame className="w-6 h-6 text-orange-500 animate-pulse" />
                        </div>
                      )}
                      <h1 className="text-[20px] font-bold tracking-tight text-white focus:outline-none capitalize">
                        {activeTab === 'home' ? 'Recommended' : 
                         activeTab.replace('-', ' ')}
                      </h1>
                    </div>
                  </div>
                )}

                {activeTab !== 'shorts' && activeTab !== 'settings' && activeTab !== 'you' && activeTab !== 'subscriptions' && (
                  <CategoryBar 
                    categories={CATEGORIES} 
                    selectedCategoryId={selectedCategoryId}
                    onSelectCategory={setSelectedCategoryId}
                  />
                )}
                
                <div className={activeTab === 'shorts' || activeTab === 'settings' || activeTab === 'you' || activeTab === 'subscriptions' ? '' : 'sm:px-6 py-2 sm:py-6 max-w-[1500px] mx-auto'}>
                  {activeTab === 'shorts' ? (
                    <ShortsView 
                      shorts={displayVideos} 
                      likedVideoIds={likedVideoIds}
                      subscribedChannels={subscribedChannels}
                      onLikeToggle={handleToggleLike}
                      onSubscribeToggle={handleToggleSubscribe}
                    />
                  ) : activeTab === 'settings' ? (
                    <SettingsView 
                      onBack={() => handleTabChange('home')} 
                      settings={appSettings}
                      onUpdateSettings={handleUpdateSettings}
                    />
                  ) : activeTab === 'you' ? (
                    <YouView 
                      watchHistoryIds={watchHistoryIds}
                      watchLaterIds={watchLaterIds}
                      likedVideoIds={likedVideoIds}
                      onVideoClick={handleVideoClick}
                      onTabChange={handleTabChange}
                      onWatchLaterToggle={handleToggleWatchLater}
                      isSignedIn={isSignedIn}
                      onSignIn={handleSignIn}
                      userState={user}
                      onSignOut={logOut}
                    />
                  ) : activeTab === 'subscriptions' ? (
                    <SubscriptionsView
                      subscribedChannels={subscribedChannels}
                      displayVideos={displayVideos}
                      onVideoClick={handleVideoClick}
                      onSubscribeToggle={handleToggleSubscribe}
                      onTabChange={handleTabChange}
                    />
                  ) : displayVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-6 sm:gap-y-10 px-0 sm:px-2 md:px-0 auto-rows-max">
                      {displayVideos.slice(0, 8).map((video) => (
                        <VideoCard 
                          key={video.id} 
                          video={video} 
                          onClick={handleVideoClick}
                          onWatchLaterToggle={handleToggleWatchLater}
                          isWatchLater={watchLaterIds.includes(video.id)}
                        />
                      ))}
                      {displayVideos.length > 8 && (
                        <div className="col-span-full py-6 flex justify-center">
                          <button onClick={() => {/* Future implementation */}} className="px-6 py-2 bg-white/5 hover:bg-white/10 rounded-full text-sm font-medium transition-colors">
                            Load more
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-4 border border-white/5">
                        <Clock className="text-white/20 w-10 h-10" />
                      </div>
                      <h2 className="text-xl font-bold">Your list is empty</h2>
                      <p className="text-white/40 mt-2 max-w-xs mx-auto">
                        Start exploring and add videos to your {activeTab.replace('-', ' ')} list to see them here!
                      </p>
                      <button 
                        onClick={() => handleTabChange('home')}
                        className="mt-8 px-8 py-3 bg-white text-black rounded-full font-bold shadow-lg shadow-white/5 hover:bg-white/90 transition-all"
                      >
                        Explore Feed
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <motion.button
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={handleSurpriseMe}
        className="fixed right-6 bottom-20 sm:bottom-6 z-[45] w-14 h-14 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-2xl shadow-xl shadow-blue-500/20 flex items-center justify-center group border border-white/10"
      >
        <Sparkles className="w-6 h-6 text-white group-hover:animate-pulse" />
        <div className="absolute right-full mr-3 px-3 py-1.5 bg-[#282828] border border-white/10 rounded-lg text-xs font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl">
          Surprise Me!
        </div>
      </motion.button>

      <BottomNav 
        selectedTab={activeTab} 
        onTabChange={handleTabChange} 
        onUploadClick={handleUploadClickAction}
        isSignedIn={isSignedIn}
        userState={user}
      />

      <UploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)} 
        onPublish={handlePublish}
      />
    </div>
  );
}
