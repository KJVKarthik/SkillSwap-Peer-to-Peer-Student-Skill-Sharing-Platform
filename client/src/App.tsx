import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { StudentCard } from './components/StudentCard';
import { StudentDetailModal } from './components/StudentDetailModal';
import { SwapRequestModal } from './components/SwapRequestModal';
import { PaidBookingModal } from './components/PaidBookingModal';
import { SmartSkillMakerView } from './components/SmartSkillMakerView';
import { ExchangesView } from './components/ExchangesView';
import { MailLogView } from './components/MailLogView';
import { GmailComposeModal } from './components/GmailComposeModal';
import { EditProfileModal } from './components/EditProfileModal';
import { RegisterStudentModal } from './components/RegisterStudentModal';
import { AuthModal } from './components/AuthModal';
import { MyProfileView } from './components/MyProfileView';
import { Student, SwapRequest, MailLogEntry, StorageStatus } from './types';
import { getStudents, getRequests, getMailLogs, resetDatabase, getStorageStatus } from './api';
import { Sparkles, Repeat, IndianRupee, Mail, Heart, CheckCircle2, User, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function App() {
  const [students, setStudents] = useState<Student[]>([]);
  const [currentUser, setCurrentUser] = useState<Student | null>(null);
  const [requests, setRequests] = useState<SwapRequest[]>([]);
  const [mailLogs, setMailLogs] = useState<MailLogEntry[]>([]);
  const [storageStatus, setStorageStatus] = useState<StorageStatus>({ mode: 'local_demo', details: 'Local Persistent Demo Mode' });
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 280);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigation state - defaults to 'explore'
  const [currentTab, setCurrentTab] = useState<'explore' | 'matchmaker' | 'exchanges' | 'gmail' | 'profile'>('explore');

  // Filter state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [exchangeMode, setExchangeMode] = useState('all');
  const [onlyTopRated, setOnlyTopRated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [swapTarget, setSwapTarget] = useState<Student | null>(null);
  const [paidTarget, setPaidTarget] = useState<Student | null>(null);
  const [gmailComposeTarget, setGmailComposeTarget] = useState<{
    mentor: Student;
    relevantSkill?: string;
    sessionType?: 'swap' | 'paid';
  } | null>(null);

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const loadData = async () => {
    try {
      const [allStudents, storage] = await Promise.all([
        getStudents({
          search,
          category: selectedCategory !== 'All' ? selectedCategory : undefined,
          mode: exchangeMode,
          minRating: onlyTopRated ? 4.8 : undefined,
        }),
        getStorageStatus()
      ]);

      setStudents(allStudents);
      setStorageStatus(storage);

      // Default to student if not yet set
      if (!currentUser && allStudents.length > 0) {
        // Prefer KJV Karthik if available, else first
        const defaultStudent = allStudents.find(s => s.email === 'kk7504@srmist.edu.in') || allStudents[0];
        setCurrentUser(defaultStudent);
      }

      if (currentUser) {
        const [userReqs, logs] = await Promise.all([
          getRequests(currentUser.id),
          getMailLogs(currentUser.id)
        ]);
        setRequests(userReqs);
        setMailLogs(logs);
      } else {
        const [allReqs, logs] = await Promise.all([
          getRequests(),
          getMailLogs()
        ]);
        setRequests(allReqs);
        setMailLogs(logs);
      }
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [search, selectedCategory, exchangeMode, onlyTopRated]);

  // When currentUser changes, reload requests and mail logs
  useEffect(() => {
    if (currentUser) {
      getRequests(currentUser.id).then(setRequests).catch(console.error);
      getMailLogs(currentUser.id).then(setMailLogs).catch(console.error);
    }
  }, [currentUser?.id]);

  const handleResetData = async () => {
    if (confirm('Reset database back to initial sample students, requests, reviews, and mail logs?')) {
      await resetDatabase();
      await loadData();
      showToast('Database reset to fresh demo state!');
    }
  };

  const handleStudentUpdated = (updated: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    if (currentUser && currentUser.id === updated.id) {
      setCurrentUser(updated);
    }
    if (detailStudent && detailStudent.id === updated.id) {
      setDetailStudent(updated);
    }
    showToast(`Profile updated for ${updated.name}!`);
  };

  const handleLoginOrRegisterSuccess = (student: Student) => {
    setStudents((prev) => {
      const exists = prev.some((s) => s.id === student.id || s.email.toLowerCase() === student.email.toLowerCase());
      return exists ? prev.map((s) => (s.id === student.id ? student : s)) : [student, ...prev];
    });
    setCurrentUser(student);
    
    setIsRegisterOpen(false);
    setIsAuthModalOpen(false);
    
    setCurrentTab('explore');
    setSearch('');
    setSelectedCategory('All');
    setExchangeMode('all');
    
    showToast(`🎉 Welcome ${student.name}! You are now active.`);
  };

  const handleOpenGmailCompose = (student: Student, relevantSkill?: string, sessionType?: 'swap' | 'paid') => {
    setGmailComposeTarget({
      mentor: student,
      relevantSkill,
      sessionType
    });
  };

  const refreshMailLogs = async () => {
    try {
      const logs = await getMailLogs(currentUser?.id);
      setMailLogs(logs);
    } catch (err) {
      console.error('Error refreshing mail logs:', err);
    }
  };

  const pendingRequestsCount = requests.filter(
    (r) => currentUser && r.providerId === currentUser.id && r.status === 'pending'
  ).length;

  return (
    <div className="min-h-screen bg-[#faf9f6] dark:bg-[#090d16] text-slate-900 dark:text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-white transition-colors duration-200">
      
      {/* Toast alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 dark:bg-white text-white dark:text-slate-950 px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-2.5 border border-slate-700 dark:border-slate-200 animate-in fade-in slide-in-from-bottom-3 text-xs font-bold">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Navigation */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        students={students}
        onSelectCurrentUser={(s) => {
          setCurrentUser(s);
          showToast(`Switched active profile to ${s.name}`);
        }}
        onOpenEditProfile={() => setIsEditProfileOpen(true)}
        onOpenRegister={() => setIsRegisterOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        pendingRequestsCount={pendingRequestsCount}
        mailLogsCount={mailLogs.length}
        storageMode={storageStatus.mode}
      />

      {/* Main Body per Tab */}
      <main className="flex-1">
        {currentTab === 'explore' && (
          <div>
            <HeroSection
              search={search}
              setSearch={setSearch}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              exchangeMode={exchangeMode}
              setExchangeMode={setExchangeMode}
              onlyTopRated={onlyTopRated}
              setOnlyTopRated={setOnlyTopRated}
              totalStudents={students.length}
              onOpenMatchmaker={() => setCurrentTab('matchmaker')}
              onResetData={handleResetData}
            />

            {/* Students Grid - The Student Skill Marketplace */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              
              {/* Logged In Confirmation Banner */}
              {currentUser && (
                <div className="mb-8 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-900 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border border-amber-400/30">
                  <div className="flex items-center gap-3.5">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-12 h-12 rounded-2xl object-cover ring-2 ring-white/30 shadow-md"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-extrabold tracking-wider bg-white/20 px-2 py-0.5 rounded-full text-amber-100">
                          Active Student Account
                        </span>
                        <span className="text-xs text-amber-200">
                          {currentUser.email}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-white mt-0.5">
                        Logged in as {currentUser.name} ({currentUser.university})
                      </h3>
                      <p className="text-xs text-amber-100">
                        Explore peer listings below, propose free 1-on-1 swaps, or book hourly tutoring in Indian rupees (₹)!
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => setCurrentTab('matchmaker')}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs px-4 py-2.5 rounded-xl shadow transition-all active:scale-95"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
                      AI Smart Skill Maker
                    </button>
                    <button
                      type="button"
                      onClick={() => setCurrentTab('profile')}
                      className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1 bg-white/10 hover:bg-white/20 text-white font-bold text-xs px-3.5 py-2.5 rounded-xl border border-white/20 transition-all"
                    >
                      <User className="w-3.5 h-3.5" />
                      My Profile
                    </button>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                    <span>Campus Mentors & Skill Swappers</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                      {students.length} students online
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Select a student to propose a 1-on-1 barter, book an hourly session in ₹, or contact via Gmail.
                  </p>
                </div>
              </div>

              {loading ? (
                <div className="text-center py-20 text-slate-400 text-sm">
                  Loading campus skill network...
                </div>
              ) : students.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-8 shadow-sm">
                  <p className="text-base font-bold text-slate-700 dark:text-slate-300">No students matched your search</p>
                  <p className="text-xs text-slate-400 mt-1">Try resetting the filters or search keywords.</p>
                  <button
                    type="button"
                    onClick={() => {
                      setSearch('');
                      setSelectedCategory('All');
                      setExchangeMode('all');
                      setOnlyTopRated(false);
                    }}
                    className="mt-3 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
                  >
                    Clear All Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {students.map((student) => (
                    <StudentCard
                      key={student.id}
                      student={student}
                      isSelf={currentUser?.id === student.id}
                      onSelectStudent={(s) => setDetailStudent(s)}
                      onProposeSwap={(s) => setSwapTarget(s)}
                      onBookPaid={(s) => setPaidTarget(s)}
                      onGoToProfile={() => setCurrentTab('profile')}
                      onOpenGmail={(s) => handleOpenGmailCompose(s)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {currentTab === 'profile' && (
          <MyProfileView
            currentUser={currentUser}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
            onNavigateTab={(tab) => setCurrentTab(tab as any)}
            onProfileUpdated={handleStudentUpdated}
            requests={requests}
          />
        )}

        {/* AI Smart Skill Maker */}
        {currentTab === 'matchmaker' && (
          <SmartSkillMakerView
            currentUser={currentUser}
            onSelectStudent={(s) => setDetailStudent(s)}
            onProposeSwap={(s) => setSwapTarget(s)}
            onBookPaid={(s) => setPaidTarget(s)}
            onOpenGmailCompose={handleOpenGmailCompose}
            onProfileUpdated={handleStudentUpdated}
          />
        )}

        {/* My swaps */}
        {currentTab === 'exchanges' && (
          <ExchangesView
            requests={requests}
            currentUser={currentUser}
            onRefresh={() => {
              if (currentUser) {
                getRequests(currentUser.id).then(setRequests);
              } else {
                getRequests().then(setRequests);
              }
            }}
            onSelectStudentById={(studentId) => {
              const found = students.find((s) => s.id === studentId);
              if (found) setDetailStudent(found);
            }}
            onOpenReviewModalForStudent={(studentId) => {
              const found = students.find((s) => s.id === studentId);
              if (found) setDetailStudent(found);
            }}
            onOpenGmailCompose={handleOpenGmailCompose}
          />
        )}

        {/* Mail log */}
        {currentTab === 'gmail' && (
          <MailLogView
            mailLogs={mailLogs}
            currentUser={currentUser}
            onRefresh={refreshMailLogs}
            onSelectStudentByEmail={(email) => {
              const found = students.find((s) => s.email.toLowerCase() === email.toLowerCase());
              if (found) setDetailStudent(found);
            }}
          />
        )}
      </main>

      {/* Gmail Compose Modal (Primary Contact via Gmail Flow) */}
      {gmailComposeTarget && (
        <GmailComposeModal
          isOpen={Boolean(gmailComposeTarget)}
          onClose={() => setGmailComposeTarget(null)}
          mentor={gmailComposeTarget.mentor}
          currentUser={currentUser}
          defaultSkill={gmailComposeTarget.relevantSkill}
          defaultType={gmailComposeTarget.sessionType || 'swap'}
          onDraftOpened={() => {
            showToast(`Draft opened in Gmail for ${gmailComposeTarget.mentor.name}!`);
            refreshMailLogs();
          }}
        />
      )}

      {/* Modals */}
      {isAuthModalOpen && (
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          students={students}
          onLoginSuccess={handleLoginOrRegisterSuccess}
        />
      )}

      {detailStudent && (
        <StudentDetailModal
          student={detailStudent}
          currentUser={currentUser}
          onClose={() => setDetailStudent(null)}
          onProposeSwap={(s) => setSwapTarget(s)}
          onBookPaid={(s) => setPaidTarget(s)}
          onStudentUpdated={handleStudentUpdated}
          onOpenEditProfile={() => setIsEditProfileOpen(true)}
          onNavigateTab={(tab) => setCurrentTab(tab)}
          onOpenGmailCompose={handleOpenGmailCompose}
        />
      )}

      {swapTarget && (
        <SwapRequestModal
          targetStudent={swapTarget}
          currentUser={currentUser}
          onClose={() => setSwapTarget(null)}
          onRequestCreated={() => {
            showToast('Swap proposal submitted & logged in My swaps!');
            if (currentUser) {
              getRequests(currentUser.id).then(setRequests);
            }
          }}
        />
      )}

      {paidTarget && (
        <PaidBookingModal
          targetStudent={paidTarget}
          currentUser={currentUser}
          onClose={() => setPaidTarget(null)}
          onRequestCreated={() => {
            showToast('Paid session booked & logged in My swaps!');
            if (currentUser) {
              getRequests(currentUser.id).then(setRequests);
            }
          }}
        />
      )}

      {isEditProfileOpen && (
        <EditProfileModal
          currentUser={currentUser}
          onClose={() => setIsEditProfileOpen(false)}
          onProfileUpdated={handleStudentUpdated}
        />
      )}

      {isRegisterOpen && (
        <RegisterStudentModal
          isOpen={isRegisterOpen}
          onClose={() => setIsRegisterOpen(false)}
          onStudentCreated={handleLoginOrRegisterSuccess}
        />
      )}

      {/* Floating Smooth Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.7, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.7, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-6 left-6 z-40 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 hover:text-amber-600 dark:hover:text-amber-400 shadow-xl hover:shadow-2xl transition-all flex items-center gap-1.5 text-xs font-extrabold group hover:scale-105 active:scale-95"
            title="Smooth Scroll to Top"
          >
            <ChevronUp className="w-4 h-4 text-amber-600 dark:text-amber-400 group-hover:-translate-y-0.5 transition-transform" />
            <span className="hidden sm:inline">Back to Top</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-8 mt-12 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-slate-900 dark:text-white text-sm">SkillSwap</span>
            <span>—</span>
            <span>Student Peer-to-Peer Skill Exchange & Mentorship</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium">
            <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
              <IndianRupee className="w-3.5 h-3.5" /> Hourly Pricing (₹)
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-bold">
              <Repeat className="w-3.5 h-3.5" /> 1-on-1 Free Barter
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
              <Mail className="w-3.5 h-3.5" /> Gmail Connected
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}

export default App;
