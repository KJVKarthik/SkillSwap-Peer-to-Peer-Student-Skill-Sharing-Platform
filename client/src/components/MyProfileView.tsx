import React, { useState } from 'react';
import { 
  User, GraduationCap, MapPin, Mail, IndianRupee, Repeat, Star, 
  Edit3, Plus, Trash2, Sparkles, Inbox, CheckCircle, ExternalLink, Copy, Check 
} from 'lucide-react';
import { Student, SkillOffered, SkillWanted, Review, SwapRequest } from '../types';
import { updateStudent, openGmailCompose } from '../api';

interface MyProfileViewProps {
  currentUser: Student | null;
  onOpenEditProfile: () => void;
  onNavigateTab: (tab: 'explore' | 'matchmaker' | 'exchanges' | 'gmail' | 'profile') => void;
  onProfileUpdated: (student: Student) => void;
  requests: SwapRequest[];
}

export const MyProfileView: React.FC<MyProfileViewProps> = ({
  currentUser,
  onOpenEditProfile,
  onNavigateTab,
  onProfileUpdated,
  requests,
}) => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [newOfferName, setNewOfferName] = useState('');
  const [newOfferCategory, setNewOfferCategory] = useState('Programming');
  const [newOfferLevel, setNewOfferLevel] = useState('Intermediate');
  const [newOfferPrice, setNewOfferPrice] = useState(currentUser?.hourlyRate || 500);

  const [newWantName, setNewWantName] = useState('');
  const [newWantNotes, setNewWantNotes] = useState('');
  const [addingSkill, setAddingSkill] = useState(false);
  const [addingWant, setAddingWant] = useState(false);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <User className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">No Active Profile Selected</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Please select or register a student profile.</p>
      </div>
    );
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(currentUser.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOfferName.trim()) return;

    const newSkill: SkillOffered = {
      id: `so-${Date.now()}`,
      name: newOfferName.trim(),
      category: newOfferCategory,
      level: newOfferLevel,
      description: `Peer lessons in ${newOfferName.trim()}`,
      isSwapAvailable: true,
      hourlyPrice: Number(newOfferPrice) || 0,
    };

    const updatedSkills = [...(currentUser.skillsOffered || []), newSkill];
    try {
      const updated = await updateStudent(currentUser.id, {
        skillsOffered: updatedSkills,
      });
      onProfileUpdated(updated);
      setNewOfferName('');
      setAddingSkill(false);
    } catch (err: any) {
      alert(err.message || 'Failed to add skill');
    }
  };

  const handleRemoveSkill = async (id: string) => {
    const updatedSkills = (currentUser.skillsOffered || []).filter((s) => s.id !== id);
    try {
      const updated = await updateStudent(currentUser.id, {
        skillsOffered: updatedSkills,
      });
      onProfileUpdated(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to remove skill');
    }
  };

  const handleAddWantedSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWantName.trim()) return;

    const newWanted: SkillWanted = {
      id: `sw-${Date.now()}`,
      name: newWantName.trim(),
      category: 'General',
      level: 'Beginner',
      notes: newWantNotes.trim() || 'Looking to swap lessons',
    };

    const updatedWanted = [...(currentUser.skillsWanted || []), newWanted];
    try {
      const updated = await updateStudent(currentUser.id, {
        skillsWanted: updatedWanted,
      });
      onProfileUpdated(updated);
      setNewWantName('');
      setNewWantNotes('');
      setAddingWant(false);
    } catch (err: any) {
      alert(err.message || 'Failed to add wanted skill');
    }
  };

  const handleRemoveWantedSkill = async (id: string) => {
    const updatedWanted = (currentUser.skillsWanted || []).filter((s) => s.id !== id);
    try {
      const updated = await updateStudent(currentUser.id, {
        skillsWanted: updatedWanted,
      });
      onProfileUpdated(updated);
    } catch (err: any) {
      alert(err.message || 'Failed to remove wanted skill');
    }
  };

  const pendingCount = requests.filter(
    (r) => r.providerId === currentUser.id && r.status === 'pending'
  ).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-200">
      
      {/* Profile Banner */}
      <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden border border-amber-500/20">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-white/30 shadow-lg"
              />
              <span className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow">
                <CheckCircle className="w-4 h-4 text-amber-500 fill-amber-100" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {currentUser.name}
                </h1>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/20 text-amber-100 border border-white/30 font-bold">
                  Active Student Account
                </span>
              </div>

              <div className="flex items-center gap-2 text-amber-100 text-sm mt-1 flex-wrap font-semibold">
                <span className="flex items-center gap-1 font-medium">
                  <GraduationCap className="w-4 h-4 text-amber-300" />
                  {currentUser.university}
                </span>
                <span>•</span>
                <span>{currentUser.major}</span>
              </div>

              <div className="flex items-center gap-3 mt-2 text-xs text-amber-200/90 flex-wrap">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-amber-300" />
                  {currentUser.location || 'Online / Campus'}
                </span>
                <span>•</span>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1 text-white hover:underline transition-colors font-medium"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-300" />
                  {currentUser.email}
                  {copiedEmail ? <Check className="w-3 h-3 text-emerald-300" /> : <Copy className="w-3 h-3" />}
                </button>
              </div>
            </div>
          </div>

          {/* Edit Profile Action */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onOpenEditProfile}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 bg-white text-slate-900 font-extrabold text-xs py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95 hover:bg-amber-100"
            >
              <Edit3 className="w-4 h-4" />
              Edit Profile & Skills
            </button>
          </div>
        </div>

        {/* Bio Strip */}
        {currentUser.bio && (
          <div className="mt-6 pt-4 border-t border-white/20 text-xs text-amber-100 leading-relaxed max-w-3xl">
            "{currentUser.bio}"
          </div>
        )}
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        {/* Hourly Rate */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
            <IndianRupee className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Hourly Tutoring Rate</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {currentUser.hourlyRate > 0 ? `₹${currentUser.hourlyRate} / hr` : 'Free Barter (₹0)'}
            </span>
          </div>
        </div>

        {/* 1-on-1 Barter Status */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400">
            <Repeat className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">1-on-1 Free Barter</span>
            <span className="text-base font-extrabold text-amber-700 dark:text-amber-400">
              {currentUser.openToSwap ? 'Active (Open)' : 'Paid Only'}
            </span>
          </div>
        </div>

        {/* Rating */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/60 text-amber-500">
            <Star className="w-5 h-5 fill-amber-400" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">Peer Review Rating</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1">
              {currentUser.rating ? currentUser.rating.toFixed(1) : '5.0'} <span className="text-xs font-normal text-slate-400">({currentUser.reviewCount} reviews)</span>
            </span>
          </div>
        </div>

        {/* Incoming Requests */}
        <div 
          onClick={() => onNavigateTab('exchanges')}
          className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-center gap-3 cursor-pointer hover:border-amber-300 dark:hover:border-amber-700 transition-colors"
        >
          <div className="p-2.5 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold block">My swaps</span>
            <span className="text-base font-extrabold text-slate-900 dark:text-white">
              {requests.length} total {pendingCount > 0 && <span className="text-xs font-bold text-red-500">({pendingCount} pending)</span>}
            </span>
          </div>
        </div>

      </div>

      {/* Main Grid: Skills Management & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left 8 Cols: Skills Offered & Wanted */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Skills Offered */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Skills You Teach (What you can teach)</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold">
                    {(currentUser.skillsOffered || []).length}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Peers can book these skills for ₹0 1-on-1 barter or hourly paid tutoring.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAddingSkill(!addingSkill)}
                className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/60 dark:text-amber-300 px-3 py-1.5 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Skill
              </button>
            </div>

            {/* Inline Add Skill Form */}
            {addingSkill && (
              <form onSubmit={handleAddSkill} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Add New Skill You Can Teach</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Skill name (e.g. Python, Figma, Guitar)"
                    value={newOfferName}
                    onChange={(e) => setNewOfferName(e.target.value)}
                    className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <select
                    value={newOfferCategory}
                    onChange={(e) => setNewOfferCategory(e.target.value)}
                    className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="Programming">Programming</option>
                    <option value="Design">Design</option>
                    <option value="Academics">Academics</option>
                    <option value="Languages">Languages</option>
                    <option value="Music">Music</option>
                    <option value="Media">Media</option>
                    <option value="Business">Business</option>
                  </select>
                  <select
                    value={newOfferLevel}
                    onChange={(e) => setNewOfferLevel(e.target.value)}
                    className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                    <option value="Native">Native</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Hourly Rate for this skill:</span>
                    <input
                      type="number"
                      min="0"
                      step="50"
                      value={newOfferPrice}
                      onChange={(e) => setNewOfferPrice(Number(e.target.value))}
                      className="w-24 p-1 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold"
                    />
                    <span className="text-slate-400">(₹/hr)</span>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setAddingSkill(false)}
                      className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 px-4 py-1.5 rounded-xl shadow-2xs"
                    >
                      Save Skill
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Skills List */}
            {(currentUser.skillsOffered || []).length === 0 ? (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-400">
                You haven't listed any skills yet. Click "+ Add Skill" above to list your first skill!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(currentUser.skillsOffered || []).map((sk) => (
                  <div
                    key={sk.id}
                    className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:border-amber-300 dark:hover:border-amber-700 transition-colors bg-slate-50/50 dark:bg-slate-800/50 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="font-bold text-slate-900 dark:text-white text-xs">{sk.name}</span>
                        <button
                          type="button"
                          onClick={() => handleRemoveSkill(sk.id)}
                          className="text-slate-300 hover:text-red-500 transition-colors p-0.5"
                          title="Remove skill"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[10px] font-semibold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded">
                          {sk.category}
                        </span>
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded font-medium">
                          {sk.level}
                        </span>
                      </div>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">
                        {sk.hourlyPrice > 0 ? `₹${sk.hourlyPrice} / hr` : 'Free Barter'}
                      </span>
                      {sk.isSwapAvailable && (
                        <span className="text-amber-700 dark:text-amber-400 font-semibold flex items-center gap-0.5">
                          <Repeat className="w-3 h-3" /> Swap ready
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Skills Wanted (Barter Wishlist) */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Skills You Want to Learn (What you want to learn)</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 font-bold">
                    {(currentUser.skillsWanted || []).length}
                  </span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  AI Smart Skill Maker matches you with peers offering these topics.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setAddingWant(!addingWant)}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-700 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:text-indigo-300 px-3 py-1.5 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Wish
              </button>
            </div>

            {/* Inline Add Wish Form */}
            {addingWant && (
              <form onSubmit={handleAddWantedSkill} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 space-y-3 animate-in fade-in">
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Add Skill You Want to Learn</h4>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    required
                    placeholder="e.g. Guitar, UI/UX, Spanish"
                    value={newWantName}
                    onChange={(e) => setNewWantName(e.target.value)}
                    className="flex-1 text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                  <input
                    type="text"
                    placeholder="Short note or goal"
                    value={newWantNotes}
                    onChange={(e) => setNewWantNotes(e.target.value)}
                    className="flex-1 text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setAddingWant(false)}
                    className="text-xs text-slate-500 hover:text-slate-700 px-3 py-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-xl shadow-2xs"
                  >
                    Save Wish
                  </button>
                </div>
              </form>
            )}

            {/* Wishlist Grid */}
            {(currentUser.skillsWanted || []).length === 0 ? (
              <div className="text-center py-8 bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 text-xs text-slate-400">
                No learning goals added yet. Add what you want to learn so peers can propose a swap!
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(currentUser.skillsWanted || []).map((sw) => (
                  <div
                    key={sw.id}
                    className="p-3.5 rounded-2xl border border-indigo-200/80 dark:border-indigo-900/60 bg-indigo-50/30 dark:bg-indigo-950/30 flex items-start justify-between gap-2"
                  >
                    <div>
                      <span className="font-bold text-slate-900 dark:text-white text-xs block">🎯 {sw.name}</span>
                      {sw.notes && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{sw.notes}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveWantedSkill(sw.id)}
                      className="text-slate-300 hover:text-red-500 transition-colors p-0.5 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right 4 Cols: Quick Actions */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* AI Smart Skill Maker Promo Card */}
          <div className="bg-gradient-to-br from-amber-500 via-orange-600 to-indigo-800 rounded-3xl p-6 text-white shadow-lg space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
            </div>
            <h4 className="text-lg font-bold">AI Smart Skill Maker</h4>
            <p className="text-xs text-amber-100 leading-relaxed">
              Find students who want to learn what you teach, and mentors who teach what you want!
            </p>
            <button
              onClick={() => onNavigateTab('matchmaker')}
              className="w-full mt-2 py-2.5 bg-slate-950 hover:bg-slate-900 text-white font-extrabold text-xs rounded-xl shadow transition-all flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Open AI Smart Skill Maker
            </button>
          </div>

          {/* Direct Gmail Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-red-50 dark:bg-red-950/60 text-red-600">
                <Mail className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">Gmail Web Compose</h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Prefill and open browser Gmail drafts directly to mentor emails without routing to system mail apps.
            </p>
            <button
              onClick={() => onNavigateTab('gmail')}
              className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
            >
              <Mail className="w-3.5 h-3.5" />
              View Mail Log
            </button>
          </div>

          {/* My swaps Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/90 dark:border-slate-800 shadow-sm space-y-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600">
                <Inbox className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white">My swaps</h4>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              You have <strong>{requests.length}</strong> total active or scheduled sessions.
            </p>
            <button
              onClick={() => onNavigateTab('exchanges')}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
            >
              <Inbox className="w-3.5 h-3.5" />
              Open My swaps
            </button>
          </div>

        </div>

      </div>

    </div>
  );
};
