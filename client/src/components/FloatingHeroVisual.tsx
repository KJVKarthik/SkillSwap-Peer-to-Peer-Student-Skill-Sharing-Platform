import React from 'react';
import { motion } from 'framer-motion';
import { Repeat, Star, Sparkles, Code2, Palette, ShieldCheck, Mail, IndianRupee, CheckCircle2 } from 'lucide-react';

export const FloatingHeroVisual: React.FC = () => {
  return (
    <div className="relative w-full h-[380px] sm:h-[440px] flex items-center justify-center select-none perspective-1000">
      
      {/* Background Animated Glowing Ambient Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1],
          rotate: [0, 90, 0],
          opacity: [0.4, 0.65, 0.4],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-72 h-72 rounded-full bg-gradient-to-tr from-amber-500/20 to-orange-500/20 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{
          scale: [1.1, 0.95, 1.1],
          rotate: [0, -90, 0],
          opacity: [0.35, 0.55, 0.35],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute w-64 h-64 rounded-full bg-gradient-to-br from-emerald-400/20 to-indigo-500/25 blur-3xl pointer-events-none"
      />

      {/* Floating 3D Card 1: Alex (Top Left) */}
      <motion.div
        animate={{
          y: [-8, 8, -8],
          rotateZ: [-2, 1, -2],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-4 left-2 sm:left-6 z-20"
      >
        <div className="glass-card-3d p-4 rounded-2xl max-w-[240px] shadow-xl border border-white/80 dark:border-slate-700 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                alt="Alex Chen"
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-amber-500/30 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow">
                <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 fill-amber-100" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-900 dark:text-white text-xs">Alex Chen</span>
                <span className="text-[10px] bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold px-1 rounded">UCB</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">CS & AI Major</p>
              <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold mt-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>4.9 (18 reviews)</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1 bg-indigo-50 dark:bg-indigo-950 px-2 py-0.5 rounded-lg">
              <Code2 className="w-3 h-3" /> React & Python
            </span>
            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">₹800/hr</span>
          </div>
        </div>
      </motion.div>

      {/* Floating 3D Card 2: Elena (Bottom Right) */}
      <motion.div
        animate={{
          y: [8, -8, 8],
          rotateZ: [2, -1, 2],
        }}
        transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-4 right-2 sm:right-6 z-20"
      >
        <div className="glass-card-3d p-4 rounded-2xl max-w-[240px] shadow-xl border border-white/80 dark:border-slate-700 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                alt="Elena Gomez"
                className="w-11 h-11 rounded-xl object-cover ring-2 ring-orange-500/30 shadow-md"
              />
              <span className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow">
                <CheckCircle2 className="w-3.5 h-3.5 text-orange-600 fill-orange-100" />
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-bold text-slate-900 dark:text-white text-xs">Elena Gomez</span>
                <span className="text-[10px] bg-orange-50 dark:bg-orange-950 text-orange-800 dark:text-orange-300 font-extrabold px-1 rounded">Stanford</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Product Design</p>
              <div className="flex items-center gap-1 text-amber-500 text-[10px] font-bold mt-0.5">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>5.0 (24 reviews)</span>
              </div>
            </div>
          </div>

          <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px]">
            <span className="font-bold text-orange-600 dark:text-orange-400 flex items-center gap-1 bg-orange-50 dark:bg-orange-950 px-2 py-0.5 rounded-lg">
              <Palette className="w-3 h-3" /> UI/UX Figma
            </span>
            <span className="font-extrabold text-amber-600 dark:text-amber-400">1:1 Barter</span>
          </div>
        </div>
      </motion.div>

      {/* Central 3D Swap Nexus Core */}
      <motion.div
        animate={{
          scale: [0.97, 1.03, 0.97],
          rotate: [0, 5, -5, 0],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        className="relative z-30 p-5 rounded-3xl bg-gradient-to-tr from-amber-600 via-orange-600 to-indigo-800 text-white shadow-2xl shadow-orange-500/30 border border-white/30 backdrop-blur-2xl text-center max-w-[200px]"
      >
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mx-auto mb-2 shadow-inner ring-1 ring-white/30">
          <Repeat className="w-6 h-6 text-white animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        <span className="inline-block text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-400 text-slate-950 shadow-sm mb-1">
          100% Reciprocal
        </span>

        <p className="font-extrabold text-xs text-white leading-tight">
          1-on-1 Free Skill Swap
        </p>

        <p className="text-[10px] text-amber-200 mt-1">
          Python ⇄ Figma UI
        </p>

        <div className="mt-2 pt-2 border-t border-white/20 flex items-center justify-center gap-1 text-[10px] text-emerald-300 font-bold">
          <span>Cost:</span>
          <span className="bg-emerald-500/30 px-1.5 py-0.5 rounded text-white font-extrabold">₹0 (Free Barter)</span>
        </div>
      </motion.div>

      {/* Floating Micro Badge: 3D Rupee Pill */}
      <motion.div
        animate={{
          y: [-12, 10, -12],
          x: [0, 6, 0],
        }}
        transition={{ duration: 4.8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-12 right-12 z-20"
      >
        <div className="glass-panel dark:bg-slate-900/90 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-emerald-200/60 dark:border-emerald-800 bg-emerald-50/80 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-bold">
          <IndianRupee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span>Hourly Tutoring (₹/hr)</span>
        </div>
      </motion.div>

      {/* Floating Micro Badge: Gmail 3D Pill */}
      <motion.div
        animate={{
          y: [10, -10, 10],
          x: [-4, 4, -4],
        }}
        transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-12 left-10 z-20"
      >
        <div className="glass-panel dark:bg-slate-900/90 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg border border-rose-200/60 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 text-xs font-bold">
          <Mail className="w-3.5 h-3.5 text-red-500" />
          <span>Browser Gmail Compose</span>
        </div>
      </motion.div>

      {/* Floating Star Badge */}
      <motion.div
        animate={{
          scale: [0.9, 1.1, 0.9],
          rotate: [0, 15, 0],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-2 left-1/2 -translate-x-1/2 z-10"
      >
        <div className="glass-panel dark:bg-slate-900/90 px-3 py-1 rounded-full flex items-center gap-1 shadow-md border border-amber-200/60 dark:border-amber-800 bg-amber-50/90 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-[11px] font-extrabold">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>Verified Student Reviews</span>
        </div>
      </motion.div>

    </div>
  );
};
