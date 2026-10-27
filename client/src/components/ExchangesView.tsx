import React, { useState } from 'react';
import { Inbox, Repeat, IndianRupee, Calendar, Clock, Video, CheckCircle, XCircle, Star, Mail, ExternalLink, MessageSquare, ArrowUpRight, ArrowDownLeft, CheckCircle2 } from 'lucide-react';
import { SwapRequest, Student } from '../types';
import { updateRequestStatus, openGmailCompose } from '../api';

interface ExchangesViewProps {
  requests: SwapRequest[];
  currentUser: Student | null;
  onRefresh: () => void;
  onSelectStudentById: (studentId: string) => void;
  onOpenReviewModalForStudent: (studentId: string) => void;
  onOpenGmailCompose?: (student: Student, relevantSkill?: string, sessionType?: 'swap' | 'paid') => void;
}

export const ExchangesView: React.FC<ExchangesViewProps> = ({
  requests,
  currentUser,
  onRefresh,
  onSelectStudentById,
  onOpenReviewModalForStudent,
  onOpenGmailCompose
}) => {
  const [filter, setFilter] = useState<'all' | 'incoming' | 'outgoing' | 'accepted' | 'completed'>('all');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);

  const incomingCount = requests.filter(r => currentUser && r.providerId === currentUser.id && r.status === 'pending').length;
  const sentCount = requests.filter(r => currentUser && r.requesterId === currentUser.id).length;
  const completedCount = requests.filter(r => r.status === 'completed').length;

  const filteredRequests = requests.filter((r) => {
    if (!currentUser) return true;
    if (filter === 'incoming') return r.providerId === currentUser.id;
    if (filter === 'outgoing') return r.requesterId === currentUser.id;
    if (filter === 'accepted') return r.status === 'accepted';
    if (filter === 'completed') return r.status === 'completed';
    return true;
  });

  const handleStatusChange = async (requestId: string, newStatus: 'accepted' | 'declined' | 'completed') => {
    setLoadingAction(requestId);
    try {
      await updateRequestStatus(requestId, newStatus);
      onRefresh();
    } catch (err: any) {
      alert(err.message || 'Failed to update request status');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleOpenGmail = (req: SwapRequest) => {
    const isRequester = currentUser && req.requesterId === currentUser.id;
    const recipientEmail = isRequester ? req.providerEmail : req.requesterEmail;
    const recipientName = isRequester ? req.providerName : req.requesterName;

    openGmailCompose(
      recipientEmail,
      `SkillSwap: Follow-up regarding ${req.requestedSkill}`,
      `Hi ${recipientName},\n\nFollowing up regarding our SkillSwap session for "${req.requestedSkill}".\n\nScheduled: ${req.scheduledTime}\nMeeting: ${req.meetingLink || 'Google Meet'}\n\nBest regards,\n${currentUser?.name || ''}`
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              My swaps
            </h2>
            <span className="text-xs bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 font-bold px-2.5 py-0.5 rounded-full border border-amber-200 dark:border-amber-800">
              {filteredRequests.length} sessions
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track all sent and received swap proposals, accepted appointments, and completed sessions.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'all'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All ({requests.length})
          </button>

          <button
            onClick={() => setFilter('incoming')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
              filter === 'incoming'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5 text-amber-500" />
            <span>Received</span>
            {incomingCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-extrabold flex items-center justify-center animate-pulse">
                {incomingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setFilter('outgoing')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
              filter === 'outgoing'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5 text-indigo-500" />
            <span>Sent ({sentCount})</span>
          </button>

          <button
            onClick={() => setFilter('accepted')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'accepted'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Accepted
          </button>

          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filter === 'completed'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>
      </div>

      {/* Requests List */}
      {filteredRequests.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
          <Inbox className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-base">
            No Swaps Found in this Tab
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1">
            Browse the Explore directory or launch AI Smart Skill Maker to propose a free 1-on-1 skill swap or book a tutoring session!
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredRequests.map((req) => {
            const isRequester = currentUser && req.requesterId === currentUser.id;
            const isProvider = currentUser && req.providerId === currentUser.id;

            return (
              <div
                key={req.id}
                className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  
                  {/* Left Side: Type, Details & Participants */}
                  <div className="space-y-3 flex-1">
                    
                    {/* Header Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {req.type === 'swap' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                          <Repeat className="w-3.5 h-3.5" />
                          1-on-1 Free Skill Swap (₹0)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <IndianRupee className="w-3.5 h-3.5" />
                          Paid Mentoring Session (₹{req.totalAmount})
                        </span>
                      )}

                      {/* Direction Tag */}
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                        {isRequester ? 'Sent by You' : isProvider ? 'Received by You' : 'Peer Request'}
                      </span>

                      {/* Status Badge */}
                      <span
                        className={`text-xs font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                          req.status === 'accepted'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                            : req.status === 'pending'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                            : req.status === 'completed'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 border border-blue-200 dark:border-blue-800'
                            : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                        }`}
                      >
                        {req.status}
                      </span>

                      <span className="text-xs text-slate-400 ml-auto">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Skill Details */}
                    <div>
                      {req.type === 'swap' ? (
                        <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                          <span className="text-indigo-600 dark:text-indigo-400">{req.offeredSkill || 'Teaching'}</span>
                          <span className="text-slate-400">⇄</span>
                          <span className="text-emerald-600 dark:text-emerald-400">{req.requestedSkill}</span>
                          <span className="text-xs font-normal text-slate-500">
                            ({req.durationHours} hr session)
                          </span>
                        </div>
                      ) : (
                        <div className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2 flex-wrap">
                          <span className="text-emerald-700 dark:text-emerald-400">{req.requestedSkill}</span>
                          <span className="text-xs font-normal text-slate-500">
                            ({req.durationHours} hr • ₹{req.totalAmount})
                          </span>
                        </div>
                      )}

                      {req.notes && (
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 italic bg-slate-50 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                          "{req.notes}"
                        </p>
                      )}
                    </div>

                    {/* Participants Bar */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 dark:text-slate-400 pt-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Requester:</span>
                        <img
                          src={req.requesterAvatar}
                          alt={req.requesterName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {req.requesterName}
                        </span>
                        {isRequester && <span className="text-[10px] text-amber-600 font-bold">(You)</span>}
                      </div>

                      <span className="text-slate-300 dark:text-slate-700">•</span>

                      <div className="flex items-center gap-2">
                        <span className="text-slate-400">Mentor:</span>
                        <span className="font-semibold text-slate-800 dark:text-slate-200">
                          {req.providerName}
                        </span>
                        {isProvider && <span className="text-[10px] text-amber-600 font-bold">(You)</span>}
                      </div>
                    </div>

                    {/* Scheduled Date/Time & Google Meet Link */}
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {req.scheduledTime}
                      </span>

                      {req.meetingLink && (
                        <a
                          href={req.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400 hover:underline font-semibold bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded-lg border border-indigo-100 dark:border-indigo-900"
                        >
                          <Video className="w-3.5 h-3.5" />
                          Google Meet
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                  </div>

                  {/* Right Side: Action Buttons */}
                  <div className="flex flex-col sm:flex-row lg:flex-col items-stretch lg:items-end justify-center gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0">
                    
                    {/* If Pending and User is the Provider (Incoming): Accept / Decline */}
                    {req.status === 'pending' && isProvider && (
                      <div className="flex items-center gap-2 w-full">
                        <button
                          type="button"
                          onClick={() => handleStatusChange(req.id, 'accepted')}
                          disabled={loadingAction === req.id}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1 shadow-2xs"
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Accept</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleStatusChange(req.id, 'declined')}
                          disabled={loadingAction === req.id}
                          className="py-2 px-3 rounded-xl border border-rose-300 dark:border-rose-800 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Decline</span>
                        </button>
                      </div>
                    )}

                    {/* If Accepted: Mark Complete */}
                    {req.status === 'accepted' && (
                      <button
                        type="button"
                        onClick={() => handleStatusChange(req.id, 'completed')}
                        disabled={loadingAction === req.id}
                        className="py-2 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark Completed</span>
                      </button>
                    )}

                    {/* If Completed: Write Review */}
                    {req.status === 'completed' && isRequester && (
                      <button
                        type="button"
                        onClick={() => onOpenReviewModalForStudent(req.providerId)}
                        className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-2xs"
                      >
                        <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                        <span>Leave Review</span>
                      </button>
                    )}

                    {/* Contact via Gmail */}
                    <button
                      type="button"
                      onClick={() => handleOpenGmail(req)}
                      className="py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-red-50 dark:hover:bg-red-950/40 hover:text-red-600 dark:hover:text-red-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-red-500" />
                      <span>Follow-up in Gmail</span>
                    </button>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
