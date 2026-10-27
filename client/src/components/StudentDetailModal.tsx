import React, { useState, useEffect } from 'react';
import { 
  X, Star, GraduationCap, MapPin, Repeat, IndianRupee, Mail, CheckCircle, 
  Send, MessageSquarePlus, ExternalLink, Copy, Check, Edit3, Sparkles, Inbox, User 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Student, Review } from '../types';
import { getStudentReviews, submitReview } from '../api';

interface StudentDetailModalProps {
  student: Student | null;
  onClose: () => void;
  currentUser: Student | null;
  onProposeSwap: (student: Student) => void;
  onBookPaid: (student: Student) => void;
  onStudentUpdated: (updatedStudent: Student) => void;
  onOpenEditProfile?: () => void;
  onNavigateTab?: (tab: 'explore' | 'matchmaker' | 'exchanges' | 'gmail' | 'profile') => void;
  onOpenGmailCompose?: (student: Student, relevantSkill?: string, sessionType?: 'swap' | 'paid') => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  student,
  onClose,
  currentUser,
  onProposeSwap,
  onBookPaid,
  onStudentUpdated,
  onOpenEditProfile,
  onNavigateTab,
  onOpenGmailCompose
}) => {
  const [activeTab, setActiveTab] = useState<'skills' | 'reviews' | 'addReview'>('skills');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Review Form State
  const [ratingInput, setRatingInput] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [skillNameInput, setSkillNameInput] = useState('');
  const [sessionTypeInput, setSessionTypeInput] = useState('Skill Barter');
  const [commentInput, setCommentInput] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);

  const skillsOffered = student?.skillsOffered || [];
  const skillsWanted = student?.skillsWanted || [];
  const isSelf = Boolean(currentUser && student && currentUser.id === student.id);

  useEffect(() => {
    if (student) {
      setLoadingReviews(true);
      getStudentReviews(student.id)
        .then((res) => {
          setReviews(res || []);
          if (student.skillsOffered && student.skillsOffered.length > 0) {
            setSkillNameInput(student.skillsOffered[0].name);
          } else {
            setSkillNameInput('General Tutoring');
          }
        })
        .catch(console.error)
        .finally(() => setLoadingReviews(false));
    }
  }, [student]);

  if (!student) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(student.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleGmailClick = () => {
    if (onOpenGmailCompose) {
      onOpenGmailCompose(
        student,
        skillsOffered[0]?.name || 'Skill Inquiry',
        student.hourlyRate > 0 ? 'paid' : 'swap'
      );
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;

    setSubmittingReview(true);
    try {
      const res = await submitReview({
        studentId: student.id,
        reviewerId: currentUser?.id || 'guest',
        reviewerName: currentUser?.name || 'Anonymous Peer',
        reviewerAvatar: currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=peer',
        reviewerUniversity: currentUser?.university || 'University Peer',
        rating: ratingInput,
        skillName: skillNameInput || (skillsOffered[0]?.name ?? 'Peer Tutoring'),
        sessionType: sessionTypeInput,
        comment: commentInput.trim(),
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      setReviews([res.review, ...reviews]);
      onStudentUpdated(res.updatedStudent);
      setReviewSuccess(true);
      setCommentInput('');
      setTimeout(() => {
        setReviewSuccess(false);
        setActiveTab('reviews');
      }, 1500);
    } catch (err: any) {
      alert(err.message || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 dark:bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        
        {/* Header with warm campus gradient */}
        <div className="p-6 bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <img
                  src={student.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(student.name)}`}
                  alt={student.name}
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-white/30 shadow-lg"
                />
                {student.verifiedStudent && (
                  <span className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-1 shadow">
                    <CheckCircle className="w-4 h-4 text-amber-500 fill-amber-100 dark:fill-amber-950" />
                  </span>
                )}
              </div>

              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                    {student.name}
                  </h2>
                  {isSelf && (
                    <span className="text-xs bg-amber-400 text-slate-950 font-extrabold px-2.5 py-0.5 rounded-full shadow-2xs">
                      👑 Your Account
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-1.5 text-xs text-amber-100 font-semibold mt-1">
                  <GraduationCap className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>{student.university}</span>
                  <span>•</span>
                  <span>{student.major}</span>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-amber-200/80 mt-0.5">
                  <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
                  <span>{student.location || 'Campus / Online'}</span>
                </div>
              </div>
            </div>

            {/* Rating badge & Pricing Pill */}
            <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto gap-2">
              <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20">
                <Star className="w-4 h-4 fill-amber-300 text-amber-300" />
                <span className="font-extrabold text-white text-sm">
                  {student.rating ? student.rating.toFixed(1) : '5.0'}
                </span>
                <span className="text-xs text-amber-100">
                  ({student.reviewCount || 0} reviews)
                </span>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-amber-100 block">
                  {student.hourlyRate > 0 ? `₹${student.hourlyRate} / hour` : 'Barter Swap Only (₹0)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 px-6">
          <button
            onClick={() => setActiveTab('skills')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition-colors ${
              activeTab === 'skills'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Skills & Bio
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`py-3 px-4 font-bold text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'reviews'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>Verified Reviews</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-200 dark:bg-slate-700 font-extrabold">
              {reviews.length}
            </span>
          </button>
          {!isSelf && (
            <button
              onClick={() => setActiveTab('addReview')}
              className={`py-3 px-4 font-bold text-xs border-b-2 transition-colors flex items-center gap-1.5 ${
                activeTab === 'addReview'
                  ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                  : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span>Write Review</span>
            </button>
          )}
        </div>

        {/* Body per Tab */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB: Skills & Bio */}
          {activeTab === 'skills' && (
            <div className="space-y-6">
              {/* Bio */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
                  About Me
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/40 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  {student.bio || 'Passionate student eager to exchange skills on campus!'}
                </p>
              </div>

              {/* Skills Offered */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2.5">
                  Skills Offered (Can Teach)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skillsOffered.map((sk) => (
                    <div
                      key={sk.id}
                      className="p-3.5 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-extrabold text-xs text-slate-900 dark:text-white">
                          {sk.name}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                          {sk.level}
                        </span>
                      </div>
                      {sk.description && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-400">
                          {sk.description}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-100 dark:border-slate-700/60">
                        <span className="text-slate-400">Rate:</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">
                          {sk.hourlyPrice ? `₹${sk.hourlyPrice}/hr` : 'Free Barter'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills Wanted */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-2.5">
                  Skills Wanted (Looking to Learn)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {skillsWanted.map((sk) => (
                    <div
                      key={sk.id}
                      className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 space-y-1"
                    >
                      <span className="font-extrabold text-xs text-indigo-950 dark:text-indigo-200 block">
                        🎯 {sk.name}
                      </span>
                      {sk.notes && (
                        <p className="text-[11px] text-indigo-800/80 dark:text-indigo-300/80">
                          {sk.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: Reviews */}
          {activeTab === 'reviews' && (
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs">
                  No verified reviews yet.
                </div>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={rev.reviewerAvatar}
                          alt={rev.reviewerName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <span className="text-xs font-bold text-slate-900 dark:text-white block">
                            {rev.reviewerName}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {rev.reviewerUniversity}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                      "{rev.comment}"
                    </p>

                    <div className="flex items-center gap-2 text-[10px] text-slate-400">
                      <span>Topic: <strong>{rev.skillName}</strong></span>
                      <span>•</span>
                      <span>{new Date(rev.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB: Add Review */}
          {activeTab === 'addReview' && !isSelf && (
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {reviewSuccess && (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  Review submitted and average rating updated!
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Star Rating
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRatingInput(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="p-1 text-amber-400 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= (hoverRating || ratingInput)
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-slate-300 dark:text-slate-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-400 ml-2">
                    {ratingInput} out of 5 stars
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Session Type
                </label>
                <select
                  value={sessionTypeInput}
                  onChange={(e) => setSessionTypeInput(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 font-semibold"
                >
                  <option value="Skill Barter (1-on-1)">1-on-1 Skill Barter (₹0)</option>
                  <option value="Paid Mentoring Session">Paid Mentoring Session</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Review
                </label>
                <textarea
                  rows={4}
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder={`Share what you learned from ${student.name}, how clear their teaching was, and if you recommend them to other students...`}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-amber-500"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{submittingReview ? 'Submitting...' : 'Post Verified Review'}</span>
              </button>
            </form>
          )}

        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3">
          {isSelf ? (
            <div className="flex items-center justify-between w-full">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                This is your student profile
              </span>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  if (onOpenEditProfile) onOpenEditProfile();
                }}
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 shadow-2xs"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile & Skills
              </button>
            </div>
          ) : (
            <>
              {/* Contact via Gmail */}
              <button
                type="button"
                onClick={handleGmailClick}
                className="px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300 text-xs font-extrabold border border-red-200 dark:border-red-900/60 flex items-center gap-1.5 transition-colors"
              >
                <Mail className="w-4 h-4 text-red-600 dark:text-red-400" />
                <span>Contact via Gmail</span>
              </button>

              <div className="flex items-center gap-2">
                {student.openToSwap && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onProposeSwap(student);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-extrabold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Repeat className="w-3.5 h-3.5" />
                    <span>Propose Swap</span>
                  </button>
                )}

                {student.hourlyRate > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onBookPaid(student);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold flex items-center gap-1.5 shadow-2xs"
                  >
                    <IndianRupee className="w-3.5 h-3.5" />
                    <span>Book (₹{student.hourlyRate}/hr)</span>
                  </button>
                )}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
