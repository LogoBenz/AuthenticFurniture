import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Club, Event, Election, Notification, ActivityLog, StudentDashboard, ClubJoinRequest, EventRegistration, ElectionVote } from '../types';
import { 
  DEMO_CLUBS, 
  DEMO_EVENTS, 
  DEMO_ELECTIONS, 
  DEMO_NOTIFICATIONS, 
  DEMO_ACTIVITY_LOGS,
  getClubsByIds,
  getUpcomingEvents,
  getAvailableClubs,
  getUserNotifications,
  getUserActivityLogs,
  getClubById,
  getEventById,
  getElectionById
} from '../data/mockData';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

interface ClubContextType {
  // Data
  clubs: Club[];
  events: Event[];
  elections: Election[];
  notifications: Notification[];
  studentDashboard: StudentDashboard | null;
  
  // Actions
  joinClub: (request: ClubJoinRequest) => Promise<void>;
  leaveClub: (clubId: string) => Promise<void>;
  registerForEvent: (registration: EventRegistration) => Promise<void>;
  unregisterFromEvent: (eventId: string) => Promise<void>;
  voteInElection: (vote: ElectionVote) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => void;
  
  // Loading states
  loading: boolean;
  joinLoading: boolean;
  eventLoading: boolean;
  voteLoading: boolean;
  
  // Refresh functions
  refreshDashboard: () => Promise<void>;
}

const ClubContext = createContext<ClubContextType | undefined>(undefined);

export const useClub = () => {
  const context = useContext(ClubContext);
  if (context === undefined) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
};

interface ClubProviderProps {
  children: ReactNode;
}

export const ClubProvider: React.FC<ClubProviderProps> = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [clubs, setClubs] = useState<Club[]>(DEMO_CLUBS);
  const [events, setEvents] = useState<Event[]>(DEMO_EVENTS);
  const [elections, setElections] = useState<Election[]>(DEMO_ELECTIONS);
  const [notifications, setNotifications] = useState<Notification[]>(DEMO_NOTIFICATIONS);
  const [studentDashboard, setStudentDashboard] = useState<StudentDashboard | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [eventLoading, setEventLoading] = useState(false);
  const [voteLoading, setVoteLoading] = useState(false);

  // Initialize dashboard when user changes
  useEffect(() => {
    if (isAuthenticated && user) {
      refreshDashboard();
    } else {
      setStudentDashboard(null);
    }
  }, [isAuthenticated, user]);

  const refreshDashboard = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const userClubIds = user.joinedClubs || [];
      const joinedClubs = getClubsByIds(userClubIds);
      const upcomingEvents = getUpcomingEvents(userClubIds);
      const availableClubs = getAvailableClubs(userClubIds);
      const userNotifications = getUserNotifications(user.id);
      const recentActivity = getUserActivityLogs(user.id);
      
      const dashboard: StudentDashboard = {
        joinedClubs,
        upcomingEvents: upcomingEvents.slice(0, 5), // Limit to 5 upcoming events
        availableClubs: availableClubs.slice(0, 10), // Limit to 10 available clubs
        notifications: userNotifications.slice(0, 10), // Limit to 10 recent notifications
        canJoinMoreClubs: userClubIds.length < 3,
        recentActivity: recentActivity.slice(0, 5) // Limit to 5 recent activities
      };
      
      setStudentDashboard(dashboard);
    } catch (error) {
      console.error('Failed to refresh dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const joinClub = async (request: ClubJoinRequest) => {
    if (!user) throw new Error('User not authenticated');
    
    const userClubIds = user.joinedClubs || [];
    if (userClubIds.length >= 3) {
      throw new Error('You can only join up to 3 clubs');
    }
    
    if (userClubIds.includes(request.clubId)) {
      throw new Error('You are already a member of this club');
    }

    setJoinLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const club = getClubById(request.clubId);
      if (!club) throw new Error('Club not found');
      
      if (club.memberIds.length >= club.maxMembers) {
        throw new Error('Club has reached maximum capacity');
      }
      
      // Update user's joined clubs
      const updatedUser = {
        ...user,
        joinedClubs: [...userClubIds, request.clubId]
      };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      // Update club's member list
      const updatedClubs = clubs.map(c => 
        c.id === request.clubId 
          ? { ...c, memberIds: [...c.memberIds, user.id] }
          : c
      );
      setClubs(updatedClubs);
      
      // Add notification
      const newNotification: Notification = {
        id: 'notif-' + Date.now(),
        userId: user.id,
        title: `Welcome to ${club.name}!`,
        message: `Your membership to ${club.name} has been approved. Welcome aboard!`,
        type: 'club_joined',
        isRead: false,
        actionUrl: `/clubs/${club.id}`,
        relatedId: club.id,
        createdAt: new Date()
      };
      setNotifications(prev => [newNotification, ...prev]);
      
      // Add activity log
      const newActivity: ActivityLog = {
        id: 'log-' + Date.now(),
        userId: user.id,
        action: 'Joined club',
        entityType: 'club',
        entityId: club.id,
        details: { clubName: club.name },
        timestamp: new Date()
      };
      
      await refreshDashboard();
      toast.success(`Successfully joined ${club.name}!`);
      
    } catch (error) {
      throw error;
    } finally {
      setJoinLoading(false);
    }
  };

  const leaveClub = async (clubId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    const userClubIds = user.joinedClubs || [];
    if (!userClubIds.includes(clubId)) {
      throw new Error('You are not a member of this club');
    }

    setJoinLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const club = getClubById(clubId);
      if (!club) throw new Error('Club not found');
      
      // Update user's joined clubs
      const updatedUser = {
        ...user,
        joinedClubs: userClubIds.filter(id => id !== clubId)
      };
      localStorage.setItem('userData', JSON.stringify(updatedUser));
      
      // Update club's member list
      const updatedClubs = clubs.map(c => 
        c.id === clubId 
          ? { ...c, memberIds: c.memberIds.filter(id => id !== user.id) }
          : c
      );
      setClubs(updatedClubs);
      
      // Add notification
      const newNotification: Notification = {
        id: 'notif-' + Date.now(),
        userId: user.id,
        title: `Left ${club.name}`,
        message: `You have successfully left ${club.name}.`,
        type: 'club_left',
        isRead: false,
        relatedId: club.id,
        createdAt: new Date()
      };
      setNotifications(prev => [newNotification, ...prev]);
      
      await refreshDashboard();
      toast.success(`Successfully left ${club.name}`);
      
    } catch (error) {
      throw error;
    } finally {
      setJoinLoading(false);
    }
  };

  const registerForEvent = async (registration: EventRegistration) => {
    if (!user) throw new Error('User not authenticated');
    
    setEventLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const event = getEventById(registration.eventId);
      if (!event) throw new Error('Event not found');
      
      if (event.registeredAttendees.includes(user.id)) {
        throw new Error('You are already registered for this event');
      }
      
      if (event.registeredAttendees.length >= event.maxAttendees) {
        // Add to waitlist
        const updatedEvents = events.map(e => 
          e.id === registration.eventId 
            ? { ...e, waitlist: [...e.waitlist, user.id] }
            : e
        );
        setEvents(updatedEvents);
        toast.success('Added to event waitlist');
      } else {
        // Register for event
        const updatedEvents = events.map(e => 
          e.id === registration.eventId 
            ? { ...e, registeredAttendees: [...e.registeredAttendees, user.id] }
            : e
        );
        setEvents(updatedEvents);
        
        // Add notification
        const newNotification: Notification = {
          id: 'notif-' + Date.now(),
          userId: user.id,
          title: 'Event Registration Confirmed',
          message: `You have successfully registered for "${event.title}".`,
          type: 'event_created',
          isRead: false,
          actionUrl: `/events/${event.id}`,
          relatedId: event.id,
          createdAt: new Date()
        };
        setNotifications(prev => [newNotification, ...prev]);
        
        toast.success(`Successfully registered for ${event.title}!`);
      }
      
      await refreshDashboard();
      
    } catch (error) {
      throw error;
    } finally {
      setEventLoading(false);
    }
  };

  const unregisterFromEvent = async (eventId: string) => {
    if (!user) throw new Error('User not authenticated');
    
    setEventLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const event = getEventById(eventId);
      if (!event) throw new Error('Event not found');
      
      // Remove from registered attendees or waitlist
      const updatedEvents = events.map(e => 
        e.id === eventId 
          ? { 
              ...e, 
              registeredAttendees: e.registeredAttendees.filter(id => id !== user.id),
              waitlist: e.waitlist.filter(id => id !== user.id)
            }
          : e
      );
      setEvents(updatedEvents);
      
      await refreshDashboard();
      toast.success(`Unregistered from ${event.title}`);
      
    } catch (error) {
      throw error;
    } finally {
      setEventLoading(false);
    }
  };

  const voteInElection = async (vote: ElectionVote) => {
    if (!user) throw new Error('User not authenticated');
    
    setVoteLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const election = getElectionById(vote.electionId);
      if (!election) throw new Error('Election not found');
      
      if (election.voterIds.includes(user.id)) {
        throw new Error('You have already voted in this election');
      }
      
      if (!election.isActive) {
        throw new Error('Election is not active');
      }
      
      // Update election with votes
      const updatedElections = elections.map(e => {
        if (e.id === vote.electionId) {
          const updatedPositions = e.positions.map(position => {
            const voteForPosition = vote.votes.find(v => v.positionId === position.id);
            if (voteForPosition) {
              const updatedCandidates = position.candidates.map(candidate => 
                candidate.id === voteForPosition.candidateId 
                  ? { ...candidate, votes: candidate.votes + 1 }
                  : candidate
              );
              return {
                ...position,
                candidates: updatedCandidates,
                totalVotes: position.totalVotes + 1
              };
            }
            return position;
          });
          
          return {
            ...e,
            positions: updatedPositions,
            voterIds: [...e.voterIds, user.id]
          };
        }
        return e;
      });
      
      setElections(updatedElections);
      
      // Add notification
      const newNotification: Notification = {
        id: 'notif-' + Date.now(),
        userId: user.id,
        title: 'Vote Recorded',
        message: `Your vote in "${election.title}" has been successfully recorded.`,
        type: 'election_started',
        isRead: false,
        actionUrl: `/elections/${election.id}`,
        relatedId: election.id,
        createdAt: new Date()
      };
      setNotifications(prev => [newNotification, ...prev]);
      
      toast.success('Your vote has been recorded successfully!');
      
    } catch (error) {
      throw error;
    } finally {
      setVoteLoading(false);
    }
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === notificationId 
          ? { ...notif, isRead: true }
          : notif
      )
    );
  };

  const value = {
    clubs,
    events,
    elections,
    notifications,
    studentDashboard,
    joinClub,
    leaveClub,
    registerForEvent,
    unregisterFromEvent,
    voteInElection,
    markNotificationAsRead,
    loading,
    joinLoading,
    eventLoading,
    voteLoading,
    refreshDashboard
  };

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
};