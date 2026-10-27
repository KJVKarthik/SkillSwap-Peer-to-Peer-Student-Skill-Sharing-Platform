import {
  Student,
  Review,
  SwapRequest,
  EmailNotification,
  MatchResult,
  SmartSkillMakerResponse,
  MailLogEntry,
  StorageStatus
} from './types';

const API_BASE = '/api';

export async function getStudents(params?: {
  search?: string;
  category?: string;
  mode?: string;
  maxPrice?: number;
  minRating?: number;
}): Promise<Student[]> {
  const query = new URLSearchParams();
  if (params?.search) query.set('search', params.search);
  if (params?.category) query.set('category', params.category);
  if (params?.mode) query.set('mode', params.mode);
  if (params?.maxPrice) query.set('maxPrice', params.maxPrice.toString());
  if (params?.minRating) query.set('minRating', params.minRating.toString());

  const res = await fetch(`${API_BASE}/students?${query.toString()}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch students');
  return data.students;
}

export async function getStudentById(id: string): Promise<{ student: Student; reviews: Review[]; gmailUrl: string }> {
  const res = await fetch(`${API_BASE}/students/${id}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch student details');
  return data;
}

export async function updateStudent(id: string, updates: Partial<Student>): Promise<Student> {
  const res = await fetch(`${API_BASE}/students/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to update student');
  return data.student;
}

export async function createStudent(studentData: Partial<Student>): Promise<Student> {
  const res = await fetch(`${API_BASE}/students`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(studentData),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to create student profile');
  return data.student;
}

export async function getMatches(params?: {
  userId?: string;
  teachSkill?: string;
  learnSkill?: string;
}): Promise<MatchResult[]> {
  const query = new URLSearchParams();
  if (params?.userId) query.set('userId', params.userId);
  if (params?.teachSkill) query.set('teachSkill', params.teachSkill);
  if (params?.learnSkill) query.set('learnSkill', params.learnSkill);

  const res = await fetch(`${API_BASE}/match?${query.toString()}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch matches');
  return data.matches;
}

export async function runSmartSkillMaker(params: {
  userId?: string;
  teachSkills: string[];
  learnSkills: string[];
}): Promise<SmartSkillMakerResponse> {
  const res = await fetch(`${API_BASE}/smart-skill-maker`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to run skill matching');
  return data;
}

export async function getRequests(userId?: string): Promise<SwapRequest[]> {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  const res = await fetch(`${API_BASE}/requests${query}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch requests');
  return data.requests;
}

export async function createRequest(payload: {
  requesterId: string;
  providerId: string;
  type: 'swap' | 'paid';
  offeredSkill?: string | null;
  requestedSkill: string;
  durationHours: number;
  scheduledTime: string;
  notes?: string;
  meetingPlatform?: string;
}): Promise<{ request: SwapRequest; notification: EmailNotification; gmailComposeUrl: string }> {
  const res = await fetch(`${API_BASE}/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to submit request');
  return data;
}

export async function updateRequestStatus(id: string, status: 'accepted' | 'declined' | 'completed'): Promise<SwapRequest> {
  const res = await fetch(`${API_BASE}/requests/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to update request');
  return data.request;
}

export async function submitReview(payload: {
  studentId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar?: string;
  reviewerUniversity?: string;
  rating: number;
  skillName: string;
  sessionType: string;
  comment: string;
}): Promise<{ review: Review; updatedStudent: Student }> {
  const res = await fetch(`${API_BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to submit review');
  return data;
}

export async function getStudentReviews(studentId: string): Promise<Review[]> {
  const res = await fetch(`${API_BASE}/reviews/${studentId}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch reviews');
  return data.reviews;
}

export async function getNotifications(email?: string): Promise<EmailNotification[]> {
  const query = email ? `?email=${encodeURIComponent(email)}` : '';
  const res = await fetch(`${API_BASE}/notifications${query}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch notifications');
  return data.notifications;
}

export async function getMailLogs(userId?: string): Promise<MailLogEntry[]> {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : '';
  const res = await fetch(`${API_BASE}/mail-logs${query}`);
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to fetch mail logs');
  return data.mailLogs;
}

export async function createMailLog(payload: {
  senderId?: string;
  senderName: string;
  senderEmail: string;
  mentorId: string;
  mentorName: string;
  mentorEmail: string;
  mentorUniversity?: string;
  skillName: string;
  sessionType: 'Free Skill Swap' | 'Paid Mentoring Session' | 'General Inquiry';
  hourlyRate?: number;
  subject: string;
  body: string;
  draftOpened?: boolean;
}): Promise<MailLogEntry> {
  const res = await fetch(`${API_BASE}/mail-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to create mail log');
  return data.mailLog;
}

export async function resetDatabase(): Promise<void> {
  const res = await fetch(`${API_BASE}/reset`, { method: 'POST' });
  const data = await res.json();
  if (!data.success) throw new Error(data.message || 'Failed to reset database');
}

export async function getStorageStatus(): Promise<StorageStatus> {
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    return {
      mode: data.storageMode || 'local_demo',
      details: data.storageDetails || 'Local Persistent Demo Mode (server/data/db.json)',
      timestamp: data.timestamp
    };
  } catch {
    return {
      mode: 'local_demo',
      details: 'Local Persistent Demo Mode (server/data/db.json)'
    };
  }
}

// Gmail direct compose URL generator — strictly uses Gmail web compose URL, NEVER mailto:
export function buildGmailComposeUrl(toEmail: string, subject = '', body = ''): string {
  const params = new URLSearchParams({
    view: 'cm',
    fs: '1',
    to: toEmail,
    su: subject,
    body: body,
  });
  return `https://mail.google.com/mail/?${params.toString()}`;
}

// Open Gmail web compose in a new browser tab
export function openGmailCompose(toEmail: string, subject = '', body = ''): Window | null {
  const url = buildGmailComposeUrl(toEmail, subject, body);
  return window.open(url, '_blank', 'noopener,noreferrer');
}
