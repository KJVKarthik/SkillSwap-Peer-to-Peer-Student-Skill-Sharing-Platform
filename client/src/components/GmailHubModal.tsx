import React, { useState } from 'react';
import { Mail, Send, ExternalLink, Copy, Check, Clock, ShieldCheck, Inbox, Sparkles, User } from 'lucide-react';
import { EmailNotification, Student } from '../types';
import { openGmailCompose } from '../api';

interface GmailHubModalProps {
  notifications: EmailNotification[];
  students: Student[];
  currentUser: Student | null;
  onRefreshNotifications: () => void;
}

export const GmailHubModal: React.FC<GmailHubModalProps> = ({
  notifications,
  students,
  currentUser,
  onRefreshNotifications,
}) => {
  const [selectedStudentEmail, setSelectedStudentEmail] = useState(students[0]?.email || '');
  const [customSubject, setCustomSubject] = useState('SkillSwap: Quick peer skill exchange question');
  const [customBody, setCustomBody] = useState(
    `Hi,\n\nI saw your profile on the SkillSwap student network and wanted to ask about setting up a peer tutoring / barter session.\n\nBest regards,\n${currentUser?.name || 'A fellow student'}`
  );
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopy = (email: string) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  const handleSendViaGmail = () => {
    if (!selectedStudentEmail) return;
    openGmailCompose(selectedStudentEmail, customSubject, customBody);
  };

  const selectedStudent = students.find((s) => s.email === selectedStudentEmail);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-indigo-700 text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 mb-3">
            <Mail className="w-3.5 h-3.5" />
            Official Gmail & Google Workspace Integration
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Gmail Peer Communication Hub
          </h2>
          <p className="mt-2 text-sm text-rose-100 leading-relaxed">
            Connect directly with fellow students using Gmail. Launch pre-formatted lesson inquiries, send swap barter proposals, and track email notifications for scheduled bookings.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Direct Gmail Composer */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-5">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-red-50 text-red-600">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Direct Gmail Web Composer</h3>
              <p className="text-xs text-slate-500">
                1-click opens Gmail with recipient and prefilled agenda.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Student Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Recipient (Campus Peer)
              </label>
              <select
                value={selectedStudentEmail}
                onChange={(e) => setSelectedStudentEmail(e.target.value)}
                className="w-full text-xs font-semibold p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-red-500"
              >
                {students.map((s) => (
                  <option key={s.id} value={s.email}>
                    {s.name} ({s.university}) — {s.email}
                  </option>
                ))}
              </select>
            </div>

            {selectedStudent && (
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <img
                    src={selectedStudent.avatar}
                    alt={selectedStudent.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">{selectedStudent.name}</span>
                    <span className="text-[11px] text-slate-500">{selectedStudent.email}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(selectedStudent.email)}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-[11px] font-semibold text-slate-600 flex items-center gap-1"
                >
                  {copiedEmail === selectedStudent.email ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" /> Copy Email
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Subject */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Email Subject
              </label>
              <input
                type="text"
                value={customSubject}
                onChange={(e) => setCustomSubject(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 font-medium"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Message Body
              </label>
              <textarea
                rows={5}
                value={customBody}
                onChange={(e) => setCustomBody(e.target.value)}
                className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 font-sans"
              />
            </div>

            {/* Launch Button */}
            <button
              onClick={handleSendViaGmail}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-xs transition-all shadow-md shadow-red-200 flex items-center justify-center gap-2 active:scale-95"
            >
              <Mail className="w-4 h-4" />
              Open Draft in Gmail (mail.google.com)
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Gmail Notification Activity Feed */}
        <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm space-y-4 flex flex-col">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Inbox className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Gmail Activity Log</h3>
                <p className="text-xs text-slate-500">
                  Automated emails dispatched on bookings & proposals
                </p>
              </div>
            </div>

            <button
              onClick={onRefreshNotifications}
              className="text-xs font-semibold text-indigo-600 hover:underline"
            >
              Refresh
            </button>
          </div>

          <div className="overflow-y-auto space-y-3 flex-1 max-h-[500px]">
            {notifications.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-xs">
                No email notifications recorded yet. Proposing a swap or booking a paid session will record notifications here!
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 space-y-2 hover:bg-white hover:border-indigo-200 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-slate-900 text-xs line-clamp-1">
                      {notif.subject}
                    </span>
                    <span className="text-[10px] text-slate-400 shrink-0">
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500">
                    <span>To: <strong>{notif.recipientEmail}</strong></span>
                    <span>•</span>
                    <span>From: <strong>{notif.senderEmail}</strong></span>
                  </div>

                  <pre className="text-[11px] font-sans text-slate-700 bg-white p-3 rounded-xl border border-slate-200 whitespace-pre-wrap leading-relaxed max-h-32 overflow-y-auto">
                    {notif.body}
                  </pre>

                  <div className="pt-1 flex items-center justify-end gap-2">
                    <button
                      onClick={() => openGmailCompose(notif.recipientEmail, notif.subject, notif.body)}
                      className="text-[11px] font-bold text-red-600 hover:text-red-700 flex items-center gap-1"
                    >
                      <Mail className="w-3 h-3" />
                      Open in Gmail
                      <ExternalLink className="w-2.5 h-2.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
