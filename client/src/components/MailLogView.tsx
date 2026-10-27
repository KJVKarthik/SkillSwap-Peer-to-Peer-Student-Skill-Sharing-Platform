import React, { useState } from 'react';
import { Mail, Clock, ShieldAlert, ExternalLink, CheckCircle2, Search, RefreshCw, User, Sparkles } from 'lucide-react';
import { MailLogEntry, Student } from '../types';
import { buildGmailComposeUrl } from '../api';

interface MailLogViewProps {
  mailLogs: MailLogEntry[];
  currentUser: Student | null;
  onRefresh: () => void;
  onSelectStudentByEmail?: (email: string) => void;
}

export const MailLogView: React.FC<MailLogViewProps> = ({
  mailLogs,
  currentUser,
  onRefresh,
  onSelectStudentByEmail
}) => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'swap' | 'paid'>('all');
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 500);
  };

  const filteredLogs = mailLogs.filter((log) => {
    const matchesSearch =
      log.mentorName.toLowerCase().includes(search.toLowerCase()) ||
      log.skillName.toLowerCase().includes(search.toLowerCase()) ||
      log.subject.toLowerCase().includes(search.toLowerCase()) ||
      log.mentorEmail.toLowerCase().includes(search.toLowerCase());

    const matchesType =
      filterType === 'all'
        ? true
        : filterType === 'swap'
        ? log.sessionType.toLowerCase().includes('swap')
        : log.sessionType.toLowerCase().includes('paid');

    return matchesSearch && matchesType;
  });

  const handleReopenInGmail = (log: MailLogEntry) => {
    const url = buildGmailComposeUrl(log.mentorEmail, log.subject, log.body);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-700 text-white p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-3xl relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 mb-3">
            <Mail className="w-3.5 h-3.5" />
            Gmail Browser Compose Tracker
          </div>
          
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Mail Log & Contact Drafts
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-rose-100 leading-relaxed">
            Every time you initiate a "Contact via Gmail" action to reach out to a student mentor or swapper, the drafted inquiry is cataloged here with its recipient, skill topic, and compose launch status.
          </p>
        </div>
      </div>

      {/* Required Permission & Disclaimer Notice */}
      <div className="p-4 sm:p-5 rounded-3xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 shadow-sm flex items-start gap-3.5">
        <div className="p-2 rounded-2xl bg-amber-100 dark:bg-amber-900/60 text-amber-700 dark:text-amber-300 shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs sm:text-sm font-bold text-amber-900 dark:text-amber-200">
            Browser Draft Tracking vs. Outbound Email Delivery
          </h4>
          <p className="text-xs text-amber-800 dark:text-amber-300/90 leading-relaxed">
            SkillSwap tracks that a Gmail web compose window was opened with your prefilled details. Because the draft launches securely directly in your browser without requiring personal Google account OAuth tokens or inbox read/send credentials, <strong>SkillSwap cannot confirm whether Gmail actually transmitted the message</strong> unless a full Google Workspace OAuth integration with the <code className="px-1.5 py-0.5 rounded bg-amber-200/60 dark:bg-amber-900 text-[11px] font-mono">gmail.send</code> scope is implemented.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search mail logs by mentor, skill or subject..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 text-xs font-medium focus:ring-2 focus:ring-red-500 shadow-2xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterType === 'all'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              All ({mailLogs.length})
            </button>
            <button
              onClick={() => setFilterType('swap')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterType === 'swap'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Swaps
            </button>
            <button
              onClick={() => setFilterType('paid')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                filterType === 'paid'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Paid Sessions
            </button>
          </div>

          <button
            onClick={handleRefresh}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title="Refresh logs"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Logs Table / Cards */}
      {filteredLogs.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <Mail className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
            No Mail Draft Logs Yet
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Click "Contact via Gmail" on any mentor profile, listing, or matchmaker result to open a prefilled Gmail compose draft. It will automatically be logged here.
          </p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm hover:shadow-md transition-shadow space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                
                {/* Mentor & Subject */}
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-2xl bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900/60 flex items-center justify-center text-red-600 dark:text-red-400 shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                        To: {log.mentorName}
                      </span>
                      {log.mentorUniversity && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-semibold">
                          {log.mentorUniversity}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                        ({log.mentorEmail})
                      </span>
                    </div>

                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                      {log.subject}
                    </h4>
                  </div>
                </div>

                {/* Status Badges */}
                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                    Draft Opened in Gmail
                  </span>

                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {log.sessionType}
                  </span>
                </div>

              </div>

              {/* Message preview */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 text-xs font-sans text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap max-h-32 overflow-y-auto">
                {log.body}
              </div>

              {/* Footer row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400 dark:text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800/60">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 font-medium">
                    <Clock className="w-3.5 h-3.5" />
                    Drafted {new Date(log.createdAt).toLocaleString()}
                  </span>
                  <span>•</span>
                  <span>Initiated by: <strong>{log.senderName}</strong></span>
                </div>

                <button
                  type="button"
                  onClick={() => handleReopenInGmail(log)}
                  className="inline-flex items-center gap-1 text-xs font-bold text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:underline"
                >
                  <Mail className="w-3.5 h-3.5" />
                  Re-open Draft in Gmail
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
