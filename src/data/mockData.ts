import { Club, Event, Election, User, Notification, ActivityLog, ClubStats, MonthlyGrowth } from '../types';

// Mock data for demo clubs
export const DEMO_CLUBS: Club[] = [
  {
    id: 'club-chess-001',
    name: 'EMU Chess Club',
    description: 'Strategic minds unite! Join us for weekly tournaments, training sessions, and chess theory discussions. Whether you\'re a beginner or a grandmaster, everyone is welcome to improve their game.',
    category: 'academic',
    logo: '♟️',
    bannerImage: 'https://images.pexels.com/photos/1040157/pexels-photo-1040157.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=2',
    isApproved: true,
    adminIds: ['club-001'],
    memberIds: ['member-001', 'user-chess-1', 'user-chess-2', 'user-chess-3'],
    pendingMemberIds: [],
    maxMembers: 50,
    foundedDate: new Date('2023-09-01'),
    contactEmail: 'chess@emu.edu.tr',
    socialLinks: {
      instagram: '@emuchess',
      website: 'https://emuchess.com'
    },
    status: 'approved',
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date(),
    stats: {
      totalMembers: 4,
      totalEvents: 12,
      upcomingEvents: 3,
      completedEvents: 9,
      averageAttendance: 85,
      membershipGrowth: [
        { month: 'Sep', members: 15, events: 2, attendance: 12 },
        { month: 'Oct', members: 25, events: 3, attendance: 20 },
        { month: 'Nov', members: 35, events: 4, attendance: 28 },
        { month: 'Dec', members: 42, events: 3, attendance: 35 }
      ],
      engagementRate: 78,
      activeElections: 1
    }
  },
  {
    id: 'club-sports-001',
    name: 'EMU Sports Club',
    description: 'Get active and stay fit! We organize various sports activities including football, basketball, volleyball, and fitness training. Join us for regular matches and tournaments.',
    category: 'sports',
    logo: '⚽',
    bannerImage: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=2',
    isApproved: true,
    adminIds: ['club-001'],
    memberIds: ['user-sports-1', 'user-sports-2', 'user-sports-3', 'user-sports-4', 'user-sports-5'],
    pendingMemberIds: ['user-pending-1'],
    maxMembers: 100,
    foundedDate: new Date('2023-08-15'),
    contactEmail: 'sports@emu.edu.tr',
    socialLinks: {
      instagram: '@emusports',
      facebook: 'EMU Sports Club'
    },
    status: 'approved',
    createdAt: new Date('2023-08-15'),
    updatedAt: new Date(),
    stats: {
      totalMembers: 5,
      totalEvents: 18,
      upcomingEvents: 5,
      completedEvents: 13,
      averageAttendance: 92,
      membershipGrowth: [
        { month: 'Aug', members: 20, events: 3, attendance: 18 },
        { month: 'Sep', members: 35, events: 4, attendance: 32 },
        { month: 'Oct', members: 50, events: 5, attendance: 46 },
        { month: 'Nov', members: 65, events: 6, attendance: 60 }
      ],
      engagementRate: 85,
      activeElections: 0
    }
  },
  {
    id: 'club-anime-001',
    name: 'EMU Anime Society',
    description: 'Otaku paradise! Watch anime together, discuss manga, cosplay events, and celebrate Japanese culture. From classics to the latest releases, we cover it all!',
    category: 'entertainment',
    logo: '🎌',
    bannerImage: 'https://images.pexels.com/photos/7862463/pexels-photo-7862463.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=2',
    isApproved: true,
    adminIds: ['club-001'],
    memberIds: ['user-anime-1', 'user-anime-2', 'user-anime-3'],
    pendingMemberIds: ['user-pending-2', 'user-pending-3'],
    maxMembers: 75,
    foundedDate: new Date('2023-10-01'),
    contactEmail: 'anime@emu.edu.tr',
    socialLinks: {
      instagram: '@emuanime',
      twitter: '@emuanimesociety'
    },
    status: 'approved',
    createdAt: new Date('2023-10-01'),
    updatedAt: new Date(),
    stats: {
      totalMembers: 3,
      totalEvents: 8,
      upcomingEvents: 2,
      completedEvents: 6,
      averageAttendance: 88,
      membershipGrowth: [
        { month: 'Oct', members: 12, events: 2, attendance: 10 },
        { month: 'Nov', members: 22, events: 3, attendance: 19 },
        { month: 'Dec', members: 28, events: 3, attendance: 25 }
      ],
      engagementRate: 82,
      activeElections: 0
    }
  },
  {
    id: 'club-mma-001',
    name: 'EMU MMA Club',
    description: 'Mixed Martial Arts training for all levels. Learn discipline, self-defense, and various fighting techniques including boxing, wrestling, and Brazilian Jiu-Jitsu.',
    category: 'martial_arts',
    logo: '🥊',
    bannerImage: 'https://images.pexels.com/photos/7045717/pexels-photo-7045717.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=2',
    isApproved: true,
    adminIds: ['club-001'],
    memberIds: ['user-mma-1', 'user-mma-2'],
    pendingMemberIds: [],
    maxMembers: 30,
    foundedDate: new Date('2023-11-01'),
    contactEmail: 'mma@emu.edu.tr',
    socialLinks: {
      instagram: '@emumma'
    },
    status: 'approved',
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date(),
    stats: {
      totalMembers: 2,
      totalEvents: 6,
      upcomingEvents: 2,
      completedEvents: 4,
      averageAttendance: 95,
      membershipGrowth: [
        { month: 'Nov', members: 8, events: 2, attendance: 7 },
        { month: 'Dec', members: 15, events: 2, attendance: 14 }
      ],
      engagementRate: 90,
      activeElections: 0
    }
  },
  {
    id: 'club-occult-001',
    name: 'EMU Occult Studies',
    description: 'Explore the mysteries of the unknown. Study ancient texts, discuss paranormal phenomena, and delve into esoteric knowledge. For the curious and open-minded.',
    category: 'other',
    logo: '🔮',
    bannerImage: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&dpr=2',
    isApproved: true,
    adminIds: ['club-001'],
    memberIds: ['user-occult-1'],
    pendingMemberIds: [],
    maxMembers: 25,
    foundedDate: new Date('2023-12-01'),
    contactEmail: 'occult@emu.edu.tr',
    socialLinks: {
      website: 'https://emuoccult.mystical'
    },
    status: 'approved',
    createdAt: new Date('2023-12-01'),
    updatedAt: new Date(),
    stats: {
      totalMembers: 1,
      totalEvents: 3,
      upcomingEvents: 1,
      completedEvents: 2,
      averageAttendance: 100,
      membershipGrowth: [
        { month: 'Dec', members: 5, events: 1, attendance: 5 }
      ],
      engagementRate: 95,
      activeElections: 0
    }
  }
];

export const DEMO_EVENTS: Event[] = [
  // Chess Club Events
  {
    id: 'event-chess-001',
    clubId: 'club-chess-001',
    title: 'Weekly Chess Tournament',
    description: 'Join our weekly Swiss-system tournament. All skill levels welcome!',
    startDate: new Date('2024-01-20T14:00:00'),
    endDate: new Date('2024-01-20T18:00:00'),
    location: 'Student Center - Room 201',
    maxAttendees: 20,
    registeredAttendees: ['member-001', 'user-chess-1'],
    waitlist: [],
    attendedMembers: [],
    isPublic: true,
    requiresApproval: false,
    status: 'published',
    createdBy: 'club-001',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
    tags: ['tournament', 'weekly', 'chess']
  },
  {
    id: 'event-chess-002',
    clubId: 'club-chess-001',
    title: 'Chess Strategy Workshop',
    description: 'Learn advanced chess strategies from our club masters.',
    startDate: new Date('2024-01-25T16:00:00'),
    endDate: new Date('2024-01-25T18:00:00'),
    location: 'Library - Study Room 3',
    maxAttendees: 15,
    registeredAttendees: ['user-chess-2', 'user-chess-3'],
    waitlist: [],
    attendedMembers: [],
    isPublic: true,
    requiresApproval: false,
    status: 'published',
    createdBy: 'club-001',
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-12'),
    tags: ['workshop', 'strategy', 'learning']
  },
  // Sports Club Events
  {
    id: 'event-sports-001',
    clubId: 'club-sports-001',
    title: 'Basketball Tournament Finals',
    description: 'Championship match between top teams. Come support your favorites!',
    startDate: new Date('2024-01-22T19:00:00'),
    endDate: new Date('2024-01-22T21:00:00'),
    location: 'Sports Complex - Main Court',
    maxAttendees: 100,
    registeredAttendees: ['user-sports-1', 'user-sports-2', 'user-sports-3'],
    waitlist: [],
    attendedMembers: [],
    isPublic: true,
    requiresApproval: false,
    status: 'published',
    createdBy: 'club-001',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-08'),
    tags: ['basketball', 'tournament', 'finals']
  },
  // Anime Society Events
  {
    id: 'event-anime-001',
    clubId: 'club-anime-001',
    title: 'Anime Movie Night: Your Name',
    description: 'Watch the acclaimed anime movie "Your Name" with fellow otaku!',
    startDate: new Date('2024-01-24T20:00:00'),
    endDate: new Date('2024-01-24T22:30:00'),
    location: 'Student Center - Theater',
    maxAttendees: 50,
    registeredAttendees: ['user-anime-1', 'user-anime-2'],
    waitlist: [],
    attendedMembers: [],
    isPublic: true,
    requiresApproval: false,
    status: 'published',
    createdBy: 'club-001',
    createdAt: new Date('2024-01-14'),
    updatedAt: new Date('2024-01-14'),
    tags: ['movie', 'anime', 'social']
  },
  // MMA Club Events
  {
    id: 'event-mma-001',
    clubId: 'club-mma-001',
    title: 'Beginner MMA Training',
    description: 'Introduction to MMA basics. Perfect for newcomers!',
    startDate: new Date('2024-01-23T18:00:00'),
    endDate: new Date('2024-01-23T20:00:00'),
    location: 'Gym - Training Room 2',
    maxAttendees: 15,
    registeredAttendees: ['user-mma-1'],
    waitlist: [],
    attendedMembers: [],
    isPublic: true,
    requiresApproval: true,
    status: 'published',
    createdBy: 'club-001',
    createdAt: new Date('2024-01-13'),
    updatedAt: new Date('2024-01-13'),
    tags: ['training', 'beginner', 'mma']
  },
  // Occult Studies Events
  {
    id: 'event-occult-001',
    clubId: 'club-occult-001',
    title: 'Ancient Mysteries Discussion',
    description: 'Explore ancient civilizations and their mysterious practices.',
    startDate: new Date('2024-01-26T19:00:00'),
    endDate: new Date('2024-01-26T21:00:00'),
    location: 'Library - Private Study Room',
    maxAttendees: 10,
    registeredAttendees: ['user-occult-1'],
    waitlist: [],
    attendedMembers: [],
    isPublic: false,
    requiresApproval: true,
    status: 'published',
    createdBy: 'club-001',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
    tags: ['discussion', 'ancient', 'mysteries']
  }
];

export const DEMO_ELECTIONS: Election[] = [
  {
    id: 'election-chess-001',
    clubId: 'club-chess-001',
    title: 'Chess Club President Election 2024',
    description: 'Vote for the next president of EMU Chess Club. Candidates will lead the club for the 2024-2025 academic year.',
    positions: [
      {
        id: 'pos-president-001',
        title: 'President',
        description: 'Lead the club and represent it in university activities',
        candidates: [
          {
            id: 'cand-001',
            userId: 'user-chess-1',
            statement: 'I will organize more tournaments and bring international chess masters for workshops.',
            votes: 0
          },
          {
            id: 'cand-002',
            userId: 'user-chess-2',
            statement: 'My focus will be on growing our membership and creating a welcoming environment for beginners.',
            votes: 0
          }
        ],
        maxVotesPerUser: 1,
        totalVotes: 0
      },
      {
        id: 'pos-vicepresident-001',
        title: 'Vice President',
        description: 'Assist the president and manage club activities',
        candidates: [
          {
            id: 'cand-003',
            userId: 'user-chess-3',
            statement: 'I will support the president and ensure smooth club operations.',
            votes: 0
          }
        ],
        maxVotesPerUser: 1,
        totalVotes: 0
      }
    ],
    startDate: new Date('2024-01-20T00:00:00'),
    endDate: new Date('2024-01-27T23:59:59'),
    isActive: true,
    voterIds: [],
    createdAt: new Date('2024-01-15'),
    createdBy: 'club-001'
  }
];

export const DEMO_NOTIFICATIONS: Notification[] = [
  {
    id: 'notif-001',
    userId: 'member-001',
    title: 'Welcome to Chess Club!',
    message: 'Your membership to EMU Chess Club has been approved. Welcome aboard!',
    type: 'club_joined',
    isRead: false,
    actionUrl: '/clubs/club-chess-001',
    relatedId: 'club-chess-001',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    id: 'notif-002',
    userId: 'member-001',
    title: 'New Event: Chess Tournament',
    message: 'A new chess tournament has been scheduled for this weekend. Register now!',
    type: 'event_created',
    isRead: false,
    actionUrl: '/events/event-chess-001',
    relatedId: 'event-chess-001',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
  },
  {
    id: 'notif-003',
    userId: 'member-001',
    title: 'Election Started',
    message: 'Voting has begun for Chess Club President Election 2024. Cast your vote!',
    type: 'election_started',
    isRead: true,
    actionUrl: '/elections/election-chess-001',
    relatedId: 'election-chess-001',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) // 1 day ago
  }
];

export const DEMO_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'log-001',
    userId: 'member-001',
    action: 'Joined club',
    entityType: 'club',
    entityId: 'club-chess-001',
    details: { clubName: 'EMU Chess Club' },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
  },
  {
    id: 'log-002',
    userId: 'member-001',
    action: 'Registered for event',
    entityType: 'event',
    entityId: 'event-chess-001',
    details: { eventTitle: 'Weekly Chess Tournament' },
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000)
  },
  {
    id: 'log-003',
    userId: 'club-001',
    action: 'Created event',
    entityType: 'event',
    entityId: 'event-chess-002',
    details: { eventTitle: 'Chess Strategy Workshop' },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000)
  }
];

// Helper functions to get mock data
export const getClubById = (id: string): Club | undefined => {
  return DEMO_CLUBS.find(club => club.id === id);
};

export const getEventById = (id: string): Event | undefined => {
  return DEMO_EVENTS.find(event => event.id === id);
};

export const getElectionById = (id: string): Election | undefined => {
  return DEMO_ELECTIONS.find(election => election.id === id);
};

export const getClubsByIds = (ids: string[]): Club[] => {
  return DEMO_CLUBS.filter(club => ids.includes(club.id));
};

export const getEventsByClubId = (clubId: string): Event[] => {
  return DEMO_EVENTS.filter(event => event.clubId === clubId);
};

export const getUpcomingEvents = (clubIds: string[]): Event[] => {
  const now = new Date();
  return DEMO_EVENTS.filter(event => 
    clubIds.includes(event.clubId) && 
    event.startDate > now &&
    event.status === 'published'
  ).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());
};

export const getAvailableClubs = (userClubIds: string[]): Club[] => {
  return DEMO_CLUBS.filter(club => 
    !userClubIds.includes(club.id) && 
    club.status === 'approved' &&
    club.memberIds.length < club.maxMembers
  );
};

export const getUserNotifications = (userId: string): Notification[] => {
  return DEMO_NOTIFICATIONS.filter(notif => notif.userId === userId)
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

export const getUserActivityLogs = (userId: string): ActivityLog[] => {
  return DEMO_ACTIVITY_LOGS.filter(log => log.userId === userId)
    .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};