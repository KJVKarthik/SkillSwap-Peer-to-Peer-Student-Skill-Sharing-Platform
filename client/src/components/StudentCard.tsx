import React from 'react';
import { Star, GraduationCap, Repeat, IndianRupee, Mail, CheckCircle, ArrowRight, MessageSquare, User, Sparkles } from 'lucide-react';
import { Student } from '../types';
import { ThreeDCard } from './ThreeDCard';

interface StudentCardProps {
  student: Student;
  onSelectStudent: (student: Student) => void;
  onProposeSwap: (student: Student) => void;
  onBookPaid: (student: Student) => void;
  onOpenGmail: (student: Student) => void;
  isSelf: boolean;
  onGoToProfile?: () => void;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  onSelectStudent,
  onProposeSwap,
  onBookPaid,
  onOpenGmail,
  isSelf,
  onGoToProfile,
}) => {
  const skillsOffered = student.skillsOffered || [];
  const skillsWanted = student.skillsWanted || [];
  const locationText = (student.location || 'Campus / Online').split('(')[0].trim();

  return (
    <ThreeDCard maxTilt={7} className="h-full">
      <div className={`h-full rounded-3xl flex flex-col justify-between overflow-hidden transition-all duration-300 preserve-3d ${
        isSelf 
          ? 'glass-card-3d border-2 border-amber-500 ring-4 ring-amber-500/10 shadow-xl' 
          : 'glass-card-3d hover:border-amber-300/80 dark:hover:border-amber-600/80 shadow-md hover:shadow-2xl'
      }`}>
        
        {/* Top Header */}
        <div className="p-5 sm:p-6 pb-4" style={{ transform: 'translateZ(20px)' }}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-3.5">
              <div className="relative group/avatar">
                <img
                  src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(student.name)}`}
                  alt={student.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-white dark:ring-slate-800 shadow-md group-hover/avatar:scale-105 transition-transform"
                />
                {student.verifiedStudent && (
                  <span
                    title="Verified Student Peer"
                    className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-0.5 shadow-md"
                  >
                    <CheckCircle className="w-4 h-4 text-amber-600 fill-amber-100 dark:fill-amber-950" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <h3
                    onClick={() => onSelectStudent(student)}
                    className="font-extrabold text-slate-900 dark:text-white text-base hover:text-amber-600 dark:hover:text-amber-400 cursor-pointer transition-colors"
                  >
                    {student.name}
                  </h3>
                  {isSelf && (
                    <span className="text-[10px] bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                      👑 You
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 font-semibold mt-0.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                  <span className="truncate max-w-[150px]">{student.university}</span>
                </div>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 font-medium truncate max-w-[170px]">
                  {student.major}
                </p>
              </div>
            </div>

            {/* Rating Badge */}
            <div
              onClick={() => onSelectStudent(student)}
              className="flex items-center gap-1 bg-amber-50/90 dark:bg-amber-950/70 hover:bg-amber-100/90 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-xl text-xs font-extrabold text-amber-800 dark:text-amber-300 cursor-pointer transition-colors shrink-0 shadow-2xs"
              title={`${student.rating} stars out of ${student.reviewCount} peer reviews`}
            >
              <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
              <span>{student.rating ? student.rating.toFixed(1) : '5.0'}</span>
              <span className="text-[10px] text-amber-700/80 dark:text-amber-400/80 font-bold">
                ({student.reviewCount || 0})
              </span>
            </div>
          </div>

          {/* Pricing & Barter Badges with 3D Depth */}
          <div className="mt-4 flex flex-wrap items-center gap-1.5" style={{ transform: 'translateZ(25px)' }}>
            {student.hourlyRate > 0 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-gradient-to-r from-emerald-500/10 to-teal-500/10 text-emerald-800 dark:text-emerald-300 border border-emerald-300/80 dark:border-emerald-800 shadow-2xs">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                ₹{student.hourlyRate}/hr
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-extrabold bg-indigo-50 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 shadow-2xs">
                <Repeat className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                Free Barter Only
              </span>
            )}

            {student.openToSwap && student.hourlyRate > 0 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <Repeat className="w-3 h-3 text-amber-600" />
                1:1 Barter Ready
              </span>
            )}

            <span className="text-[11px] text-slate-400 dark:text-slate-500 ml-auto font-medium">
              {locationText}
            </span>
          </div>

          {/* Bio preview */}
          <p className="mt-3 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {student.bio || 'Ready to swap skills and learn from campus peers!'}
          </p>

          {/* Open Skill Listings — Can Teach */}
          <div className="mt-4">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 block mb-1.5">
              Can Teach:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {skillsOffered.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No skills listed yet</span>
              ) : (
                skillsOffered.slice(0, 3).map((skill) => (
                  <span
                    key={skill.id}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-xl bg-slate-100/80 dark:bg-slate-800 hover:bg-white dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold border border-slate-200/80 dark:border-slate-700 shadow-2xs transition-colors"
                  >
                    <span>{skill.name}</span>
                    <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 font-extrabold border border-slate-200 dark:border-slate-700">
                      {skill.level}
                    </span>
                  </span>
                ))
              )}
              {skillsOffered.length > 3 && (
                <span className="text-[11px] text-slate-400 dark:text-slate-500 self-center font-bold">
                  +{skillsOffered.length - 3} more
                </span>
              )}
            </div>
          </div>

          {/* Skills Wanted (Barter Wishes) */}
          {skillsWanted.length > 0 && (
            <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1">
                Wants to Learn:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {skillsWanted.slice(0, 2).map((wanted) => (
                  <span
                    key={wanted.id}
                    className="text-[11px] px-2.5 py-0.5 rounded-lg bg-indigo-50/70 dark:bg-indigo-950/50 text-indigo-800 dark:text-indigo-300 font-semibold border border-indigo-100/60 dark:border-indigo-900/60"
                  >
                    🎯 {wanted.name}
                  </span>
                ))}
                {skillsWanted.length > 2 && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 self-center font-medium">
                    +{skillsWanted.length - 2}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Bottom Action Footer with 3D Depth */}
        <div 
          className="px-5 py-3.5 bg-slate-50/90 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2"
          style={{ transform: 'translateZ(15px)' }}
        >
          <div className="flex items-center gap-1.5 flex-1">
            {isSelf ? (
              <button
                type="button"
                onClick={() => {
                  if (onGoToProfile) {
                    onGoToProfile();
                  } else {
                    onSelectStudent(student);
                  }
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs py-2 px-3 rounded-xl transition-all shadow-md active:scale-95"
              >
                <User className="w-3.5 h-3.5" />
                Go to My Profile
              </button>
            ) : (
              <>
                {/* Propose Swap Button */}
                {student.openToSwap && (
                  <button
                    type="button"
                    onClick={() => onProposeSwap(student)}
                    className="flex-1 inline-flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-extrabold text-xs py-2 px-2.5 rounded-xl transition-all shadow-2xs active:scale-95"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    Swap
                  </button>
                )}

                {/* Book Paid Session Button */}
                {student.hourlyRate > 0 && (
                  <button
                    type="button"
                    onClick={() => onBookPaid(student)}
                    className="flex-1 inline-flex items-center justify-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-2 px-2.5 rounded-xl transition-all shadow-2xs active:scale-95"
                  >
                    <IndianRupee className="w-3.5 h-3.5" />
                    Book (₹{student.hourlyRate})
                  </button>
                )}
              </>
            )}
          </div>

          {/* Contact via Gmail Direct Action */}
          <button
            type="button"
            onClick={() => onOpenGmail(student)}
            title={`Open Gmail Compose to contact ${student.name}`}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/40 text-slate-700 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors shrink-0 flex items-center gap-1 text-xs font-bold"
          >
            <Mail className="w-4 h-4 text-red-500" />
            <span className="hidden xl:inline">Gmail</span>
          </button>

          {/* Reviews details */}
          <button
            type="button"
            onClick={() => onSelectStudent(student)}
            title="View Student Reviews and Details"
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400 transition-colors shrink-0"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>

      </div>
    </ThreeDCard>
  );
};
