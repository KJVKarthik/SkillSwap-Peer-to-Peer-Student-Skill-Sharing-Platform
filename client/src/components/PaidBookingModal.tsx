import React, { useState } from 'react';
import { X, IndianRupee, Calendar, Clock, Send, CheckCircle, Mail, ExternalLink, Video } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student } from '../types';
import { createRequest } from '../api';

interface PaidBookingModalProps {
  targetStudent: Student | null;
  currentUser: Student | null;
  onClose: () => void;
  onRequestCreated: () => void;
}

export const PaidBookingModal: React.FC<PaidBookingModalProps> = ({
  targetStudent,
  currentUser,
  onClose,
  onRequestCreated,
}) => {
  if (!targetStudent) return null;

  const hourlyRate = targetStudent.hourlyRate || 500;
  const [requestedSkill, setRequestedSkill] = useState(
    targetStudent.skillsOffered?.[0]?.name || 'General Tutoring'
  );
  const [durationHours, setDurationHours] = useState(1);
  const [scheduledTime, setScheduledTime] = useState('Wednesday at 4:00 PM IST');
  const [notes, setNotes] = useState(
    `Hi ${targetStudent.name}, I would like to book a 1-on-1 paid tutoring session for ${targetStudent.skillsOffered?.[0]?.name || 'this skill'}. Please let me know if this time works for you!`
  );
  const [submitting, setSubmitting] = useState(false);
  const [successData, setSuccessData] = useState<{ gmailUrl: string; totalAmount: number } | null>(null);

  const totalAmount = Math.round(hourlyRate * durationHours);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await createRequest({
        requesterId: currentUser?.id || 'guest',
        providerId: targetStudent.id,
        type: 'paid',
        requestedSkill,
        durationHours,
        scheduledTime,
        notes,
        meetingPlatform: 'Google Meet',
      });

      confetti({
        particleCount: 120,
        spread: 75,
        origin: { y: 0.6 },
      });

      setSuccessData({
        gmailUrl: res.gmailComposeUrl,
        totalAmount,
      });

      onRequestCreated();
    } catch (err: any) {
      alert(err.message || 'Failed to book session');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-600 via-teal-700 to-emerald-800 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="p-1.5 rounded-xl bg-white/20 text-white">
              <IndianRupee className="w-5 h-5" />
            </span>
            <span className="text-xs uppercase font-extrabold tracking-wider bg-white/20 px-2 py-0.5 rounded-full">
              Hourly Paid Tutoring
            </span>
          </div>

          <h2 className="text-xl font-bold text-white mt-1">
            Book Session with {targetStudent.name}
          </h2>
          <p className="text-xs text-emerald-100 mt-0.5">
            Rate: ₹{hourlyRate}/hr • Indian Rupees (₹)
          </p>
        </div>

        {/* Success confirmation */}
        {successData ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Tutoring Session Booked!
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                Total: <strong>₹{successData.totalAmount}</strong> for {durationHours} hour(s) with {targetStudent.name}.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-left text-xs space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Scheduled Time:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{scheduledTime}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Meeting:</span>
                <span className="font-bold text-indigo-600">Google Meet (Auto-generated)</span>
              </div>
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
            
            {/* Student Info Pill */}
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

              <div className="text-right">
                <span className="text-xs font-extrabold text-emerald-600 dark:text-emerald-400 block">
                  ₹{hourlyRate}/hr
                </span>
                <span className="text-[10px] text-slate-400">Standard Rate</span>
              </div>
            </div>

            {/* Select Skill */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Select Skill to Learn
              </label>
              {targetStudent.skillsOffered && targetStudent.skillsOffered.length > 0 ? (
                <select
                  value={requestedSkill}
                  onChange={(e) => setRequestedSkill(e.target.value)}
                  className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500"
                >
                  {targetStudent.skillsOffered.map((sk) => (
                    <option key={sk.id} value={sk.name}>
                      {sk.name} ({sk.level}) {sk.hourlyPrice ? `— ₹${sk.hourlyPrice}/hr` : ''}
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

            {/* Duration Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Session Duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[1, 1.5, 2, 3].map((dur) => (
                  <button
                    key={dur}
                    type="button"
                    onClick={() => setDurationHours(dur)}
                    className={`py-2 rounded-xl text-xs font-extrabold border transition-all ${
                      durationHours === dur
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {dur} {dur === 1 ? 'hr' : 'hrs'}
                  </button>
                ))}
              </div>
            </div>

            {/* Live Price Calculation Banner */}
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] font-bold text-emerald-800 dark:text-emerald-300 block">
                  Total Session Cost:
                </span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400">
                  {durationHours} hr × ₹{hourlyRate}/hr
                </span>
              </div>
              <span className="text-lg font-black text-emerald-700 dark:text-emerald-300">
                ₹{totalAmount}
              </span>
            </div>

            {/* Scheduled Date/Time Suggestion */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                <span>Suggest a Date / Time</span>
              </label>
              <input
                type="text"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                placeholder="e.g. Wednesday at 5:00 PM IST or Weekend Mornings"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500"
                required
              />
            </div>

            {/* Notes / Agenda */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Notes / What you'd like to focus on
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Submit */}
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
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-md shadow-emerald-500/20 active:scale-95"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submitting ? 'Booking...' : `Confirm Booking (₹${totalAmount})`}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
