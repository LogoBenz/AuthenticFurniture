export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  studentId?: string;
  createdAt: Date;
  lastLogin?: Date;
  isActive: boolean;
  joinedClubs: string[]; // Club IDs - max 3
  votedElections: string[]; // Election IDs to track voting history
}

export type UserRole = 'super_admin' | 'club_admin' | 'member';

export interface Club {
  id: string;
  name: string;
  description: string;
  category: ClubCategory;
  logo?: string;
  bannerImage?: string;
  isApproved: boolean;
  adminIds: string[];
  memberIds: string[];
  pendingMemberIds: string[];
  maxMembers: number;
  foundedDate: Date;
  contactEmail: string;
  socialLinks: SocialLinks;
  status: ClubStatus;
  createdAt: Date;
  updatedAt: Date;
  stats: ClubStats;
}

export interface ClubStats {
  totalMembers: number;
  totalEvents: number;
  upcomingEvents: number;
  completedEvents: number;
  averageAttendance: number;
  membershipGrowth: MonthlyGrowth[];
  engagementRate: number;
  activeElections: number;
}

export interface MonthlyGrowth {
  month: string;
  members: number;
  events: number;
  attendance: number;
}

export type ClubCategory = 
  | 'academic'
  | 'sports'
  | 'cultural'
  | 'technology'
  | 'arts'
  | 'volunteer'
  | 'professional'
  | 'entertainment'
  | 'martial_arts'
  | 'other';

export type ClubStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

export interface SocialLinks {
  website?: string;
  instagram?: string;
  twitter?: string;
  facebook?: string;
  linkedin?: string;
}

export interface Event {
  id: string;
  clubId: string;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  maxAttendees: number;
  registeredAttendees: string[];
  waitlist: string[];
  attendedMembers: string[];
  isPublic: boolean;
  requiresApproval: boolean;
  status: EventStatus;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export type EventStatus = 'draft' | 'published' | 'cancelled' | 'completed';

export interface Election {
  id: string;
  clubId: string;
  title: string;
  description: string;
  positions: ElectionPosition[];
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  voterIds: string[]; // Track who has voted
  results?: ElectionResults;
  createdAt: Date;
  createdBy: string;
}

export interface ElectionPosition {
  id: string;
  title: string;
  description: string;
  candidates: Candidate[];
  maxVotesPerUser: number;
  totalVotes: number;
}

export interface Candidate {
  id: string;
  userId: string;
  statement: string;
  votes: number;
  user?: User; // Populated user data
}

export interface ElectionResults {
  totalVotes: number;
  participationRate: number;
  positionResults: PositionResult[];
  completedAt: Date;
}

export interface PositionResult {
  positionId: string;
  positionTitle: string;
  winners: string[];
  voteCount: Record<string, number>;
}

export interface Vote {
  id: string;
  electionId: string;
  positionId: string;
  candidateId: string;
  voterId: string;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  actionUrl?: string;
  relatedId?: string; // Club ID, Event ID, etc.
  createdAt: Date;
}

export type NotificationType = 
  | 'club_approved'
  | 'club_rejected'
  | 'club_joined'
  | 'club_left'
  | 'event_created'
  | 'event_reminder'
  | 'event_cancelled'
  | 'election_started'
  | 'election_reminder'
  | 'membership_approved'
  | 'membership_rejected'
  | 'payment_due'
  | 'system'
  | 'announcement';

export interface Payment {
  id: string;
  userId: string;
  clubId: string;
  amount: number;
  description: string;
  dueDate: Date;
  paidDate?: Date;
  status: PaymentStatus;
  createdAt: Date;
}

export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface Document {
  id: string;
  clubId: string;
  title: string;
  description?: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  uploadedBy: string;
  isPublic: boolean;
  allowedRoles: UserRole[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: 'club' | 'event' | 'election' | 'user' | 'system';
  entityId: string;
  details: Record<string, any>;
  timestamp: Date;
  ipAddress?: string;
}

export interface DashboardStats {
  totalClubs: number;
  totalMembers: number;
  activeEvents: number;
  pendingApprovals: number;
  monthlyGrowth: number;
  systemHealth: 'excellent' | 'good' | 'warning' | 'critical';
}

export interface StudentDashboard {
  joinedClubs: Club[];
  upcomingEvents: Event[];
  availableClubs: Club[];
  notifications: Notification[];
  canJoinMoreClubs: boolean;
  recentActivity: ActivityLog[];
}

export interface ClubAnalytics {
  membershipTrends: MonthlyGrowth[];
  eventAttendance: EventAttendanceData[];
  engagementMetrics: EngagementMetrics;
  electionParticipation: ElectionParticipationData[];
  memberDemographics: MemberDemographics;
}

export interface EventAttendanceData {
  eventId: string;
  eventTitle: string;
  date: Date;
  registered: number;
  attended: number;
  attendanceRate: number;
}

export interface EngagementMetrics {
  averageEventsPerMember: number;
  memberRetentionRate: number;
  eventAttendanceRate: number;
  electionParticipationRate: number;
  communicationEngagement: number;
}

export interface ElectionParticipationData {
  electionId: string;
  electionTitle: string;
  date: Date;
  eligibleVoters: number;
  actualVoters: number;
  participationRate: number;
}

export interface MemberDemographics {
  byYear: Record<string, number>;
  byDepartment: Record<string, number>;
  joinDate: Record<string, number>;
  activityLevel: Record<string, number>;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form types
export interface ClubJoinRequest {
  clubId: string;
  message?: string;
}

export interface EventRegistration {
  eventId: string;
  notes?: string;
}

export interface ElectionVote {
  electionId: string;
  votes: {
    positionId: string;
    candidateId: string;
  }[];
}

export interface ClubCreationForm {
  name: string;
  description: string;
  category: ClubCategory;
  contactEmail: string;
  maxMembers: number;
  socialLinks: SocialLinks;
}

export interface EventCreationForm {
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location: string;
  maxAttendees: number;
  isPublic: boolean;
  requiresApproval: boolean;
  tags: string[];
}