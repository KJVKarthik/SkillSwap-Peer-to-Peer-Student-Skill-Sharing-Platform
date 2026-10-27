import React, { useState } from 'react';
import { X, Save, Plus, Trash2, Repeat, IndianRupee, GraduationCap, Sparkles } from 'lucide-react';
import { Student, SkillOffered, SkillWanted } from '../types';
import { updateStudent } from '../api';

interface EditProfileModalProps {
  currentUser: Student | null;
  onClose: () => void;
  onProfileUpdated: (updatedStudent: Student) => void;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  currentUser,
  onClose,
  onProfileUpdated,
}) => {
  if (!currentUser) return null;

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [university, setUniversity] = useState(currentUser.university);
  const [major, setMajor] = useState(currentUser.major);
  const [bio, setBio] = useState(currentUser.bio);
  const [hourlyRate, setHourlyRate] = useState(currentUser.hourlyRate);
  const [openToSwap, setOpenToSwap] = useState(currentUser.openToSwap);
  const [location, setLocation] = useState(currentUser.location || 'Campus / Online');

  const [skillsOffered, setSkillsOffered] = useState<SkillOffered[]>([...(currentUser.skillsOffered || [])]);
  const [skillsWanted, setSkillsWanted] = useState<SkillWanted[]>([...(currentUser.skillsWanted || [])]);

  // Form for new skill offered
  const [newOfferName, setNewOfferName] = useState('');
  const [newOfferCat, setNewOfferCat] = useState('Programming');
  const [newOfferLevel, setNewOfferLevel] = useState('Intermediate');
  const [newOfferPrice, setNewOfferPrice] = useState(hourlyRate);

  // Form for new skill wanted
  const [newWantName, setNewWantName] = useState('');
  const [newWantNotes, setNewWantNotes] = useState('');

  const [saving, setSaving] = useState(false);

  const handleAddOfferedSkill = () => {
    if (!newOfferName.trim()) return;
    const newSkill: SkillOffered = {
      id: `so-${Date.now()}`,
      name: newOfferName.trim(),
      category: newOfferCat,
      level: newOfferLevel,
      description: `Tutoring and mentoring in ${newOfferName}`,
      isSwapAvailable: true,
      hourlyPrice: Number(newOfferPrice) || 0,
    };
    setSkillsOffered([...skillsOffered, newSkill]);
    setNewOfferName('');
  };

  const handleRemoveOfferedSkill = (id: string) => {
    setSkillsOffered(skillsOffered.filter((s) => s.id !== id));
  };

  const handleAddWantedSkill = () => {
    if (!newWantName.trim()) return;
    const newWanted: SkillWanted = {
      id: `sw-${Date.now()}`,
      name: newWantName.trim(),
      category: 'General',
      level: 'Beginner',
      notes: newWantNotes.trim() || 'Looking to swap peer lessons',
    };
    setSkillsWanted([...skillsWanted, newWanted]);
    setNewWantName('');
    setNewWantNotes('');
  };

  const handleRemoveWantedSkill = (id: string) => {
    setSkillsWanted(skillsWanted.filter((s) => s.id !== id));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateStudent(currentUser.id, {
        name,
        email,
        university,
        major,
        bio,
        hourlyRate: Number(hourlyRate) || 0,
        openToSwap,
        location,
        skillsOffered,
        skillsWanted,
      });
      onProfileUpdated(updated);
      onClose();
    } catch (err: any) {
      alert(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-800">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold">Edit Profile & Skill Pricing</h2>
            <p className="text-xs text-amber-100 mt-0.5">
              Update your hourly rates in Indian Rupees (₹), barter availability, and skills
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* Basic Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Campus Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                University
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Major
              </label>
              <input
                type="text"
                value={major}
                onChange={(e) => setMajor(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
              />
            </div>
          </div>

          {/* Pricing in ₹ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
                <span>Default Hourly Rate (₹/hr)</span>
                <span className="text-[10px] text-slate-400">0 = free barter</span>
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
                Open to 1-on-1 Free Skill Barters
              </span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Bio
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-sans"
            />
          </div>

          {/* What Skills Can You Teach */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                What skills can you teach? ({skillsOffered.length})
              </h3>
            </div>

            {/* List of currently offered */}
            <div className="space-y-2">
              {skillsOffered.map((sk) => (
                <div
                  key={sk.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white mr-2">{sk.name}</span>
                    <span className="text-[10px] text-slate-500 mr-2">({sk.category} • {sk.level})</span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      {sk.hourlyPrice ? `₹${sk.hourlyPrice}/hr` : 'Free Barter'}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveOfferedSkill(sk.id)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Inline add form */}
            <div className="p-3 rounded-2xl bg-amber-50/40 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
              <input
                type="text"
                placeholder="Skill name (e.g. Python, Guitar)"
                value={newOfferName}
                onChange={(e) => setNewOfferName(e.target.value)}
                className="sm:col-span-5 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
              <select
                value={newOfferCat}
                onChange={(e) => setNewOfferCat(e.target.value)}
                className="sm:col-span-3 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              >
                <option value="Programming">Programming</option>
                <option value="Design">Design</option>
                <option value="Music">Music</option>
                <option value="Academics">Academics</option>
                <option value="Languages">Languages</option>
                <option value="Media">Media</option>
                <option value="Business">Business</option>
                <option value="Career">Career</option>
              </select>
              <div className="sm:col-span-2 relative">
                <IndianRupee className="w-3 h-3 absolute left-2 top-3 text-emerald-600" />
                <input
                  type="number"
                  placeholder="₹/hr"
                  value={newOfferPrice}
                  onChange={(e) => setNewOfferPrice(Number(e.target.value))}
                  className="w-full pl-6 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                />
              </div>
              <button
                type="button"
                onClick={handleAddOfferedSkill}
                disabled={!newOfferName.trim()}
                className="sm:col-span-2 py-2 px-3 rounded-xl bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-xs hover:bg-slate-800 disabled:opacity-40"
              >
                + Add
              </button>
            </div>
          </div>

          {/* What Skills Do You Want to Learn */}
          <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-indigo-700 dark:text-indigo-400">
              What skills do you want to learn? ({skillsWanted.length})
            </h3>

            <div className="space-y-2">
              {skillsWanted.map((sk) => (
                <div
                  key={sk.id}
                  className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <span className="font-bold text-indigo-950 dark:text-indigo-200 mr-2">{sk.name}</span>
                    {sk.notes && <span className="text-[11px] text-indigo-600/80 dark:text-indigo-400">({sk.notes})</span>}
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveWantedSkill(sk.id)}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-200/60 dark:border-indigo-900/40 grid grid-cols-1 sm:grid-cols-12 gap-2 text-xs">
              <input
                type="text"
                placeholder="Skill you want to learn"
                value={newWantName}
                onChange={(e) => setNewWantName(e.target.value)}
                className="sm:col-span-6 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
              <input
                type="text"
                placeholder="Notes / Goal (optional)"
                value={newWantNotes}
                onChange={(e) => setNewWantNotes(e.target.value)}
                className="sm:col-span-4 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
              />
              <button
                type="button"
                onClick={handleAddWantedSkill}
                disabled={!newWantName.trim()}
                className="sm:col-span-2 py-2 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 disabled:opacity-40"
              >
                + Add
              </button>
            </div>
          </div>

          {/* Footer Save */}
          <div className="pt-4 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs transition-colors shadow-md flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>

        </form>

      </div>
    </div>
  );
};
