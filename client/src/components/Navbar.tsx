import React, { useState } from 'react';
import { 
  Repeat, Sparkles, Inbox, Mail, User, ChevronDown, PlusCircle, 
  GraduationCap, CheckCircle, LogIn, ArrowUpRight, Sun, Moon, Database, ShieldCheck 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Student } from '../types';
import { useTheme } from '../context/ThemeContext';

interface NavbarProps {
  currentTab: 'explore' | 'matchmaker' | 'exchanges' | 'gmail' | 'profile';
  setCurrentTab: (tab: 'explore' | 'matchmaker' | 'exchanges' | 'gmail' | 'profile') => void;
  currentUser: Student | null;
  students: Student[];
  onSelectCurrentUser: (student: Student) => void;
  onOpenEditProfile: () => void;
  onOpenRegister: () => void;
  onOpenAuth: () => void;
  pendingRequestsCount: number;
  mailLogsCount?: number;
  storageMode?: 'mysql' | 'local_demo';
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  currentUser,
  students,
  onSelectCurrentUser,
  onOpenEditProfile,
  onOpenRegister,
  onOpenAuth,
  pendingRequestsCount,
  mailLogsCount = 0,
  storageMode = 'local_demo',
}) => {
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { isDark, toggleTheme } = useTheme();

  interface NavItem {
    id: 'explore' | 'matchmaker' | 'exchanges' | 'gmail' | 'profile';
    label: string;
    icon: React.ComponentType<{ className?: string }> | null;
    badge?: string;
    count?: number;
    iconColor?: string;
  }

  const navItems: NavItem[] = [
    { id: 'explore', label: 'Explore Skills', icon: null },
    { id: 'matchmaker', label: 'AI Smart Skill Maker', icon: Sparkles, badge: 'Smart Match' },
    { id: 'exchanges', label: 'My swaps', icon: Inbox, count: pendingRequestsCount },
    { id: 'gmail', label: 'Mail log', icon: Mail, iconColor: 'text-red-500', count: mailLogsCount > 0 ? mailLogsCount : undefined },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-b border-slate-200/80 dark:border-slate-800 shadow-2xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo with 3D Hover Ring */}
          <div 
            onClick={() => setCurrentTab('explore')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 group-hover:rotate-6 transition-all duration-300">
              <Repeat className="w-5 h-5 transition-transform group-hover:rotate-180 duration-500" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-600 dark:from-amber-400 dark:via-orange-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  SkillSwap
                </span>
                <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shadow-2xs">
                  ₹ Peer-to-Peer
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium hidden sm:block">
                Campus Skill Exchange & ₹/hr Mentoring
              </p>
            </div>
          </div>

          {/* Center Navigation Links with Animated Floating Glide Pill */}
          <nav className="hidden md:flex items-center gap-1 p-1 bg-slate-100/90 dark:bg-slate-800/90 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`relative px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 ${
                    isActive ? 'text-white' : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {/* Active sliding background pill */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavPill"
                      className="absolute inset-0 bg-slate-900 dark:bg-amber-500 rounded-xl shadow-md"
                      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                    />
                  )}

                  <span className="relative z-10 flex items-center gap-1.5">
                    {Icon && <Icon className={`w-3.5 h-3.5 ${item.iconColor || (isActive ? 'text-white dark:text-slate-950' : 'text-slate-500 dark:text-slate-400')}`} />}
                    <span className={isActive ? 'dark:text-slate-950' : ''}>{item.label}</span>

                    {item.badge && (
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.2 rounded-md ${
                        isActive ? 'bg-amber-400 text-slate-950' : 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
                      }`}>
                        {item.badge}
                      </span>
                    )}

                    {item.count && item.count > 0 ? (
                      <span className="w-4 h-4 text-[10px] bg-red-500 text-white rounded-full flex items-center justify-center font-extrabold animate-pulse">
                        {item.count}
                      </span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </nav>

          {/* Right Action: Theme Toggle, Storage Badge, Current User Switcher & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Light / Dark Mode Toggle with 🌙/☀️ controls */}
            <button
              type="button"
              onClick={toggleTheme}
              className="p-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-amber-400 hover:bg-slate-50 dark:hover:bg-slate-700 shadow-2xs transition-transform active:scale-90"
              title={isDark ? 'Switch to Light Mode ☀️' : 'Switch to Dark Mode 🌙'}
              aria-label="Toggle theme"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in zoom-in-75 duration-200" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 animate-in zoom-in-75 duration-200" />
              )}
            </button>

            {/* Storage Mode Badge */}
            <span
              className={`hidden lg:inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full border shadow-2xs ${
                storageMode === 'mysql'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800'
              }`}
              title={
                storageMode === 'mysql'
                  ? 'MySQL Database Active'
                  : 'Persistent Local Demo Mode (server/data/db.json)'
              }
            >
              <Database className="w-3 h-3" />
              <span>{storageMode === 'mysql' ? 'MySQL Active' : 'Local Persistent'}</span>
            </span>

            {/* User Dropdown */}
            {currentUser ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-600 bg-white/90 dark:bg-slate-800 shadow-2xs transition-all text-left group"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-xl object-cover ring-2 ring-amber-500/20 group-hover:ring-amber-500/50 transition-all"
                  />
                  <div className="hidden sm:block">
                    <div className="flex items-center gap-1">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-none">
                        {currentUser.name}
                      </span>
                      {currentUser.verifiedStudent && (
                        <CheckCircle className="w-3 h-3 text-amber-500 inline" />
                      )}
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-extrabold block leading-tight mt-0.5 truncate max-w-[120px]">
                      ● Active Student
                    </span>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400 hidden sm:block group-hover:rotate-180 transition-transform" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-3">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-2xl object-cover ring-2 ring-amber-500/30"
                      />
                      <div className="truncate">
                        <span className="text-xs font-extrabold text-slate-900 dark:text-white block truncate">
                          {currentUser.name}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                          {currentUser.university}
                        </span>
                        <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold block">
                          Rate: {currentUser.hourlyRate > 0 ? `₹${currentUser.hourlyRate}/hr` : 'Free Barter'}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        type="button"
                        onClick={() => {
                          setCurrentTab('profile');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                      >
                        <span className="flex items-center gap-2">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                          View My Profile & Skills
                        </span>
                        <ArrowUpRight className="w-3 h-3 text-slate-400" />
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onOpenEditProfile();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-slate-500" />
                        Edit Profile & Rates
                      </button>
                    </div>

                    {/* Switch accounts */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-3 block mb-1">
                        Switch Active Student Profile:
                      </span>
                      <div className="max-h-40 overflow-y-auto space-y-0.5">
                        {students.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => {
                              onSelectCurrentUser(s);
                              setUserDropdownOpen(false);
                            }}
                            className={`w-full text-left px-3 py-1.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                              s.id === currentUser.id
                                ? 'bg-amber-50 dark:bg-amber-950/60 font-bold text-amber-900 dark:text-amber-300'
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span className="truncate">{s.name} ({s.university.split(' ')[0]})</span>
                            {s.id === currentUser.id && (
                              <CheckCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          onOpenAuth();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60 flex items-center gap-2"
                      >
                        <LogIn className="w-3.5 h-3.5" />
                        Switch / Login Other Email
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenAuth}
                className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs px-4 py-2 rounded-xl shadow-sm transition-all"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Join / Sign In</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
