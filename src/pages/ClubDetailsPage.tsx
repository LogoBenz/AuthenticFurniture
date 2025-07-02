import React from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  MapPin, 
  Globe, 
  Instagram, 
  Twitter, 
  Facebook,
  Plus,
  CheckCircle,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { useClub } from '../contexts/ClubContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getClubById, getEventsByClubId } from '../data/mockData';
import { format } from 'date-fns';

export const ClubDetailsPage: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>();
  const { user } = useAuth();
  const { joinClub, leaveClub, registerForEvent, joinLoading, eventLoading } = useClub();

  if (!clubId) {
    return <div>Club not found</div>;
  }

  const club = getClubById(clubId);
  const clubEvents = getEventsByClubId(clubId);

  if (!club) {
    return <div>Club not found</div>;
  }

  const userClubIds = user?.joinedClubs || [];
  const isMember = userClubIds.includes(club.id);
  const canJoin = userClubIds.length < 3 && !isMember && club.memberIds.length < club.maxMembers;

  const upcomingEvents = clubEvents.filter(event => 
    event.startDate > new Date() && event.status === 'published'
  );

  const handleJoinClub = async () => {
    try {
      await joinClub({ clubId: club.id });
    } catch (error) {
      // Error handled by toast in context
    }
  };

  const handleLeaveClub = async () => {
    try {
      await leaveClub(club.id);
    } catch (error) {
      // Error handled by toast in context
    }
  };

  const handleRegisterForEvent = async (eventId: string) => {
    try {
      await registerForEvent({ eventId });
    } catch (error) {
      // Error handled by toast in context
    }
  };

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Clubs
      </Button>

      {/* Club Header */}
      <Card className="overflow-hidden">
        {/* Banner */}
        <div className="relative h-64 bg-gradient-to-br from-emu-500 to-emu-600">
          {club.bannerImage ? (
            <img 
              src={club.bannerImage} 
              alt={club.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-8xl">{club.logo || '🏛️'}</div>
            </div>
          )}
          <div className="absolute inset-0 bg-black bg-opacity-20" />
        </div>

        {/* Club Info */}
        <div className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h1 className="text-2xl font-bold text-gray-900">{club.name}</h1>
                {isMember && (
                  <Badge variant="success">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Member
                  </Badge>
                )}
              </div>
              
              <p className="text-gray-600 mb-4">{club.description}</p>
              
              {/* Club Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <div className="font-medium text-gray-900">{club.memberIds.length}</div>
                  <div className="text-gray-500">Members</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{club.stats.totalEvents}</div>
                  <div className="text-gray-500">Total Events</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{club.stats.upcomingEvents}</div>
                  <div className="text-gray-500">Upcoming</div>
                </div>
                <div>
                  <div className="font-medium text-gray-900">{club.stats.averageAttendance}%</div>
                  <div className="text-gray-500">Attendance</div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col space-y-3">
              {isMember ? (
                <Button 
                  variant="outline"
                  onClick={handleLeaveClub}
                  loading={joinLoading}
                >
                  Leave Club
                </Button>
              ) : canJoin ? (
                <Button 
                  onClick={handleJoinClub}
                  loading={joinLoading}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Join Club
                </Button>
              ) : (
                <Button disabled>
                  {club.memberIds.length >= club.maxMembers ? 'Club Full' : 'Cannot Join'}
                </Button>
              )}
              
              {/* Social Links */}
              {(club.socialLinks.website || club.socialLinks.instagram || club.socialLinks.twitter || club.socialLinks.facebook) && (
                <div className="flex space-x-2">
                  {club.socialLinks.website && (
                    <Button variant="ghost" size="sm">
                      <Globe className="w-4 h-4" />
                    </Button>
                  )}
                  {club.socialLinks.instagram && (
                    <Button variant="ghost" size="sm">
                      <Instagram className="w-4 h-4" />
                    </Button>
                  )}
                  {club.socialLinks.twitter && (
                    <Button variant="ghost" size="sm">
                      <Twitter className="w-4 h-4" />
                    </Button>
                  )}
                  {club.socialLinks.facebook && (
                    <Button variant="ghost" size="sm">
                      <Facebook className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Upcoming Events */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Events</h2>
        
        {upcomingEvents.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">No upcoming events scheduled</p>
          </div>
        ) : (
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-gray-200 rounded-lg p-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{event.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{format(event.startDate, 'MMM dd, yyyy')}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>{format(event.startDate, 'HH:mm')}</span>
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span>{event.location}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        <span>{event.registeredAttendees.length}/{event.maxAttendees}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {event.registeredAttendees.includes(user?.id || '') ? (
                      <Badge variant="success" size="sm">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Registered
                      </Badge>
                    ) : (
                      <Button 
                        size="sm"
                        onClick={() => handleRegisterForEvent(event.id)}
                        loading={eventLoading}
                        disabled={!isMember && !event.isPublic}
                      >
                        Register
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Club Information */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* About */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">About</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Founded</span>
              <span className="text-gray-900">{format(club.foundedDate, 'MMMM yyyy')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Category</span>
              <span className="text-gray-900 capitalize">{club.category.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Max Members</span>
              <span className="text-gray-900">{club.maxMembers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Contact</span>
              <span className="text-gray-900">{club.contactEmail}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Status</span>
              <Badge variant="success" size="sm">{club.status}</Badge>
            </div>
          </div>
        </Card>

        {/* Activity Stats */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Activity</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">Engagement Rate</span>
              <span className="text-gray-900">{club.stats.engagementRate}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Completed Events</span>
              <span className="text-gray-900">{club.stats.completedEvents}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Average Attendance</span>
              <span className="text-gray-900">{club.stats.averageAttendance}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Active Elections</span>
              <span className="text-gray-900">{club.stats.activeElections}</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};