import React, { useState, useEffect } from 'react';
import { X, Mail, ExternalLink, Copy, Check, Sparkles, ShieldCheck, AlertCircle, Repeat, IndianRupee } from 'lucide-react';
import { Student } from '../types';
import { buildGmailComposeUrl, createMailLog } from '../api';

interface GmailComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
  mentor: Student;
  currentUser: Student | null;
  defaultSkill?: string;
  defaultType?: 'swap' | 'paid';
  onDraftOpened?: () => void;
}

export const GmailComposeModal: React.FC<GmailComposeModalProps> = ({
  isOpen,
  onClose,
  mentor,
  currentUser,
  defaultSkill,
  defaultType = 'swap',
  onDraftOpened
}) => {
  if (!isOpen) return null;

  const initialSkill = defaultSkill || mentor.skillsOffered?.[0]?.name || 'Skill Mentoring';
  const [skillName, setSkillName] = useState(initialSkill);
  const [sessionType, setSessionType] = useState<'swap' | 'paid'>(defaultType);

  const getMyOfferedSkill = () => {
    return currentUser?.skillsOffered?.[0]?.name || 'peer skills';
  };

  const generateDefaultSubject = (skill: string, type: 'swap' | 'paid') => {
    return `SkillSwap: ${skill} (${type === 'swap' ? '1-on-1 Free Skill Swap' : 'Paid Mentoring Inquiry'})`;
  };

  const generateDefaultBody = (skill: string, type: 'swap' | 'paid') => {
    const studentName = currentUser?.name || 'A fellow student';
    const studentUni = currentUser?.university || 'University';
    const studentEmail = currentUser?.email || '';

    if (type === 'swap') {
      return `Hi ${mentor.name},\n\nI am ${studentName} from ${studentUni}. I discovered your profile on SkillSwap and noticed you teach "${skill}".\n\nI would love to propose a free 1-on-1 peer skill swap! In return, I can teach you ${getMyOfferedSkill()}.\n\nAre you open to connecting for an hour this week?\n\nBest regards,\n${studentName}${studentEmail ? `\nEmail: ${studentEmail}` : ''}`;
    } else {
      return `Hi ${mentor.name},\n\nI am ${studentName} from ${studentUni}. I saw your mentor listing for "${skill}" on SkillSwap.\n\nI would like to book a 1-on-1 paid tutoring session with you at your hourly rate of ₹${mentor.hourlyRate}/hr.\n\nPlease let me know what days and times work best for your schedule.\n\nBest regards,\n${studentName}${studentEmail ? `\nEmail: ${studentEmail}` : ''}`;
    }
  };

  const [subject, setSubject] = useState(generateDefaultSubject(initialSkill, defaultType));
  const [body, setBody] = useState(generateDefaultBody(initialSkill, defaultType));
  const [copied, setCopied] = useState(false);
  const [popupBlocked, setPopupBlocked] = useState(false);
  const [isOpening, setIsOpening] = useState(false);

  // Update subject and body if sessionType or skillName changes
  const handleTypeChange = (newType: 'swap' | 'paid') => {
    setSessionType(newType);
    setSubject(generateDefaultSubject(skillName, newType));
    setBody(generateDefaultBody(skillName, newType));
  };

  const handleOpenInGmail = async () => {
    setIsOpening(true);
    setPopupBlocked(false);

    try {
      // 1. Log the draft to backend database
      await createMailLog({
        senderId: currentUser?.id,
        senderName: currentUser?.name || 'Campus Student',
        senderEmail: currentUser?.email || 'student@gmail.com',
        mentorId: mentor.id,
        mentorName: mentor.name,
        mentorEmail: mentor.email,
        mentorUniversity: mentor.university,
        skillName: skillName,
        sessionType: sessionType === 'swap' ? 'Free Skill Swap' : 'Paid Mentoring Session',
        hourlyRate: mentor.hourlyRate || 0,
        subject: subject,
        body: body,
        draftOpened: true
      });

      // 2. Open Gmail Web Compose directly in a new browser tab
      const url = buildGmailComposeUrl(mentor.email, subject, body);
      const win = window.open(url, '_blank', 'noopener,noreferrer');

      if (!win || win.closed || typeof win.closed === 'undefined') {
        // Popup was blocked by browser
        setPopupBlocked(true);
      } else {
        if (onDraftOpened) onDraftOpened();
        onClose();
      }
    } catch (err) {
      console.error('Error opening Gmail draft:', err);
      // Still open Gmail URL even if log fails
      const url = buildGmailComposeUrl(mentor.email, subject, body);
      window.open(url, '_blank', 'noopener,noreferrer');
      onClose();
    } finally {
      setIsOpening(false);
    }
  };

  const handleCopyMessage = () => {
    const textToCopy = `To: ${mentor.email}\nSubject: ${subject}\n\n${body}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Mail className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-base font-extrabold tracking-tight">
                Contact via Gmail Compose
              </h3>
              <p className="text-xs text-rose-100">
                Prefills mentor email, topic & message directly in your browser
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mentor Preview Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img
              src={mentor.avatar}
              alt={mentor.name}
              className="w-10 h-10 rounded-2xl object-cover ring-2 ring-amber-400/30"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 dark:text-white">
                  {mentor.name}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-bold border border-amber-200 dark:border-amber-800">
                  {mentor.university}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Recipient: <strong className="text-slate-700 dark:text-slate-300">{mentor.email}</strong>
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
              {mentor.hourlyRate > 0 ? `₹${mentor.hourlyRate}/hr` : 'Free Barter'}
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
              Verified Mentor
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Session Intent Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              What kind of session are you inquiring about?
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleTypeChange('swap')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  sessionType === 'swap'
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 dark:border-indigo-500 shadow-2xs'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                Free Skill Swap (₹0)
              </button>

              <button
                type="button"
                onClick={() => handleTypeChange('paid')}
                className={`p-2.5 rounded-xl border text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  sessionType === 'paid'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 dark:border-emerald-500 shadow-2xs'
                    : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <IndianRupee className="w-3.5 h-3.5" />
                Paid Mentoring ({mentor.hourlyRate > 0 ? `₹${mentor.hourlyRate}/hr` : 'Hourly'})
              </button>
            </div>
          </div>

          {/* Relevant Skill Selector / Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Relevant Skill
            </label>
            {mentor.skillsOffered && mentor.skillsOffered.length > 1 ? (
              <select
                value={skillName}
                onChange={(e) => {
                  setSkillName(e.target.value);
                  setSubject(generateDefaultSubject(e.target.value, sessionType));
                  setBody(generateDefaultBody(e.target.value, sessionType));
                }}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-red-500"
              >
                {mentor.skillsOffered.map((sk) => (
                  <option key={sk.id} value={sk.name}>
                    {sk.name} ({sk.category}) {sk.hourlyPrice ? `— ₹${sk.hourlyPrice}/hr` : ''}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={skillName}
                onChange={(e) => setSkillName(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-semibold focus:ring-2 focus:ring-red-500"
              />
            )}
          </div>

          {/* Subject Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Gmail Subject (Editable)
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-medium focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Body Field */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center justify-between">
              <span>Message Body (Editable)</span>
              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copied!' : 'Copy drafted text'}
              </button>
            </label>
            <textarea
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-sans focus:ring-2 focus:ring-red-500 leading-relaxed"
            />
          </div>

          {/* Privacy & Browser Safety Guarantee Note */}
          <div className="p-3 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-800/50 text-[11px] text-amber-900 dark:text-amber-200 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>Web Browser Gmail Direct Guarantee</span>
            </div>
            <p className="text-[10px] leading-relaxed text-amber-800 dark:text-amber-300/90">
              This opens a web compose tab on <strong>mail.google.com</strong>. It will <strong>never launch Apple Mail</strong> or any default system mail app. No email sends automatically — you review and click Send yourself in Gmail.
            </p>
          </div>

          {/* Popup blocked fallback */}
          {popupBlocked && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-xs text-rose-800 dark:text-rose-200 space-y-2">
              <div className="flex items-center gap-1.5 font-bold">
                <AlertCircle className="w-4 h-4 text-rose-600" />
                <span>Popup window was blocked by your browser</span>
              </div>
              <p className="text-[11px]">
                Click below to open the draft link directly or copy your drafted text:
              </p>
              <div className="flex items-center gap-2">
                <a
                  href={buildGmailComposeUrl(mentor.email, subject, body)}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs inline-flex items-center gap-1"
                >
                  Click to Open Gmail Draft <ExternalLink className="w-3 h-3" />
                </a>
                <button
                  type="button"
                  onClick={handleCopyMessage}
                  className="px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-bold text-xs"
                >
                  {copied ? 'Copied!' : 'Copy Content'}
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer actions */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleOpenInGmail}
            disabled={isOpening}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-xs font-extrabold flex items-center gap-2 shadow-md shadow-red-500/20 active:scale-95 transition-all"
          >
            <Mail className="w-4 h-4" />
            <span>Open in Gmail Web Compose</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
