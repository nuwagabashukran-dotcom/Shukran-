import { motion, AnimatePresence } from 'motion/react';
import { X, Upload, Film, Music, Globe, Lock, AlertCircle } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish?: (videoData: { title: string, description: string, fileName: string }) => void;
}

export default function UploadModal({ isOpen, onClose, onPublish }: UploadModalProps) {
  const [step, setStep] = useState(1);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState('');
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-fill title based on selected file name
  useEffect(() => {
    if (selectedFileName && !title) {
      setTitle(selectedFileName.split('.')[0] || 'My Amazing Content');
    }
  }, [selectedFileName]);

  const handleUploadClick = () => {
    // Trigger the hidden file input natively
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      setIsUploading(true);
      
      // Simulate processing time
      setTimeout(() => {
        setIsUploading(false);
        setStep(2);
      }, 2000);
    }
  };

  const resetModal = () => {
    setStep(1);
    setSelectedFileName('');
    setTitle('');
    setDescription('');
    onClose();
  };

  const handlePublishClick = () => {
    if (onPublish) {
      onPublish({ title, description, fileName: selectedFileName });
    } else {
      alert("Published beautifully! Your file is live.");
    }
    resetModal();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-[#282828] rounded-2xl shadow-2xl overflow-hidden border border-white/10"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h2 className="text-xl font-bold">Upload an asset</h2>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-10">
              {step === 1 ? (
                <div className="flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-[#1f1f1f] rounded-full flex items-center justify-center border-2 border-dashed border-white/20">
                    <Upload className={`w-10 h-10 text-white/40 ${isUploading ? 'animate-bounce' : ''}`} />
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-medium mb-2">Select files to upload</h3>
                    <p className="text-sm text-white/50">Choose videos, photos, or movies from your device.</p>
                  </div>

                  {/* Hidden file input */}
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept="video/*,image/*" 
                    onChange={handleFileChange} 
                  />

                  <button 
                    onClick={handleUploadClick}
                    disabled={isUploading}
                    className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-white/10 text-white rounded-full font-bold transition-all uppercase tracking-wider text-xs shadow-lg"
                  >
                    {isUploading ? 'Processing...' : 'Select Files'}
                  </button>

                  <div className="pt-10 grid grid-cols-3 gap-8 w-full max-w-md opacity-30 grayscale">
                    <div className="flex flex-col items-center gap-2">
                      <Film className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase">Video</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 text-blue-400 opacity-100 grayscale-0">
                      <Music className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase">Audio</span>
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <Globe className="w-5 h-5" />
                      <span className="text-[10px] font-bold uppercase">Privacy</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                         ✓
                      </motion.div>
                    </div>
                    <div className="flex flex-col text-left">
                      <p className="text-sm font-medium text-green-400">File successfully uploaded and processed!</p>
                      <p className="text-xs text-white/50">{selectedFileName}</p>
                    </div>
                  </div>

                  <div className="space-y-4 text-left">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Title (required)</label>
                      <input 
                        type="text" 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-white/40 uppercase">Description</label>
                      <textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-[#121212] border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:border-blue-500 transition-all h-24 resize-none"
                        placeholder="Tell viewers about your post"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-4">
                    <button 
                      onClick={resetModal}
                      className="px-6 py-2 rounded-full font-bold text-sm hover:bg-white/5 transition-all text-white/60"
                    >
                      Save as Draft
                    </button>
                    <button 
                      onClick={handlePublishClick}
                      className="px-8 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-full font-bold transition-all text-sm"
                    >
                      Publish
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-[#1f1f1f] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-white/40" />
              <p className="text-[10px] text-white/40">
                By submitting your videos, photos, or movies to Shazam, you acknowledge that you agree to Shazam's Terms of Service and Community Guidelines.
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
