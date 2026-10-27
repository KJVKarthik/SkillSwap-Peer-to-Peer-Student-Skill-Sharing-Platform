import React, { useState } from 'react';
import { X, Mail, UserPlus, LogIn, CheckCircle, GraduationCap, ArrowRight, ShieldCheck, IndianRupee, Repeat, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student } from '../types';
import { createStudent } from '../api';
import { SkillTagInput } from './SkillTagInput';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  onLoginSuccess: (student: Student) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  students,
  onLoginSuccess,
}) => {
  const [authMode, setAuthMode] = useState<'signin' | 'register'>('signin');
  
  // Sign in state
  const [signInEmail, setSignInEmail] = useState('');
  
  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regUniversity, setRegUniversity] = useState('SRM University');
  const [regMajor, setRegMajor] = useState('');
  const [regHourlyRate, setRegHourlyRate] = useState(600);
  const [regOpenToSwap, setRegOpenToSwap] = useState(true);
  const [regBio, setRegBio] = useState('');

  // Multiple skills arrays
  const [teachSkills, setTeachSkills] = useState<string[]>(['Python', 'Java']);
  const [learnSkills, setLearnSkills] = useState<string[]>(['UI/UX & Figma Design']);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signInEmail.trim()) return;

    const emailTrimmed = signInEmail.trim().toLowerCase();
    const existing = students.find((s) => s.email.toLowerCase() === emailTrimmed);

    if (existing) {
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      onLoginSuccess(existing);
      onClose();
    } else {
      // Switch to register mode with prefilled email
      setRegEmail(signInEmail.trim());
      setRegName(signInEmail.split('@')[0]);
      setAuthMode('register');
    }
  };

  const handleQuickSelectStudent = (student: Student) => {
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
    onLoginSuccess(student);
    onClose();
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    setSubmitting(true);
    try {
      // Map multiple teach skills
      const processedOffered = teachSkills.map((skill, idx) => ({
        id: `so-${Date.now()}-${idx}`,
        name: skill.trim(),
        category: 'General',
        level: 'Intermediate',
        description: `Peer lessons in ${skill.trim()}`,
        isSwapAvailable: regOpenToSwap,
        hourlyPrice: Number(regHourlyRate) || 0
      }));

      // Map multiple learn skills
      const processedWanted = learnSkills.map((skill, idx) => ({
        id: `sw-${Date.now()}-${idx}`,
        name: skill.trim(),
        category: 'General',
        level: 'Beginner',
        notes: 'Looking to learn from a campus peer'
      }));

      const student = await createStudent({
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        university: regUniversity.trim() || 'University',
        major: regMajor.trim() || 'General Studies',
        bio: regBio.trim() || `Hi! I study at ${regUniversity} and am excited to exchange skills with peers.`,
        hourlyRate: Number(regHourlyRate) || 0,
        openToSwap: regOpenToSwap,
        location: `${regUniversity} (Campus / Online)`,
        skillsOffered: processedOffered,
        skillsWanted: processedWanted,
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      onLoginSuccess(student);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to create student account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header Banner */}
        <div className="p-6 bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-2">
            <span className="p-1 rounded-lg bg-white/20">
              <Sparkles className="w-4 h-4 text-amber-300" />
            </span>
            <span className="text-[11px] uppercase font-extrabold tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Student Peer Network
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white">
            {authMode === 'signin' ? 'Sign In to SkillSwap' : 'Setup Student Profile'}
          </h2>
          <p className="text-xs text-amber-100 mt-0.5">
            {authMode === 'signin'
              ? 'Enter your campus email or switch active student profile'
              : 'Tell us what skills you can teach and what you want to learn'}
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 p-1">
          <button
            onClick={() => setAuthMode('signin')}
            className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              authMode === 'signin'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In / Switch Student</span>
          </button>

          <button
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              authMode === 'register'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>New Student Setup</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* SIGN IN VIEW */}
          {authMode === 'signin' && (
            <div className="space-y-6">
              <form onSubmit={handleSignIn} className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Student Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
                    <input
                      type="email"
                      value={signInEmail}
                      onChange={(e) => setSignInEmail(e.target.value)}
                      placeholder="e.g. kk7504@srmist.edu.in or alex.chen@berkeley.edu"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:ring-2 focus:ring-amber-500"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-md active:scale-95"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Continue to Live Website</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>

              {/* Quick Profile Switcher */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-2.5">
                  Or One-Click Switch Student Account:
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {students.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => handleQuickSelectStudent(s)}
                      className="p-2.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-400 dark:hover:border-amber-500 bg-slate-50 dark:bg-slate-800/60 hover:bg-white dark:hover:bg-slate-800 text-left transition-all flex items-center gap-2.5 group"
                    >
                      <img
                        src={s.avatar}
                        alt={s.name}
                        className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                      />
                      <div className="truncate flex-1">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-amber-600 dark:group-hover:text-amber-400 block truncate">
                          {s.name}
                        </span>
                        <span className="text-[10px] text-slate-400 block truncate">
                          {s.university} • {s.hourlyRate > 0 ? `₹${s.hourlyRate}/hr` : 'Barter'}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* REGISTER / PROFILE SETUP VIEW */}
          {authMode === 'register' && (
            <form onSubmit={handleRegister} className="space-y-4">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. KJV Karthik"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Student Email *
                  </label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. kk7504@srmist.edu.in"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    University / College
                  </label>
                  <input
                    type="text"
                    value={regUniversity}
                    onChange={(e) => setRegUniversity(e.target.value)}
                    placeholder="e.g. SRM University, UC Berkeley"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Major / Department
                  </label>
                  <input
                    type="text"
                    value={regMajor}
                    onChange={(e) => setRegMajor(e.target.value)}
                    placeholder="e.g. Computer Science & AI"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                  />
                </div>
              </div>

              {/* What skills can you teach? (Multiple Skills Input) */}
              <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
                <SkillTagInput
                  label="What skills can you teach? (One or several)"
                  sublabel="Type each skill and press Enter or comma. You can edit this list anytime later."
                  skills={teachSkills}
                  onChange={setTeachSkills}
                  accentColor="amber"
                  placeholder="e.g. Python, Java, Data Analytics, React"
                  suggestions={['Python', 'Java', 'Data Analytics', 'React & Next.js', 'Guitar', 'Calculus', 'Video Editing', 'Canva']}
                />
              </div>

              {/* What skills do you want to learn? (Multiple Skills Input) */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40">
                <SkillTagInput
                  label="What skills do you want to learn? (One or several)"
                  sublabel="Type what you want help with. We'll match mentors who teach these skills."
                  skills={learnSkills}
                  onChange={setLearnSkills}
                  accentColor="indigo"
                  placeholder="e.g. UI/UX & Figma, Spanish, Public Speaking"
                  suggestions={['UI/UX & Figma Design', 'Spanish', 'Public Speaking', 'Digital Photography', '3D Modeling', 'Financial Modeling']}
                />
              </div>

              {/* Hourly Rate in ₹ and Barter Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                    <span>Hourly Rate (₹/hr)</span>
                    <span className="text-[10px] text-slate-400">Set 0 for barter only</span>
                  </label>
                  <div className="relative">
                    <IndianRupee className="w-4 h-4 absolute left-3 top-2.5 text-emerald-600" />
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={regHourlyRate}
                      onChange={(e) => setRegHourlyRate(Number(e.target.value))}
                      className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-5">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={regOpenToSwap}
                      onChange={(e) => setRegOpenToSwap(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Open for 1:1 Free Barter
                  </span>
                </div>
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Short Student Bio
                </label>
                <textarea
                  rows={2}
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  placeholder="Share a sentence or two about your study interests..."
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-black text-xs transition-all shadow-lg shadow-orange-500/20 active:scale-95 flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>{submitting ? 'Creating Profile...' : 'Complete Profile & Join Live Website'}</span>
              </button>

            </form>
          )}

        </div>

      </div>
    </div>
  );
};
