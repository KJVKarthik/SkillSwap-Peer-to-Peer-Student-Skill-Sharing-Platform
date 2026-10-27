import React, { useState } from 'react';
import { X, Repeat, Calendar, Clock, Send, Sparkles, Mail, CheckCircle, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student } from '../types';
import { createRequest } from '../api';

interface SwapRequestModalProps {
  targetStudent: Student | null;
  currentUser: Student | null;
  onClose: () => void;
  onRequestCreated: () => void;
}

export const SwapRequestModal: React.FC<SwapRequestModalProps> = ({
  targetStudent,
  currentUser,
  onClose,
  onRequestCreated,
}) => {
  if (!targetStudent) return null;

  const [requestedSkill, setRequestedSkill] = useState(
    targetStudent.skillsOffered?.[0]?.name || 'General Tutoring'
  );
  const [offeredSkill, setOfferedSkill] = useState(
    currentUser?.skillsOffered?.[0]?.name || 'Python'
  );
  const [durationHours, setDurationHours] = useState(1);
  const [scheduledTime, setScheduledTime] = useState('Tomorrow at 5:00 PM IST');
  const [notes, setNotes] = useState(
    `Hey ${targetStudent.name}! I'd love to swap skills with you. I can help you with ${currentUser?.skillsOffered?.[0]?.name || 'my skills'} if you can teach me ${targetStudent.skillsOffered?.[0]?.name || 'your skill'}. Let's do a 1-on-1 session!`
  );
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ gmailUrl: string; reqId: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await createRequest({
        requesterId: currentUser?.id || 'guest',
        providerId: targetStudent.id,
        type: 'swap',
        offeredSkill,
        requestedSkill,
        durationHours,
        scheduledTime,
        notes,
        meetingPlatform: 'Google Meet',
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setSuccessData({
        gmailUrl: res.gmailComposeUrl,
        reqId: res.request.id,
      });

      onRequestCreated();
    } catch (err: any) {
      alert(err.message || 'Failed to submit swap request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col">
        
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
              <Repeat className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              1-on-1 Free Skill Swap (₹0)
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mt-1">
            Propose Skill Swap with {targetStudent.name}
          </h2>
          <p className="text-xs text-amber-100 mt-0.5">
            Reciprocal peer knowledge exchange with no money required.
          </p>
        </div>

        {/* Confirmation Screen */}
        {successData ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Swap Proposal Sent!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Your proposal to trade <strong>{offeredSkill}</strong> for <strong>{requestedSkill}</strong> has been logged in "My swaps".
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <a
                href={successData.gmailUrl}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-2.5 px-3 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow flex items-center justify-center gap-1.5"
              >
                <Mail className="w-4 h-4" />
                <span>Open Gmail Compose</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              >
                Close
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {/* Student Preview */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={targetStudent.avatar}
                  alt={targetStudent.name}
                  className="w-10 h-10 rounded-xl object-cover"
                />
                <div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white block">
                    {targetStudent.name}
                  </span>
                  <span className="text-[11px] text-slate-500 dark:text-slate-400">
                    {targetStudent.university}
                  </span>
                </div>
              </div>

              <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                Free 1:1 Barter
              </span>
            </div>

            {/* What you want them to teach you */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Skill you want from {targetStudent.name}
              </label>
              {targetStudent.skillsOffered && targetStudent.skillsOffered.length > 0 ? (
                <select
                  value={requestedSkill}
                  onChange={(e) => setRequestedSkill(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500"
                >
                  {targetStudent.skillsOffered.map((sk) => (
                    <option key={sk.id} value={sk.name}>
                      {sk.name} ({sk.level})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={requestedSkill}
                  onChange={(e) => setRequestedSkill(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                />
              )}
            </div>

            {/* What you offer in return */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Skill you will teach in exchange
              </label>
              {currentUser?.skillsOffered && currentUser.skillsOffered.length > 0 ? (
                <select
                  value={offeredSkill}
                  onChange={(e) => setOfferedSkill(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500"
                >
                  {currentUser.skillsOffered.map((sk) => (
                    <option key={sk.id} value={sk.name}>
                      {sk.name} ({sk.level})
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={offeredSkill}
                  onChange={(e) => setOfferedSkill(e.target.value)}
                  placeholder="e.g. Python, UI/UX Design, Guitar"
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                  required
                />
              )}
            </div>

            {/* Duration Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Duration (Each peer teaches for half or full session)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 1.5, 2, 3].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDurationHours(dur)}
                    className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                      durationHours === dur
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {dur} {dur === 1 ? 'hr' : 'hrs'}
                  </button>
                ))}
              </div>
            </div>

            {/* Suggested Date/Time */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>Suggest a Date / Time</span>
              </label>
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="e.g. Tomorrow at 5:00 PM IST"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500"
                required
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Notes for {targetStudent.name}
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Submit Actions */}
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
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-amber-500 dark:hover:bg-amber-400 text-white dark:text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Proposing...' : 'Send Swap Proposal ($0)'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
