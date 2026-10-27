import React, { useState } from 'react';
import { X, UserPlus, CheckCircle, GraduationCap, IndianRupee, Repeat, Mail, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student } from '../types';
import { createStudent } from '../api';
import { SkillTagInput } from './SkillTagInput';

interface RegisterStudentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStudentCreated: (newStudent: Student) => void;
}

export const RegisterStudentModal: React.FC<RegisterStudentModalProps> = ({
  isOpen,
  onClose,
  onStudentCreated,
}) => {
  if (!isOpen) return null;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [university, setUniversity] = useState('SRM University');
  const [major, setMajor] = useState('');
  const [hourlyRate, setHourlyRate] = useState(600);
  const [openToSwap, setOpenToSwap] = useState(true);
  const [bio, setBio] = useState('');

  // Multiple skills arrays
  const [teachSkills, setTeachSkills] = useState<string[]>(['Python', 'Java']);
  const [learnSkills, setLearnSkills] = useState<string[]>(['UI/UX & Figma Design']);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setSubmitting(true);
    try {
      const processedOffered = teachSkills.map((sk, idx) => ({
        id: `so-${Date.now()}-${idx}`,
        name: sk.trim(),
        category: 'General',
        level: 'Intermediate',
        description: `Peer lessons in ${sk.trim()}`,
        isSwapAvailable: openToSwap,
        hourlyPrice: Number(hourlyRate) || 0,
      }));

      const processedWanted = learnSkills.map((sk, idx) => ({
        id: `sw-${Date.now()}-${idx}`,
        name: sk.trim(),
        category: 'General',
        level: 'Beginner',
        notes: 'Looking to learn from a student mentor',
      }));

      const student = await createStudent({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        university: university.trim() || 'University',
        major: major.trim() || 'General Studies',
        bio: bio.trim() || `Hi! I study at ${university} and am excited to exchange skills with peers.`,
        hourlyRate: Number(hourlyRate) || 0,
        openToSwap,
        location: `${university} (Campus / Online)`,
        skillsOffered: processedOffered,
        skillsWanted: processedWanted,
      });

      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
      });

      onStudentCreated(student);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to register student');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-white/20 text-white">
              <UserPlus className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Student Registration
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mt-1">
            Join the Campus Skill Network
          </h2>
          <p className="text-xs text-amber-100 mt-0.5">
            Set up what you can teach and what you want to learn
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. kk7504@srmist.edu.in"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                University / Campus
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. SRM University"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Major / Degree
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                placeholder="e.g. Computer Science & AI"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
              />
            </div>
          </div>

          {/* Multiple Skills: Teach */}
          <div className="p-3.5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
            <SkillTagInput
              label="What skills can you teach? (One or several)"
              sublabel="Type skill and press Enter. You can edit this list anytime later."
              skills={teachSkills}
              onChange={setTeachSkills}
              accentColor="amber"
              placeholder="e.g. Python, Java, Data Analytics, React"
            />
          </div>

          {/* Multiple Skills: Learn */}
          <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/80 dark:border-indigo-900/40">
            <SkillTagInput
              label="What skills do you want to learn? (One or several)"
              sublabel="Skills you're hoping to learn from student peers"
              skills={learnSkills}
              onChange={setLearnSkills}
              accentColor="indigo"
              placeholder="e.g. UI/UX & Figma, Spanish, Public Speaking"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Hourly Rate (₹/hr)</span>
                <span className="text-[10px] text-slate-400">0 = barter only</span>
              </label>
              <div className="relative">
                <IndianRupee className="w-4 h-4 absolute left-3 top-2.5 text-emerald-600" />
                <input
                  type="number"
                  min="0"
                  step="50"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-5">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={openToSwap}
                  onChange={(e) => setOpenToSwap(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Open for 1:1 Free Barter
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Short Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="What are your academic or creative goals?"
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-sans"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-colors shadow-md flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>{submitting ? 'Creating...' : 'Register Profile'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
