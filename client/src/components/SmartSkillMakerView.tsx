import React, { useState, useEffect } from 'react';
import { Sparkles, Repeat, IndianRupee, Mail, Star, GraduationCap, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Plus, X, User, HeartHandshake } from 'lucide-react';
import { Student, SkillMatchStudent, SmartSkillMakerResponse } from '../types';
import { runSmartSkillMaker, updateStudent } from '../api';
import { SkillTagInput } from './SkillTagInput';

interface SmartSkillMakerViewProps {
  currentUser: Student | null;
  onSelectStudent: (student: Student) => void;
  onProposeSwap: (student: Student) => void;
  onBookPaid: (student: Student) => void;
  onOpenGmailCompose: (student: Student, relevantSkill?: string, sessionType?: 'swap' | 'paid') => void;
  onProfileUpdated: (student: Student) => void;
}

export const SmartSkillMakerView: React.FC<SmartSkillMakerViewProps> = ({
  currentUser,
  onSelectStudent,
  onProposeSwap,
  onBookPaid,
  onOpenGmailCompose,
  onProfileUpdated
}) => {
  // Local editable skill lists initialized from currentUser
  const [teachSkills, setTeachSkills] = useState<string[]>(
    currentUser?.skillsOffered?.map(s => s.name) || ['Python', 'React & Next.js']
  );
  const [learnSkills, setLearnSkills] = useState<string[]>(
    currentUser?.skillsWanted?.map(s => s.name) || ['UI/UX & Figma Design', 'Video Editing']
  );

  const [matchData, setMatchData] = useState<SmartSkillMakerResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'both' | 'wantWhatITeach' | 'teachWhatIWant' | 'reciprocal'>('both');
  const [savingProfile, setSavingProfile] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync state if currentUser changes
  useEffect(() => {
    if (currentUser) {
      if (currentUser.skillsOffered && currentUser.skillsOffered.length > 0) {
        setTeachSkills(currentUser.skillsOffered.map(s => s.name));
      }
      if (currentUser.skillsWanted && currentUser.skillsWanted.length > 0) {
        setLearnSkills(currentUser.skillsWanted.map(s => s.name));
      }
    }
  }, [currentUser?.id]);

  const handleMatchMySkills = async () => {
    setLoading(true);
    try {
      const response = await runSmartSkillMaker({
        userId: currentUser?.id,
        teachSkills,
        learnSkills
      });
      setMatchData(response);
    } catch (err) {
      console.error('Error running smart skill matching:', err);
    } finally {
      setLoading(false);
    }
  };

  // Run matching on mount
  useEffect(() => {
    handleMatchMySkills();
  }, [currentUser?.id]);

  const handleSaveSkillsToProfile = async () => {
    if (!currentUser) return;
    setSavingProfile(true);
    try {
      const newOffered = teachSkills.map((name, idx) => {
        const existing = currentUser.skillsOffered?.find(s => s.name.toLowerCase() === name.toLowerCase());
        return existing || {
          id: `so-${Date.now()}-${idx}`,
          name,
          category: 'General',
          level: 'Intermediate',
          description: `Peer lessons in ${name}`,
          isSwapAvailable: true,
          hourlyPrice: currentUser.hourlyRate || 500
        };
      });

      const newWanted = learnSkills.map((name, idx) => {
        const existing = currentUser.skillsWanted?.find(s => s.name.toLowerCase() === name.toLowerCase());
        return existing || {
          id: `sw-${Date.now()}-${idx}`,
          name,
          category: 'General',
          level: 'Beginner',
          notes: 'Looking to learn from a campus peer'
        };
      });

      const updated = await updateStudent(currentUser.id, {
        skillsOffered: newOffered,
        skillsWanted: newWanted
      });

      onProfileUpdated(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to sync profile skills:', err);
    } finally {
      setSavingProfile(false);
    }
  };

  const wantWhatITeach = matchData?.wantWhatITeach || [];
  const teachWhatIWant = matchData?.teachWhatIWant || [];
  const reciprocalMatches = matchData?.reciprocalMatches || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 text-white p-6 sm:p-10 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 text-white border border-white/30 mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
            AI Smart Skill Maker
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Match My Skills in Both Directions
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-amber-100 leading-relaxed max-w-2xl">
            Edit what you can teach and what you want to learn right here. Our real matching engine connects you with students eager to learn your skills, plus mentors ready to teach what you need!
          </p>
        </div>
      </div>

      {/* Editable Skills Hub Card */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span>Your Active Skill Preferences</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold">
                Editable
              </span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Add one or multiple skills to either list. Click "Match my skills" to instantly query the network.
            </p>
          </div>

          {currentUser && (
            <button
              type="button"
              onClick={handleSaveSkillsToProfile}
              disabled={savingProfile}
              className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-all flex items-center gap-1.5"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Synced to Profile!</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5" />
                  <span>{savingProfile ? 'Saving...' : 'Save Lists to My Profile'}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Dual Input Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Column 1: What can you teach? */}
          <div className="p-4 sm:p-5 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 space-y-3">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-bold text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span>
              <span>1. What skills can you teach?</span>
            </div>
            
            <SkillTagInput
              label="Offered Skills"
              sublabel="Skills you are comfortable teaching for free swaps or paid hourly sessions (₹)"
              skills={teachSkills}
              onChange={setTeachSkills}
              placeholder="e.g. Python, React, Java, Guitar, Calculus"
              accentColor="amber"
              suggestions={['Python', 'React & Next.js', 'Java', 'Data Analytics', 'Guitar', 'Calculus', 'Video Editing', 'Canva']}
            />
          </div>

          {/* Column 2: What do you want to learn? */}
          <div className="p-4 sm:p-5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 space-y-3">
            <div className="flex items-center gap-2 text-indigo-900 dark:text-indigo-300 font-bold text-xs uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
              <span>2. What skills do you want to learn?</span>
            </div>

            <SkillTagInput
              label="Wanted Skills"
              sublabel="Skills you're looking to learn from student peers or mentors"
              skills={learnSkills}
              onChange={setLearnSkills}
              placeholder="e.g. UI/UX Design, Figma, Spanish, Public Speaking"
              accentColor="indigo"
              suggestions={['UI/UX & Figma Design', 'Spanish', 'Public Speaking', 'Digital Photography', '3D Modeling', 'Personal Finance']}
            />
          </div>

        </div>

        {/* Big Action: Match My Skills Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800">
          <div className="text-xs text-slate-500 dark:text-slate-400">
            Matching runs against real student profiles stored in the system.
          </div>

          <button
            type="button"
            onClick={handleMatchMySkills}
            disabled={loading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-indigo-600 hover:from-amber-600 hover:to-indigo-700 text-white font-extrabold text-sm shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Sparkles className={`w-4 h-4 fill-white ${loading ? 'animate-spin' : ''}`} />
            <span>{loading ? 'Analyzing Campus Network...' : 'Match my skills'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Reciprocal Matches Highlight Bar (If any exist) */}
      {reciprocalMatches.length > 0 && (
        <div className="rounded-3xl bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 text-white p-5 sm:p-6 shadow-lg border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-amber-400 text-slate-950 flex items-center justify-center font-extrabold text-lg shadow-md shrink-0">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 tracking-wider">
                  100% Reciprocal Swaps Found!
                </span>
                <span className="text-xs text-purple-200">
                  {reciprocalMatches.length} complementary {reciprocalMatches.length === 1 ? 'match' : 'matches'}
                </span>
              </div>
              <h4 className="text-base font-bold text-white mt-0.5">
                These peers teach what you want AND want what you teach!
              </h4>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('reciprocal')}
              className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-extrabold hover:bg-amber-300 transition-colors"
            >
              View Reciprocal ({reciprocalMatches.length})
            </button>
          </div>
        </div>
      )}

      {/* Match Results Sets */}
      <div className="space-y-6">
        
        {/* Navigation Tabs between Sets */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('both')}
              className={`px-3.5 py-2 rounded-xl transition-all ${
                activeTab === 'both'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              All Matches ({wantWhatITeach.length + teachWhatIWant.length})
            </button>

            <button
              onClick={() => setActiveTab('wantWhatITeach')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'wantWhatITeach'
                  ? 'bg-white dark:bg-slate-900 text-amber-700 dark:text-amber-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Students who want what I teach</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-extrabold">
                {wantWhatITeach.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('teachWhatIWant')}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                activeTab === 'teachWhatIWant'
                  ? 'bg-white dark:bg-slate-900 text-indigo-700 dark:text-indigo-400 shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Mentors who teach what I want</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300 font-extrabold">
                {teachWhatIWant.length}
              </span>
            </button>

            {reciprocalMatches.length > 0 && (
              <button
                onClick={() => setActiveTab('reciprocal')}
                className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 ${
                  activeTab === 'reciprocal'
                    ? 'bg-white dark:bg-slate-900 text-purple-700 dark:text-purple-400 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span>100% Reciprocal</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300 font-extrabold">
                  {reciprocalMatches.length}
                </span>
              </button>
            )}
          </div>

          <button
            onClick={handleMatchMySkills}
            className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Re-run Matcher
          </button>
        </div>

        {/* SET 1: Students who want to learn skills I can teach */}
        {(activeTab === 'both' || activeTab === 'wantWhatITeach') && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  <span>Students who want to learn skills I can teach</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    {wantWhatITeach.length} students
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  These campus peers have explicitly asked to learn skills matching your teaching list.
                </p>
              </div>
            </div>

            {wantWhatITeach.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No students currently seeking your taught skills
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  We compared your skills with all student wishlists. Try adding broader skill terms to "What can you teach?" above (e.g., Python, Web Development, Math, or Design), then click "Match my skills" again.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {wantWhatITeach.map((match, idx) => (
                  <MatchCard
                    key={`want-${match.student.id}-${idx}`}
                    match={match}
                    direction="wantsWhatYouTeach"
                    onSelectStudent={onSelectStudent}
                    onProposeSwap={onProposeSwap}
                    onBookPaid={onBookPaid}
                    onOpenGmailCompose={onOpenGmailCompose}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SET 2: Students who can teach skills I want to learn */}
        {(activeTab === 'both' || activeTab === 'teachWhatIWant') && (
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-indigo-500"></span>
                  <span>Students who can teach skills I want to learn</span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300">
                    {teachWhatIWant.length} mentors
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  These students have published mentoring listings matching what you want to learn.
                </p>
              </div>
            </div>

            {teachWhatIWant.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <AlertCircle className="w-8 h-8 text-indigo-500 mx-auto" />
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  No mentors currently offering your wanted skills
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  Try broadening your "What do you want to learn?" terms above (e.g., UI/UX, Figma, Spanish, Video Editing), and run the matcher again.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {teachWhatIWant.map((match, idx) => (
                  <MatchCard
                    key={`teach-${match.student.id}-${idx}`}
                    match={match}
                    direction="teachesWhatYouWant"
                    onSelectStudent={onSelectStudent}
                    onProposeSwap={onProposeSwap}
                    onBookPaid={onBookPaid}
                    onOpenGmailCompose={onOpenGmailCompose}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* SET 3: 100% Reciprocal Swaps */}
        {activeTab === 'reciprocal' && (
          <div className="space-y-4">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-500"></span>
              <span>100% Reciprocal Barter Pairs</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950 text-purple-800 dark:text-purple-300">
                {reciprocalMatches.length} students
              </span>
            </h3>

            {reciprocalMatches.length === 0 ? (
              <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-center space-y-3">
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  No 100% 2-way reciprocal pairs matched right now. Check the "All Matches" tab to see complementary 1-way options!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {reciprocalMatches.map((match, idx) => (
                  <MatchCard
                    key={`recip-${match.student.id}-${idx}`}
                    match={match}
                    direction="reciprocal"
                    onSelectStudent={onSelectStudent}
                    onProposeSwap={onProposeSwap}
                    onBookPaid={onBookPaid}
                    onOpenGmailCompose={onOpenGmailCompose}
                  />
                ))}
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
};

// Subcomponent: Individual Match Card with Dimensional Warm Styling
interface MatchCardProps {
  match: SkillMatchStudent;
  direction: 'wantsWhatYouTeach' | 'teachesWhatYouWant' | 'reciprocal';
  onSelectStudent: (student: Student) => void;
  onProposeSwap: (student: Student) => void;
  onBookPaid: (student: Student) => void;
  onOpenGmailCompose: (student: Student, relevantSkill?: string, sessionType?: 'swap' | 'paid') => void;
}

const MatchCard: React.FC<MatchCardProps> = ({
  match,
  direction,
  onSelectStudent,
  onProposeSwap,
  onBookPaid,
  onOpenGmailCompose
}) => {
  const { student, matchedSkillName, matchScore, sessionType, hourlyRate } = match;

  return (
    <div className="glass-card-3d rounded-3xl p-5 border border-slate-200/90 dark:border-slate-800 flex flex-col justify-between space-y-4 hover:translate-y-[-2px] transition-all group">
      
      {/* Top Header with Avatar & University */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            onClick={() => onSelectStudent(student)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <img
              src={student.avatar}
              alt={student.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-amber-400/30 group-hover:ring-amber-500 transition-all shadow-md"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="font-extrabold text-sm text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {student.name}
                </h4>
                {student.verifiedStudent && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 inline" />
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400">
                <GraduationCap className="w-3 h-3 text-slate-400" />
                <span className="truncate max-w-[150px]">{student.university}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/80 px-2 py-1 rounded-xl text-xs font-bold text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span>{student.rating?.toFixed(1) || '5.0'}</span>
          </div>
        </div>

        {/* Matched Skill Highlight Badge */}
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 space-y-1.5">
          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
            <span className="text-slate-400 dark:text-slate-500">
              {direction === 'wantsWhatYouTeach'
                ? 'Wants to Learn'
                : direction === 'teachesWhatYouWant'
                ? 'Can Teach You'
                : 'Reciprocal Swap'}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">
              {matchScore}% Relevancy
            </span>
          </div>

          <div className="text-xs font-extrabold text-slate-900 dark:text-white">
            {matchedSkillName}
          </div>
        </div>

        {/* Pricing / Session Type */}
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">Session Rate:</span>
          {hourlyRate > 0 ? (
            <span className="font-extrabold text-emerald-700 dark:text-emerald-400">
              ₹{hourlyRate}/hr
            </span>
          ) : (
            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">
              100% Free Barter
            </span>
          )}
        </div>
      </div>

      {/* Action Buttons: Contact via Gmail + Swap/Book */}
      <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
        
        {/* Contact via Gmail (Primary required action) */}
        <button
          type="button"
          onClick={() =>
            onOpenGmailCompose(
              student,
              matchedSkillName,
              hourlyRate > 0 ? 'paid' : 'swap'
            )
          }
          className="w-full py-2.5 px-3 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/50 text-red-700 dark:text-red-300 text-xs font-bold transition-all border border-red-200 dark:border-red-900/60 flex items-center justify-center gap-1.5 active:scale-95"
        >
          <Mail className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
          <span>Contact via Gmail</span>
        </button>

        <div className="flex items-center gap-2">
          {student.openToSwap && (
            <button
              type="button"
              onClick={() => onProposeSwap(student)}
              className="flex-1 py-2 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95"
            >
              <Repeat className="w-3 h-3" />
              <span>Propose Swap</span>
            </button>
          )}

          {hourlyRate > 0 && (
            <button
              type="button"
              onClick={() => onBookPaid(student)}
              className="flex-1 py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1 active:scale-95 shadow-2xs"
            >
              <IndianRupee className="w-3 h-3" />
              <span>Book Session</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onSelectStudent(student)}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="View Full Profile"
          >
            <User className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

    </div>
  );
};
