import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { readDB, writeDB, resetDB, getStorageStatus } from './db.js';
import { initMySQL, isMySQLActive } from './mysql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize MySQL if available
initMySQL().catch(() => {});

// Helper: build Gmail direct web compose URL (strictly opens in browser, never invokes Apple Mail or system mailto)
function generateGmailComposeUrl(toEmail, subject, body) {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: toEmail || '',
    su: subject || '',
    body: body || ''
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

// -------------------------------------------------------------
// GET /api/health - Health & Storage mode status
// -------------------------------------------------------------
app.get('/api/health', (req, res) => {
  const storage = getStorageStatus();
  res.json({
    status: 'ok',
    service: 'SkillSwap API',
    currency: 'INR (₹)',
    storageMode: storage.mode,
    storageDetails: storage.details,
    timestamp: new Date().toISOString()
  });
});

// -------------------------------------------------------------
// GET /api/students - List students with search and filters
// -------------------------------------------------------------
app.get('/api/students', (req, res) => {
  try {
    const db = readDB();
    const { search, category, mode, maxPrice, minRating } = req.query;
    let students = [...db.students];

    if (search) {
      const q = search.toLowerCase().trim();
      students = students.filter(s => {
        const matchName = s.name.toLowerCase().includes(q);
        const matchUni = s.university.toLowerCase().includes(q);
        const matchMajor = s.major.toLowerCase().includes(q);
        const matchBio = s.bio.toLowerCase().includes(q);
        const matchOffer = s.skillsOffered?.some(sk =>
          sk.name.toLowerCase().includes(q) || (sk.description && sk.description.toLowerCase().includes(q))
        );
        const matchWant = s.skillsWanted?.some(sk =>
          sk.name.toLowerCase().includes(q) || (sk.notes && sk.notes.toLowerCase().includes(q))
        );
        return matchName || matchUni || matchMajor || matchBio || matchOffer || matchWant;
      });
    }

    if (category && category !== 'All') {
      students = students.filter(s =>
        s.skillsOffered?.some(sk => sk.category?.toLowerCase() === category.toLowerCase())
      );
    }

    if (mode === 'swap') {
      students = students.filter(s => s.openToSwap);
    } else if (mode === 'paid') {
      students = students.filter(s => s.hourlyRate > 0);
    } else if (mode === 'free_swap_only') {
      students = students.filter(s => s.hourlyRate === 0 && s.openToSwap);
    }

    if (maxPrice) {
      const max = parseFloat(maxPrice);
      if (!isNaN(max)) {
        students = students.filter(s => s.hourlyRate <= max);
      }
    }

    if (minRating) {
      const min = parseFloat(minRating);
      if (!isNaN(min)) {
        students = students.filter(s => s.rating >= min);
      }
    }

    res.json({
      success: true,
      count: students.length,
      storageMode: isMySQLActive() ? 'mysql' : 'local_demo',
      students
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// GET /api/students/:id - Student details & reviews
// -------------------------------------------------------------
app.get('/api/students/:id', (req, res) => {
  try {
    const db = readDB();
    const student = db.students.find(s => s.id === req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const reviews = (db.reviews || []).filter(r => r.studentId === student.id);
    const topSkill = student.skillsOffered?.[0]?.name || 'Peer Tutoring';
    const gmailUrl = generateGmailComposeUrl(
      student.email,
      `SkillSwap: ${topSkill} Inquiry`,
      `Hi ${student.name},\n\nI discovered your profile on SkillSwap and would love to connect about learning ${topSkill}!\n\nBest regards,\n`
    );

    res.json({
      success: true,
      student,
      reviews,
      gmailUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// POST /api/students - Register student profile with multiple skills
// -------------------------------------------------------------
app.post('/api/students', (req, res) => {
  try {
    const db = readDB();
    const {
      name,
      email,
      university,
      major,
      avatar,
      bio,
      hourlyRate,
      openToSwap,
      location,
      skillsOffered = [],
      skillsWanted = []
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: 'Name and email are required' });
    }

    // Process multiple offered skills
    let processedOffered = [];
    if (Array.isArray(skillsOffered)) {
      processedOffered = skillsOffered.map((sk, idx) => ({
        id: sk.id || `so-${Date.now()}-${idx}`,
        name: typeof sk === 'string' ? sk.trim() : sk.name.trim(),
        category: (typeof sk === 'object' && sk.category) || 'General',
        level: (typeof sk === 'object' && sk.level) || 'Intermediate',
        description: (typeof sk === 'object' && sk.description) || `Peer mentoring in ${typeof sk === 'string' ? sk : sk.name}`,
        isSwapAvailable: typeof sk === 'object' && sk.isSwapAvailable !== undefined ? Boolean(sk.isSwapAvailable) : true,
        hourlyPrice: Number((typeof sk === 'object' && sk.hourlyPrice) ?? (hourlyRate || 0))
      })).filter(sk => sk.name.length > 0);
    }

    // Process multiple wanted skills
    let processedWanted = [];
    if (Array.isArray(skillsWanted)) {
      processedWanted = skillsWanted.map((sk, idx) => ({
        id: sk.id || `sw-${Date.now()}-${idx}`,
        name: typeof sk === 'string' ? sk.trim() : sk.name.trim(),
        category: (typeof sk === 'object' && sk.category) || 'General',
        level: (typeof sk === 'object' && sk.level) || 'Beginner',
        notes: (typeof sk === 'object' && sk.notes) || 'Looking to learn from a student mentor'
      })).filter(sk => sk.name.length > 0);
    }

    const newStudent = {
      id: `student-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      university: university?.trim() || 'University',
      major: major?.trim() || 'General Studies',
      avatar: avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
      bio: bio?.trim() || 'Passionate about peer learning and skill sharing!',
      hourlyRate: Number(hourlyRate) || 0,
      openToSwap: openToSwap !== false,
      rating: 5.0,
      reviewCount: 0,
      verifiedStudent: true,
      location: location?.trim() || `${university || 'Campus'} / Online`,
      skillsOffered: processedOffered,
      skillsWanted: processedWanted
    };

    db.students.unshift(newStudent);
    writeDB(db);

    res.status(201).json({ success: true, student: newStudent });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// PUT /api/students/:id - Update student profile & skills
// -------------------------------------------------------------
app.put('/api/students/:id', (req, res) => {
  try {
    const db = readDB();
    const index = db.students.findIndex(s => s.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const existing = db.students[index];
    const updated = {
      ...existing,
      ...req.body,
      id: existing.id // preserve immutable ID
    };

    db.students[index] = updated;
    writeDB(db);

    res.json({ success: true, student: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// HELPER: Deterministic skill matching function
// Matches skills by name tokens, substrings, and categories
// -------------------------------------------------------------
function normalizeSkill(str) {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function skillsAreCompatible(skillA, skillB, categoryA = '', categoryB = '') {
  const normA = normalizeSkill(skillA);
  const normB = normalizeSkill(skillB);
  if (!normA || !normB) return false;

  // Exact match
  if (normA === normB) return { match: true, score: 100, reason: 'Exact skill match' };

  // Substring containment
  if (normA.includes(normB) || normB.includes(normA)) {
    return { match: true, score: 85, reason: 'Keyword overlap' };
  }

  // Token / word overlap
  const tokensA = normA.split(' ').filter(w => w.length > 2);
  const tokensB = normB.split(' ').filter(w => w.length > 2);
  const commonToken = tokensA.find(t => tokensB.includes(t));
  if (commonToken) {
    return { match: true, score: 75, reason: `Shared term (${commonToken})` };
  }

  // Common synonym / equivalent mappings
  const equivalents = [
    ['react', 'next', 'javascript', 'frontend', 'web development'],
    ['python', 'machine learning', 'data science', 'ai'],
    ['ui', 'ux', 'figma', 'design', 'prototyping'],
    ['video', 'premiere', 'davinci', 'editing', 'filmmaking'],
    ['guitar', 'music', 'instrument', 'chords'],
    ['calculus', 'math', 'algebra', 'statistics', 'quantitative'],
    ['speaking', 'communication', 'presentation', 'speech']
  ];

  for (const group of equivalents) {
    const hasA = group.some(term => normA.includes(term));
    const hasB = group.some(term => normB.includes(term));
    if (hasA && hasB) {
      return { match: true, score: 70, reason: 'Related subject domain' };
    }
  }

  // Category matching as fallback if both are designated
  if (categoryA && categoryB && categoryA.toLowerCase() === categoryB.toLowerCase() && categoryA.toLowerCase() !== 'general') {
    return { match: true, score: 55, reason: `Category match (${categoryA})` };
  }

  return { match: false, score: 0 };
}

// -------------------------------------------------------------
// POST /api/smart-skill-maker - AI Smart Skill Maker matching
// Returns TWO sets:
// 1. Students who want to learn skills I can teach
// 2. Students who can teach skills I want to learn
// + 100% Reciprocal matches
// -------------------------------------------------------------
app.post('/api/smart-skill-maker', (req, res) => {
  try {
    const db = readDB();
    const { userId, teachSkills = [], learnSkills = [] } = req.body;

    let myTeachSkills = Array.isArray(teachSkills) ? teachSkills.filter(Boolean) : [];
    let myLearnSkills = Array.isArray(learnSkills) ? learnSkills.filter(Boolean) : [];

    // If userId provided and arrays empty, fill from stored student profile
    const currentUser = userId ? db.students.find(s => s.id === userId) : null;
    if (currentUser) {
      if (myTeachSkills.length === 0 && currentUser.skillsOffered) {
        myTeachSkills = currentUser.skillsOffered.map(s => s.name);
      }
      if (myLearnSkills.length === 0 && currentUser.skillsWanted) {
        myLearnSkills = currentUser.skillsWanted.map(s => s.name);
      }
    }

    const wantWhatITeach = []; // Set 1: Students who want to learn skills I can teach
    const teachWhatIWant = []; // Set 2: Students who can teach skills I want to learn
    const reciprocalMatches = []; // Students matching both directions

    db.students.forEach(other => {
      // Exclude self
      if (currentUser && other.id === currentUser.id) return;

      let matchedAsLearner = null; // Other wants to learn what I teach
      let matchedAsTeacher = null; // Other can teach what I want to learn

      // 1. Check if other student wants any skill I can teach
      if (other.skillsWanted && other.skillsWanted.length > 0) {
        for (const myTeach of myTeachSkills) {
          for (const otherWant of other.skillsWanted) {
            const check = skillsAreCompatible(myTeach, otherWant.name, '', otherWant.category);
            if (check.match) {
              matchedAsLearner = {
                student: other,
                matchedSkillName: otherWant.name,
                myRelevantSkill: myTeach,
                category: otherWant.category || 'General',
                matchScore: check.score,
                sessionType: other.openToSwap ? 'Free Skill Swap' : 'Paid Mentoring Session',
                hourlyRate: other.hourlyRate || 0
              };
              break;
            }
          }
          if (matchedAsLearner) break;
        }
      }

      // 2. Check if other student teaches any skill I want to learn
      if (other.skillsOffered && other.skillsOffered.length > 0) {
        for (const myLearn of myLearnSkills) {
          for (const otherOffer of other.skillsOffered) {
            const check = skillsAreCompatible(myLearn, otherOffer.name, '', otherOffer.category);
            if (check.match) {
              matchedAsTeacher = {
                student: other,
                matchedSkillName: otherOffer.name,
                myRelevantSkill: myLearn,
                category: otherOffer.category || 'General',
                matchScore: check.score,
                sessionType: otherOffer.isSwapAvailable ? 'Free Skill Swap' : 'Paid Mentoring Session',
                hourlyRate: otherOffer.hourlyPrice || other.hourlyRate || 0
              };
              break;
            }
          }
          if (matchedAsTeacher) break;
        }
      }

      if (matchedAsLearner) {
        wantWhatITeach.push(matchedAsLearner);
      }

      if (matchedAsTeacher) {
        teachWhatIWant.push(matchedAsTeacher);
      }

      if (matchedAsLearner && matchedAsTeacher) {
        reciprocalMatches.push({
          student: other,
          matchedSkillName: `${matchedAsTeacher.matchedSkillName} ⇄ ${matchedAsLearner.matchedSkillName}`,
          matchScore: Math.round((matchedAsLearner.matchScore + matchedAsTeacher.matchScore) / 2) + 15,
          sessionType: '1-on-1 Free Reciprocal Swap',
          hourlyRate: 0,
          isReciprocal: true,
          theyCanTeachYou: matchedAsTeacher.matchedSkillName,
          youCanTeachThem: matchedAsLearner.matchedSkillName
        });
      }
    });

    // Sort by matchScore and student rating
    wantWhatITeach.sort((a, b) => b.matchScore - a.matchScore || b.student.rating - a.student.rating);
    teachWhatIWant.sort((a, b) => b.matchScore - a.matchScore || b.student.rating - a.student.rating);
    reciprocalMatches.sort((a, b) => b.matchScore - a.matchScore || b.student.rating - a.student.rating);

    res.json({
      success: true,
      activeTeachSkills: myTeachSkills,
      activeLearnSkills: myLearnSkills,
      wantWhatITeach,
      teachWhatIWant,
      reciprocalMatches,
      totalMatches: wantWhatITeach.length + teachWhatIWant.length
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Also support legacy GET /api/match
app.get('/api/match', (req, res) => {
  try {
    const db = readDB();
    const { userId, teachSkill, learnSkill } = req.query;

    const teachSkills = teachSkill ? [teachSkill] : [];
    const learnSkills = learnSkill ? [learnSkill] : [];

    const currentUser = userId ? db.students.find(s => s.id === userId) : null;
    if (currentUser) {
      if (teachSkills.length === 0 && currentUser.skillsOffered) {
        currentUser.skillsOffered.forEach(s => teachSkills.push(s.name));
      }
      if (learnSkills.length === 0 && currentUser.skillsWanted) {
        currentUser.skillsWanted.forEach(s => learnSkills.push(s.name));
      }
    }

    const matches = [];

    db.students.forEach(other => {
      if (currentUser && other.id === currentUser.id) return;
      if (!other.openToSwap) return;

      const matchingSkillsOtherCanTeach = (other.skillsOffered || []).filter(so => {
        if (!so.isSwapAvailable) return false;
        return learnSkills.some(want => skillsAreCompatible(want, so.name).match);
      });

      const matchingSkillsOtherWants = (other.skillsWanted || []).filter(sw => {
        return teachSkills.some(teach => skillsAreCompatible(teach, sw.name).match);
      });

      const isReciprocal = matchingSkillsOtherCanTeach.length > 0 && matchingSkillsOtherWants.length > 0;
      const isOneWay = matchingSkillsOtherCanTeach.length > 0 || matchingSkillsOtherWants.length > 0;

      if (isOneWay || isReciprocal) {
        matches.push({
          student: other,
          isReciprocal,
          matchScore: isReciprocal ? 100 : 70,
          theyCanTeachYou: matchingSkillsOtherCanTeach,
          youCanTeachThem: matchingSkillsOtherWants,
          gmailComposeUrl: generateGmailComposeUrl(
            other.email,
            `SkillSwap: 1-on-1 Barter Request with ${other.name}`,
            `Hi ${other.name},\n\nI saw your profile on SkillSwap and would love to propose a 1-on-1 skill swap!\n\nBest,\n`
          )
        });
      }
    });

    matches.sort((a, b) => b.matchScore - a.matchScore || b.student.rating - a.student.rating);

    res.json({ success: true, count: matches.length, matches });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// GET /api/requests - Sent and received swap and paid requests
// -------------------------------------------------------------
app.get('/api/requests', (req, res) => {
  try {
    const db = readDB();
    const { userId } = req.query;

    let requests = [...(db.requests || [])];
    if (userId) {
      requests = requests.filter(r => r.requesterId === userId || r.providerId === userId);
    }

    requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, count: requests.length, requests });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// POST /api/requests - Create swap proposal or paid session (in ₹)
// -------------------------------------------------------------
app.post('/api/requests', (req, res) => {
  try {
    const db = readDB();
    const {
      requesterId,
      providerId,
      type, // 'swap' or 'paid'
      offeredSkill,
      requestedSkill,
      durationHours = 1,
      scheduledTime,
      notes = "",
      meetingPlatform = "Google Meet"
    } = req.body;

    const requester = db.students.find(s => s.id === requesterId);
    const provider = db.students.find(s => s.id === providerId);

    if (!provider) {
      return res.status(404).json({ success: false, message: 'Mentor student not found' });
    }

    const duration = Number(durationHours) || 1;
    let totalAmount = 0;
    if (type === 'paid') {
      const hourly = provider.hourlyRate || 0;
      totalAmount = Math.round(hourly * duration);
    }

    const newRequest = {
      id: `req-${Date.now()}`,
      requesterId: requester ? requester.id : 'guest',
      requesterName: requester ? requester.name : (req.body.guestName || 'Anonymous Student'),
      requesterEmail: requester ? requester.email : (req.body.guestEmail || 'student@gmail.com'),
      requesterAvatar: requester ? requester.avatar : 'https://api.dicebear.com/7.x/avataaars/svg?seed=student',
      providerId: provider.id,
      providerName: provider.name,
      providerEmail: provider.email,
      type: type || 'swap',
      offeredSkill: type === 'swap' ? offeredSkill : null,
      requestedSkill,
      durationHours: duration,
      totalAmount,
      scheduledTime: scheduledTime || 'Flexible / To be coordinated',
      status: 'pending',
      meetingPlatform,
      meetingLink: `https://meet.google.com/skillswap-${Date.now().toString().slice(-6)}`,
      notes,
      createdAt: new Date().toISOString()
    };

    db.requests.unshift(newRequest);

    // Notification summary
    const emailSubject = type === 'swap'
      ? `SkillSwap: 1-on-1 Barter Request from ${newRequest.requesterName}`
      : `SkillSwap: Paid Session Booking from ${newRequest.requesterName} (₹${totalAmount})`;

    const emailBody = type === 'swap'
      ? `Hi ${provider.name},\n\n${newRequest.requesterName} has proposed a 1-on-1 skill swap!\n\nThey want to learn: ${requestedSkill}\nThey are offering to teach: ${offeredSkill}\nDuration: ${duration} hr(s)\nProposed Time: ${scheduledTime || 'Flexible'}\n\nNotes from ${newRequest.requesterName}:\n"${notes}"\n\nYou can reply directly via Gmail or manage this in your SkillSwap dashboard.`
      : `Hi ${provider.name},\n\n${newRequest.requesterName} has booked a ${duration}-hour paid tutoring session with you for ₹${totalAmount} (₹${provider.hourlyRate}/hr)!\n\nSkill: ${requestedSkill}\nProposed Time: ${scheduledTime || 'Flexible'}\n\nNotes from student:\n"${notes}"\n\nYou can contact them directly or via Gmail.`;

    const newNotification = {
      id: `notif-${Date.now()}`,
      recipientEmail: provider.email,
      recipientName: provider.name,
      senderName: newRequest.requesterName,
      senderEmail: newRequest.requesterEmail,
      subject: emailSubject,
      body: emailBody,
      timestamp: new Date().toISOString(),
      read: false
    };

    if (!db.notifications) db.notifications = [];
    db.notifications.unshift(newNotification);

    writeDB(db);

    const gmailComposeUrl = generateGmailComposeUrl(provider.email, emailSubject, emailBody);

    res.status(201).json({
      success: true,
      request: newRequest,
      notification: newNotification,
      gmailComposeUrl
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// PATCH /api/requests/:id - Accept, decline, complete session
// -------------------------------------------------------------
app.patch('/api/requests/:id', (req, res) => {
  try {
    const db = readDB();
    const { status } = req.body;
    const index = db.requests.findIndex(r => r.id === req.params.id);

    if (index === -1) {
      return res.status(404).json({ success: false, message: 'Request not found' });
    }

    db.requests[index].status = status;
    const reqItem = db.requests[index];

    // Notification for requester
    const notifSubject = `SkillSwap: Your session request has been ${status.toUpperCase()}!`;
    const notifBody = `Hi ${reqItem.requesterName},\n\nGreat news! Your session with ${reqItem.providerName} for "${reqItem.requestedSkill}" has been marked as ${status}.\n\nScheduled: ${reqItem.scheduledTime}\nMeeting Link: ${reqItem.meetingLink}`;

    if (!db.notifications) db.notifications = [];
    db.notifications.unshift({
      id: `notif-${Date.now()}`,
      recipientEmail: reqItem.requesterEmail,
      recipientName: reqItem.requesterName,
      senderName: reqItem.providerName,
      senderEmail: reqItem.providerEmail,
      subject: notifSubject,
      body: notifBody,
      timestamp: new Date().toISOString(),
      read: false
    });

    writeDB(db);

    res.json({ success: true, request: db.requests[index] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// GET /api/mail-logs - Mail log entries
// -------------------------------------------------------------
app.get('/api/mail-logs', (req, res) => {
  try {
    const db = readDB();
    const { userId } = req.query;
    let logs = [...(db.mailLogs || [])];

    if (userId) {
      logs = logs.filter(l => l.senderId === userId || l.mentorId === userId);
    }

    logs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json({ success: true, count: logs.length, mailLogs: logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// POST /api/mail-logs - Record initiated Gmail draft
// -------------------------------------------------------------
app.post('/api/mail-logs', (req, res) => {
  try {
    const db = readDB();
    const {
      senderId,
      senderName,
      senderEmail,
      mentorId,
      mentorName,
      mentorEmail,
      mentorUniversity,
      skillName,
      sessionType = 'Free Skill Swap',
      hourlyRate = 0,
      subject,
      body,
      draftOpened = true
    } = req.body;

    if (!mentorEmail || !subject) {
      return res.status(400).json({ success: false, message: 'mentorEmail and subject are required' });
    }

    const newLog = {
      id: `mlog-${Date.now()}`,
      senderId: senderId || 'guest',
      senderName: senderName || 'Fellow Student',
      senderEmail: senderEmail || 'student@gmail.com',
      mentorId: mentorId || 'mentor',
      mentorName: mentorName || 'Peer Mentor',
      mentorEmail: mentorEmail,
      mentorUniversity: mentorUniversity || 'Campus Peer',
      skillName: skillName || 'Skill Inquiry',
      sessionType: sessionType,
      hourlyRate: Number(hourlyRate) || 0,
      subject: subject,
      body: body || '',
      draftOpened: Boolean(draftOpened),
      openedAt: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };

    if (!db.mailLogs) db.mailLogs = [];
    db.mailLogs.unshift(newLog);

    writeDB(db);

    res.status(201).json({ success: true, mailLog: newLog });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// POST /api/reviews - Add review & recalculate rating
// -------------------------------------------------------------
app.post('/api/reviews', (req, res) => {
  try {
    const db = readDB();
    const {
      studentId,
      reviewerId,
      reviewerName,
      reviewerAvatar,
      reviewerUniversity,
      rating,
      skillName,
      sessionType,
      comment
    } = req.body;

    if (!studentId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'studentId, rating, and comment are required' });
    }

    const studentIndex = db.students.findIndex(s => s.id === studentId);
    if (studentIndex === -1) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }

    const numRating = Math.min(5, Math.max(1, Number(rating) || 5));

    const newReview = {
      id: `rev-${Date.now()}`,
      studentId,
      reviewerId: reviewerId || 'guest',
      reviewerName: reviewerName || 'Verified Peer',
      reviewerAvatar: reviewerAvatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(reviewerName || 'peer')}`,
      reviewerUniversity: reviewerUniversity || 'University Peer',
      rating: numRating,
      skillName: skillName || 'Skill Swap Session',
      sessionType: sessionType || 'Skill Swap',
      comment,
      createdAt: new Date().toISOString()
    };

    if (!db.reviews) db.reviews = [];
    db.reviews.unshift(newReview);

    const studentReviews = db.reviews.filter(r => r.studentId === studentId);
    const sumRatings = studentReviews.reduce((sum, r) => sum + r.rating, 0);
    const newAvg = Number((sumRatings / studentReviews.length).toFixed(2));

    db.students[studentIndex].rating = newAvg;
    db.students[studentIndex].reviewCount = studentReviews.length;

    writeDB(db);

    res.status(201).json({
      success: true,
      review: newReview,
      updatedStudent: db.students[studentIndex]
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// GET /api/reviews/:studentId
// -------------------------------------------------------------
app.get('/api/reviews/:studentId', (req, res) => {
  try {
    const db = readDB();
    const reviews = (db.reviews || []).filter(r => r.studentId === req.params.studentId);
    res.json({ success: true, count: reviews.length, reviews });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// GET /api/notifications
// -------------------------------------------------------------
app.get('/api/notifications', (req, res) => {
  try {
    const db = readDB();
    const { email } = req.query;
    let notifs = [...(db.notifications || [])];
    if (email) {
      notifs = notifs.filter(n => n.recipientEmail === email || n.senderEmail === email);
    }
    res.json({ success: true, count: notifs.length, notifications: notifs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// POST /api/reset - Reset DB to seed state
// -------------------------------------------------------------
app.post('/api/reset', (req, res) => {
  try {
    const data = resetDB();
    res.json({ success: true, message: 'Database reset to demo seed data', data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Serve frontend static build if available
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      return res.sendFile(path.join(clientDistPath, 'index.html'));
    }
    next();
  });
}

app.listen(PORT, () => {
  console.log(`🚀 SkillSwap Backend Server running on port ${PORT} (Currency: ₹ INR)`);
});
