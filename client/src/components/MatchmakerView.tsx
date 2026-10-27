import React, { useState, useEffect } from 'react';
import { Sparkles, Repeat, ArrowRightLeft, Star, GraduationCap, Mail, CheckCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { Student, MatchResult } from '../types';
import { getMatches, openGmailCompose } from '../api';

interface MatchmakerViewProps {
  currentUser: Student | null;
  onSelectStudent: (student: Student) => void;
  onProposeSwap: (student: Student) => void;
  onOpenGmail: (student: Student) => void;
}

export const MatchmakerView: React.FC<MatchmakerViewProps> = ({
  currentUser,
  onSelectStudent,
  onProposeSwap,
  onOpenGmail,
}) => {
  const [teachSkill, setTeachSkill] = useState(
    currentUser?.skillsOffered?.[0]?.name || 'React & Next.js'
  );
  const [learnSkill, setLearnSkill] = useState(
    currentUser?.skillsWanted?.[0]?.name || 'UI/UX & Figma Design'
  );
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMatchResults = async () => {
    setLoading(true);
    try {
      const results = await getMatches({
        userId: currentUser?.id,
        teachSkill,
        learnSkill,
      });
      setMatches(results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMatchResults();
  }, [currentUser]);

  const handleUseMySkills = () => {
    if (currentUser) {
      if (currentUser.skillsOffered && currentUser.skillsOffered.length > 0) {
        setTeachSkill(currentUser.skillsOffered[0].name);
      }
      if (currentUser.skillsWanted && currentUser.skillsWanted.length > 0) {
        setLearnSkill(currentUser.skillsWanted[0].name);
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-violet-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-300 border border-amber-300/30 mb-3">
            <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            Reciprocal Skill Exchange Matchmaker
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Find Your Perfect 1-on-1 Barter Partner
          </h2>
          <p className="mt-2 text-sm text-indigo-100 leading-relaxed">
            Our matchmaker analyzes complimentary skill pairs. Enter what you want to learn and what you can teach to find peers ready for a 100% free reciprocal knowledge swap.
          </p>
        </div>

        {/* Input Bar */}
        <div className="mt-8 bg-white/10 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-white/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* What you teach */}
            <div>
              <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                <span>1. I can teach (Offered Skill)</span>
                {currentUser && (
                  <button
                    type="button"
                    onClick={handleUseMySkills}
                    className="text-[10px] text-amber-300 hover:underline capitalize"
                  >
                    Sync with my profile
                  </button>
                )}
              </label>
              <input
                type="text"
                value={teachSkill}
                onChange={(e) => setTeachSkill(e.target.value)}
                placeholder="e.g. React & Next.js, Python, Guitar, Calculus"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 text-slate-900 font-semibold text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

            {/* What you want to learn */}
            <div>
              <label className="block text-xs font-bold text-indigo-200 uppercase tracking-wider mb-1.5">
                2. I want to learn (Wanted Skill)
              </label>
              <input
                type="text"
                value={learnSkill}
                onChange={(e) => setLearnSkill(e.target.value)}
                placeholder="e.g. UI/UX Design, Spanish, Ableton, Public Speaking"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/90 text-slate-900 font-semibold text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-400"
              />
            </div>

          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-indigo-200">
              <ArrowRightLeft className="w-4 h-4 text-amber-300" />
              <span>
                Searching for peers who teach <strong>"{learnSkill || '...'}"</strong> and want <strong>"{teachSkill || '...'}"</strong>
              </span>
            </div>

            <button
              onClick={fetchMatchResults}
              disabled={loading}
              className="bg-amber-400 hover:bg-amber-500 text-indigo-950 font-extrabold text-xs px-5 py-2.5 rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              Find Reciprocal Matches
            </button>
          </div>
        </div>
      </div>

      {/* Match Results List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-slate-900">
            Matched Peers ({matches.length})
          </h3>
          <span className="text-xs text-slate-500">
            Sorted by reciprocity & student rating
          </span>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400 text-sm">
            Calculating matches...
          </div>
        ) : matches.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <Repeat className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-800 text-base">No Direct Matches Found</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Try searching broader terms like "Python", "Design", or "Guitar", or browse the full student directory in the Explore tab.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {matches.map((item) => {
              const { student, isReciprocal, matchScore, theyCanTeachYou, youCanTeachThem } = item;

              return (
                <div
                  key={student.id}
                  className={`rounded-3xl p-5 border transition-all ${
                    isReciprocal
                      ? 'bg-gradient-to-br from-indigo-50/70 via-white to-amber-50/40 border-indigo-200 shadow-md ring-1 ring-indigo-200'
                      : 'bg-white border-slate-200 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={student.avatar}
                        alt={student.name}
                        className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-100"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <h4
                            onClick={() => onSelectStudent(student)}
                            className="font-bold text-slate-900 text-sm hover:text-indigo-600 cursor-pointer transition-colors"
                          >
                            {student.name}
                          </h4>
                          {student.verifiedStudent && (
                            <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <GraduationCap className="w-3.5 h-3.5 text-indigo-500" />
                          {student.university} • {student.major}
                        </p>
                      </div>
                    </div>

                    {/* Match Score Badge */}
                    <div className="text-right shrink-0">
                      {isReciprocal ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          🎯 100% Reciprocal
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {matchScore}% Match
                        </span>
                      )}
                      <div className="flex items-center justify-end gap-1 text-amber-500 text-xs font-bold mt-1">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{student.rating} ({student.reviewCount})</span>
                      </div>
                    </div>
                  </div>

                  {/* Swap Exchange Visualization Box */}
                  <div className="mt-4 p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 font-medium">They teach you:</span>
                      <span className="font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                        {theyCanTeachYou.length > 0 ? theyCanTeachYou.map(s => s.name).join(', ') : learnSkill}
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1 border-t border-slate-200">
                      <span className="text-slate-500 font-medium">You teach them:</span>
                      <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {youCanTeachThem.length > 0 ? youCanTeachThem.map(s => s.name).join(', ') : teachSkill}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => onProposeSwap(student)}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2 px-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5"
                    >
                      <Repeat className="w-3.5 h-3.5" />
                      Propose 1-on-1 Swap
                    </button>

                    <button
                      onClick={() => onOpenGmail(student)}
                      className="px-3 py-2 rounded-xl border border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-700 hover:text-red-600 transition-colors text-xs font-semibold flex items-center gap-1"
                    >
                      <Mail className="w-3.5 h-3.5 text-red-500" />
                      Gmail
                    </button>

                    <button
                      onClick={() => onSelectStudent(student)}
                      className="px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-semibold"
                    >
                      Profile
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
