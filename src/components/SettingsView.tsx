import { 
  Settings, UserCircle, Users, Languages, BarChart3, Bell, Tag, CreditCard, 
  History, ShieldCheck, Lock, Link2, FlaskConical, Monitor, Play, 
  Subtitles, Sliders, Download, Radio, Accessibility, Tv, HelpCircle, 
  FileText, MessageSquare, Info, ChevronLeft, Mail, Phone, User, School, Shield,
  Check, ChevronRight, LogOut, ChevronDown, Sparkle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import React, { useState } from 'react';

interface SettingsViewProps {
  onBack?: () => void;
  settings: {
    dataSaving: boolean;
    notifications: boolean;
    autoplay: boolean;
    captions: boolean;
    quality: string;
    language: string;
    restrictedMode: boolean;
  };
  onUpdateSettings: (newSettings: any) => void;
}

type SubMenuType = 'main' | 'language' | 'quality';

export default function SettingsView({ onBack, settings, onUpdateSettings }: SettingsViewProps) {
  const [currentView, setCurrentView] = useState<SubMenuType>('main');
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    'Account': true,
    'Video and audio preferences': true,
    'Privacy & Security': true,
    'Help and policy': false
  });

  const [toast, setToast] = useState<string | null>(null);

  const toggleSection = (title: string) => {
    setOpenSections(prev => ({ ...prev, [title]: !prev[title] }));
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2000);
  };

  const toggleSetting = (key: keyof SettingsViewProps['settings']) => {
    const newVal = !settings[key];
    const label = String(key).charAt(0).toUpperCase() + String(key).slice(1).replace(/([A-Z])/g, ' $1');
    onUpdateSettings({ [key]: newVal });
    showToast(`${label} ${newVal ? 'Enabled' : 'Disabled'}`);
  };

  const updateSetting = (key: keyof SettingsViewProps['settings'], value: string) => {
    onUpdateSettings({ [key]: value });
    const label = String(key).charAt(0).toUpperCase() + String(key).slice(1);
    showToast(`${label} set to ${value}`);
    setCurrentView('main');
  };

  const languages = ['English (US)', 'English (UK)', 'Español', 'Français', 'Deutsch', 'Kiswahili', 'Luganda'];
  const qualities = ['Auto', '1080p (HD)', '720p', '480p', '360p', '144p'];

  if (currentView === 'language') {
    return (
      <SubMenu 
        title="Select Language" 
        options={languages} 
        currentValue={settings.language} 
        onSelect={(v) => updateSetting('language', v)} 
        onBack={() => setCurrentView('main')} 
      />
    );
  }

  if (currentView === 'quality') {
    return (
      <SubMenu 
        title="Video Quality" 
        options={qualities} 
        currentValue={settings.quality} 
        onSelect={(v) => updateSetting('quality', v)} 
        onBack={() => setCurrentView('main')} 
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white selection:bg-blue-500/30">
      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 bg-white text-black rounded-2xl text-sm font-bold shadow-2xl shadow-white/10 flex items-center gap-2 border border-white/20 whitespace-nowrap"
          >
            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
              <Check className="w-3 h-3 text-white" />
            </div>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="sticky top-0 z-20 bg-[#0F0F0F]/80 backdrop-blur-md flex items-center justify-between px-4 h-16 border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-2.5 hover:bg-white/10 rounded-2xl transition-all active:scale-95 bg-white/5 ring-1 ring-white/10"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">App Settings</h1>
            <p className="text-[10px] text-white/30 uppercase font-bold tracking-widest leading-none mt-0.5">Control your experience</p>
          </div>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-all font-bold text-sm">
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>

      {/* Profile Summary */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-6 py-10 flex items-center gap-6 bg-gradient-to-b from-blue-600/10 via-transparent to-transparent"
      >
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
          <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-5xl font-black border-4 border-white/10 shadow-2xl relative cursor-pointer ring-1 ring-white/20">
            <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Sparkle className="w-8 h-8 text-white animate-pulse" />
            </div>
            N
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 border-4 border-[#0F0F0F] rounded-full"></div>
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl font-black tracking-tighter leading-none">Nuwagaba Shukran</h2>
            <ShieldCheck className="w-6 h-6 text-blue-500 fill-blue-500/10" />
          </div>
          <p className="text-sm text-white/40 font-medium lowercase flex items-center gap-2">
            nuwagabashukran@gmail.com
            <span className="w-1 h-1 bg-white/20 rounded-full" />
            Verified Profile
          </p>
          <div className="flex items-center gap-2 mt-4">
            <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-lg shadow-lg shadow-blue-500/20">
              Founder
            </span>
            <span className="px-3 py-1 bg-white/5 text-white/60 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg border border-white/10">
              Premium Build
            </span>
          </div>
        </div>
      </motion.div>

      {/* Settings List */}
      <div className="pb-32 max-w-2xl mx-auto px-4">
        <SettingSection title="Account" isOpen={openSections['Account']} onToggle={() => toggleSection('Account')}>
          <SettingItem icon={Settings} label="General" action={() => showToast('General settings opened')} />
          <SettingItem icon={UserCircle} label="Switch or manage account" action={() => showToast('Account switcher opened')} />
          <SettingItem icon={Users} label="Family Center" subtext="Manage permissions and restrictions" action={() => showToast('Family center opened')} />
          <SettingItem icon={Languages} label="Languages" value={settings.language} action={() => setCurrentView('language')} />
          <SettingItem icon={BarChart3} label="Time management" action={() => showToast('Time management view opened')} />
          <SettingItem icon={Bell} label="Notifications" isToggle active={settings.notifications} onToggle={() => toggleSetting('notifications')} />
          <SettingItem icon={Tag} label="Purchases and memberships" action={() => showToast('Redirecting to memberships...')} />
          <SettingItem icon={CreditCard} label="Billing & payments" action={() => showToast('Billing options loaded')} />
        </SettingSection>

        <SettingSection title="Video and audio preferences" isOpen={openSections['Video and audio preferences']} onToggle={() => toggleSection('Video and audio preferences')}>
          <SettingItem icon={Monitor} label="Quality" value={settings.quality} action={() => setCurrentView('quality')} />
          <SettingItem icon={Play} label="Playback" value={settings.autoplay ? 'Autoplay On' : 'Autoplay Off'} action={() => toggleSetting('autoplay')} />
          <SettingItem icon={Subtitles} label="Captions" isToggle active={settings.captions} onToggle={() => toggleSetting('captions')} />
          <SettingItem icon={Sliders} label="Data saving" isToggle active={settings.dataSaving} onToggle={() => toggleSetting('dataSaving')} />
          <SettingItem icon={Download} label="Downloads" action={() => showToast('Download preferences opened')} />
          <SettingItem icon={Radio} label="Live chat" action={() => showToast('Live chat settings opened')} />
          <SettingItem icon={Accessibility} label="Accessibility" action={() => showToast('Accessibility options opened')} />
          <SettingItem icon={Tv} label="Watch on TV" action={() => showToast('Scanning for devices...')} />
        </SettingSection>

        <SettingSection title="Privacy & Security" isOpen={openSections['Privacy & Security']} onToggle={() => toggleSection('Privacy & Security')}>
          <SettingItem icon={ShieldCheck} label="Your data in Shazam" action={() => showToast('Privacy dashboard opened')} />
          <SettingItem icon={Lock} label="Privacy" subtext="Control visibility and access" action={() => showToast('Privacy settings opened')} />
          <SettingItem icon={Shield} label="Restricted Mode" subtext="Hide potentially mature content" isToggle active={settings.restrictedMode} onToggle={() => toggleSetting('restrictedMode')} />
          <SettingItem icon={History} label="Manage all history" action={() => showToast('History management ready')} />
          <SettingItem icon={Link2} label="Connected apps" action={() => showToast('App connections loaded')} />
          <SettingItem icon={FlaskConical} label="Try experimental new features" action={() => showToast('Lab features loaded')} />
        </SettingSection>

        <SettingSection title="Help and policy" isOpen={openSections['Help and policy']} onToggle={() => toggleSection('Help and policy')}>
          <SettingItem icon={HelpCircle} label="Help" action={() => showToast('Help center loaded')} />
          <SettingItem icon={FileText} label="Shazam Terms of Service" action={() => showToast('Terms document opened')} />
          <SettingItem icon={MessageSquare} label="Send feedback" action={() => showToast('Feedback form sent')} />
          <SettingItem icon={Info} label="About" action={() => showToast('About Shazam v1.2.0')} />
        </SettingSection>

        {/* Developer Footer */}
        <div className="mt-16">
          <div className="bg-[#121212] rounded-[3.rem] p-10 border border-white/5 border-t-white/10 shadow-2xl relative overflow-hidden group ring-1 ring-white/5">
            <motion.div 
              animate={{ 
                scale: [1, 1.4, 1],
                opacity: [0.05, 0.15, 0.05]
              }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600 blur-[120px] rounded-full pointer-events-none"
            ></motion.div>
            
            <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
              <h2 className="text-xl font-black uppercase tracking-[0.4em] text-white/30">
                The Architect
              </h2>
              <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                <Sparkle className="w-6 h-6 text-blue-500 fill-blue-500/20" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
              <DeveloperCard icon={User} label="Developer" value="Nuwagaba Shukran" sub="Lead Engineer" />
              <DeveloperCard icon={Mail} label="Contact" value="nuwagabashukran@gmail.com" sub="Direct Email" />
              <DeveloperCard icon={Phone} label="Hotline" value="+256 747106281" sub="Office Line" />
              <DeveloperCard icon={School} label="Center" value="Aggrey Memorial" sub="Innovation Hub" />
            </div>

            <div className="mt-16 pt-10 border-t border-white/5 flex flex-col items-center gap-8">
              <div className="flex items-center gap-4 group cursor-pointer transition-transform hover:scale-110 duration-500">
                <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/30">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-3xl font-black italic tracking-tighter text-white leading-none">SHAZAM</span>
                  <span className="text-[10px] font-black tracking-[0.4em] text-blue-500/80 uppercase ml-1">OS V1.2.0</span>
                </div>
              </div>

              <div className="flex flex-col items-center gap-2">
                <p className="text-[9px] text-white/10 uppercase tracking-[0.8em] font-black text-center">
                  DEVELOPED FOR EXCELLENCE • AGGREY MEMORIAL SCHOOL
                </p>
                <div className="w-48 h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ x: '-100%' }}
                    animate={{ x: '100%' }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    className="w-1/3 h-full bg-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SubMenu({ title, options, currentValue, onSelect, onBack }: { 
  title: string, 
  options: string[], 
  currentValue: string, 
  onSelect: (v: string) => void, 
  onBack: () => void 
}) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="min-h-screen bg-[#0F0F0F] text-white"
    >
      <div className="sticky top-0 z-20 bg-[#0F0F0F] flex items-center gap-4 px-4 h-16 border-b border-white/5">
        <button onClick={onBack} className="p-2.5 hover:bg-white/10 rounded-2xl bg-white/5">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">{title}</h1>
      </div>
      <div className="p-6 space-y-3">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onSelect(opt)}
            className="w-full flex items-center justify-between p-5 bg-[#121212] rounded-3xl hover:bg-white/5 transition-all border border-white/5 group"
          >
            <span className={`font-black tracking-tight ${currentValue === opt ? 'text-blue-500' : 'text-white/40'}`}>
              {opt}
            </span>
            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${currentValue === opt ? 'bg-blue-500 border-blue-500' : 'border-white/10'}`}>
              {currentValue === opt && <Check className="w-4 h-4 text-white" />}
            </div>
          </button>
        ))}
      </div>
    </motion.div>
  );
}

function SettingSection({ title, children, isOpen, onToggle }: { title: string, children: React.ReactNode, isOpen: boolean, onToggle: () => void }) {
  return (
    <div className="mt-12 mb-2">
      <button 
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 mb-4 group"
      >
        <h2 className="text-[12px] font-black text-white/20 uppercase tracking-[0.3em] group-hover:text-white/40 transition-colors">
          {title}
        </h2>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="p-1 px-2.5 rounded-lg bg-white/5 border border-white/5"
        >
          <ChevronDown className="w-3 h-3 text-white/30" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden bg-[#121212] rounded-[2.5rem] border border-white/[0.04] shadow-3xl"
          >
            <div className="divide-y divide-white/[0.02]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SettingItem({ icon: Icon, label, subtext, value, isToggle, active, onToggle, action }: any) {
  return (
    <button
      onClick={isToggle ? onToggle : action}
      className="w-full flex items-center justify-between px-6 py-6 hover:bg-white/[0.03] transition-all group text-left"
    >
      <div className="flex items-center gap-5">
        <div className="w-12 h-12 rounded-2xl bg-white/[0.05] flex items-center justify-center group-hover:bg-blue-600 transition-all shadow-xl group-hover:shadow-blue-600/20">
          <Icon className="w-6 h-6 text-white/40 group-hover:text-white transition-colors" />
        </div>
        <div className="flex flex-col">
          <span className="text-[16px] font-bold text-white/80 group-hover:text-white transition-colors">
            {label}
          </span>
          {(subtext || value) && (
            <div className="flex items-center gap-2 mt-0.5">
              {subtext && <span className="text-[11px] text-white/30 font-medium">{subtext}</span>}
              {subtext && value && <span className="w-1 h-1 bg-white/10 rounded-full" />}
              {value && <span className="text-[11px] text-blue-500 font-bold uppercase tracking-widest">{value}</span>}
            </div>
          )}
        </div>
      </div>
      
      {isToggle ? (
        <div className={`w-12 h-7 rounded-full relative transition-all duration-500 cursor-pointer ${active ? 'bg-blue-600' : 'bg-white/10'}`}>
          <motion.div 
            animate={{ x: active ? 24 : 4 }}
            className="absolute top-1.5 w-4 h-4 bg-white rounded-full shadow-2xl"
          />
        </div>
      ) : (
        <div className="w-8 h-8 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all group-hover:translate-x-1">
          <ChevronRight className="w-4 h-4 text-white/40" />
        </div>
      )}
    </button>
  );
}

function DeveloperCard({ icon: Icon, label, value, sub }: any) {
  return (
    <div className="flex items-center gap-6 group cursor-default">
      <div className="w-14 h-14 rounded-3xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-all group-hover:bg-blue-600/10 group-hover:border-blue-500/20">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>
      <div className="flex flex-col min-w-0">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-1 group-hover:text-blue-500/50 transition-colors">{label}</p>
        <p className="text-[15px] font-bold text-white truncate leading-none mb-1">
          {value}
        </p>
        <p className="text-[9px] font-bold text-white/20 uppercase tracking-widest">{sub}</p>
      </div>
    </div>
  );
}
