export interface SkillOffered {
  id: string;
  name: string;
  category: 'Programming' | 'Design' | 'Music' | 'Academics' | 'Languages' | 'Media' | 'Business' | 'Career' | string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert' | 'Native' | string;
  description: string;
  isSwapAvailable: boolean;
  hourlyPrice: number; // in Indian Rupees (₹)
}

export interface SkillWanted {
  id: string;
  name: string;
  category: string;
  level: string;
  notes?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  university: string;
  major: string;
  avatar: string;
  bio: string;
  hourlyRate: number; // in Indian Rupees (₹)
  openToSwap: boolean;
  rating: number;
  reviewCount: number;
  verifiedStudent: boolean;
  location: string;
  skillsOffered: SkillOffered[];
  skillsWanted: SkillWanted[];
}

export interface Review {
  id: string;
  studentId: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  reviewerUniversity: string;
  rating: number;
  skillName: string;
  sessionType: string;
  comment: string;
  createdAt: string;
}

export interface SwapRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  requesterEmail: string;
  requesterAvatar: string;
  providerId: string;
  providerName: string;
  providerEmail: string;
  type: 'swap' | 'paid';
  offeredSkill: string | null;
  requestedSkill: string;
  durationHours: number;
  totalAmount: number; // in Indian Rupees (₹)
  scheduledTime: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  meetingPlatform: string;
  meetingLink: string;
  notes: string;
  createdAt: string;
}

export interface EmailNotification {
  id: string;
  recipientEmail: string;
  recipientName: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  body: string;
  timestamp: string;
  read: boolean;
}

export interface MailLogEntry {
  id: string;
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
  draftOpened: boolean;
  openedAt?: string;
  createdAt: string;
}

export interface SkillMatchStudent {
  student: Student;
  matchedSkillName: string;
  category?: string;
  matchScore: number;
  sessionType: 'Free Skill Swap' | 'Paid Mentoring Session';
  hourlyRate: number;
  isReciprocal?: boolean;
}

export interface SmartSkillMakerResponse {
  success: boolean;
  activeTeachSkills: string[];
  activeLearnSkills: string[];
  wantWhatITeach: SkillMatchStudent[]; // Students who want to learn skills I can teach
  teachWhatIWant: SkillMatchStudent[]; // Students who can teach skills I want to learn
  reciprocalMatches: SkillMatchStudent[]; // Students matching both directions
  totalMatches: number;
}

export interface MatchResult {
  student: Student;
  isReciprocal: boolean;
  matchScore: number;
  theyCanTeachYou: SkillOffered[];
  youCanTeachThem: SkillWanted[];
  gmailComposeUrl: string;
}

export interface StorageStatus {
  mode: 'mysql' | 'local_demo';
  details: string;
  timestamp?: string;
}
