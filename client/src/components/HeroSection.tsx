import React from 'react';
import { Search, Repeat, IndianRupee, Star, Sparkles, Filter, X, ShieldCheck, Mail, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';
import { FloatingHeroVisual } from './FloatingHeroVisual';

interface HeroSectionProps {
  search: string;
  setSearch: (s: string) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  exchangeMode: string;
  setExchangeMode: (m: string) => void;
  onlyTopRated: boolean;
  setOnlyTopRated: (v: boolean) => void;
  totalStudents: number;
  onOpenMatchmaker: () => void;
  onResetData: () => void;
}

const CATEGORIES = [
  'All',
  'Programming',
  'Design',
  'Academics',
  'Languages',
  'Music',
  'Media',
  'Business',
  'Career',
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  search,
  setSearch,
  selectedCategory,
  setSelectedCategory,
  exchangeMode,
  setExchangeMode,
  onlyTopRated,
  setOnlyTopRated,
  totalStudents,
  onOpenMatchmaker,
  onResetData,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-950 via-indigo-950 to-slate-900 text-white pt-12 pb-14 border-b border-amber-500/20">
      
      {/* Background Animated Gradient Mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(245,158,11,0.2),rgba(255,255,255,0))] pointer-events-none" />
      <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse-soft" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-float-slow" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-10">
          
          {/* Left Column: Headline & Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-amber-200 shadow-inner"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Campus Peer-to-Peer Skill Swap</span>
              <span className="text-white/40">•</span>
              <span className="text-emerald-300 font-extrabold">₹ INR Tutoring & Free Barter</span>
            </motion.div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-extrabold tracking-tight leading-[1.15]">
              Exchange Skills <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-amber-100 bg-clip-text text-transparent">for Free</span> or Learn <span className="bg-gradient-to-r from-emerald-300 to-teal-300 bg-clip-text text-transparent">by the Hour (₹)</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Trade your knowledge in Python for Figma design, calculus for acoustic guitar, or teach paid mentoring sessions at an hourly rate in Indian rupees (₹) with 1-click Gmail drafts and verified reviews.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2">
              <button
                type="button"
                onClick={onOpenMatchmaker}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-extrabold px-6 py-3.5 rounded-2xl shadow-xl shadow-orange-500/25 transition-all hover:scale-105 active:scale-95 text-xs sm:text-sm border border-white/20"
              >
                <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300" />
                Launch AI Smart Skill Maker
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onResetData}
                title="Reset database to initial student seed data"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-white/5 hover:bg-white/10 px-3.5 py-3 rounded-2xl border border-white/10 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                Reset Sample Data
              </button>
            </div>

            {/* Live Stats Pills */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>{totalStudents} Campus Peers Online</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-1">
                <Repeat className="w-3.5 h-3.5 text-amber-400" />
                <span>₹0 Free Skill Barter</span>
              </div>
              <span className="text-white/20">•</span>
              <div className="flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hourly Paid Mentorship (₹)</span>
              </div>
            </div>

          </div>

          {/* Right Column: 3D Floating Motion Visual */}
          <div className="lg:col-span-5 flex justify-center">
            <FloatingHeroVisual />
          </div>

        </div>

        {/* Search & Filter Modern Glass Dock */}
        <div className="glass-panel dark:bg-slate-900/90 rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20 dark:border-slate-800 text-slate-900 dark:text-slate-100 max-w-5xl mx-auto backdrop-blur-2xl">
          
          {/* Search bar with 3D glow */}
          <div className="relative group">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-amber-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by skill (e.g. Python, Figma, Guitar, Calculus, Java) or student name, college..."
              className="w-full pl-12 pr-11 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/95 dark:bg-slate-800 focus:bg-white dark:focus:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-amber-500/20 focus:border-amber-500 text-sm font-semibold transition-all shadow-sm text-slate-900 dark:text-white"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mode Switcher & Top-Rated Toggles */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            
            {/* Exchange mode */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Exchange Mode:
              </span>
              <button
                type="button"
                onClick={() => setExchangeMode('all')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  exchangeMode === 'all'
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300'
                }`}
              >
                All Opportunities
              </button>
              <button
                type="button"
                onClick={() => setExchangeMode('swap')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  exchangeMode === 'swap'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-300/40'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                1-on-1 Barter Only (₹0)
              </button>
              <button
                type="button"
                onClick={() => setExchangeMode('paid')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  exchangeMode === 'paid'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-300/40'
                    : 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/60'
                }`}
              >
                <IndianRupee className="w-3.5 h-3.5" />
                Hourly Paid Tutoring (₹)
              </button>
            </div>

            {/* Top rated filter */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOnlyTopRated(!onlyTopRated)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  onlyTopRated
                    ? 'bg-amber-500 text-white shadow-md shadow-amber-300/40'
                    : 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60'
                }`}
              >
                <Star className={`w-3.5 h-3.5 ${onlyTopRated ? 'fill-white' : 'text-amber-500 fill-amber-400'}`} />
                Top Rated (4.8+ ⭐)
              </button>
            </div>

          </div>

          {/* Category Chips with micro animations */}
          <div className="mt-3.5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                    : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};
