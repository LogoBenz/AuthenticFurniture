import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Search,
  Filter,
  Plus,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { useClub } from '../contexts/ClubContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Event } from '../types';
import { format, isAfter, isBefore, addDays } from 'date-fns';

type EventFilter = 'all' | 'my_clubs' | 'registered' | 'upcoming' | 'today';

const EVENT_FILTERS: { value: EventFilter; label: string }[] = [
  { value: 'all', label: 'All Events' },
  { value: 'my_clubs', label: 'My Clubs' },
  { value: 'registered', label: 'Registered' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'today', label: 'Today' },
];

export const EventsPage: React.FC = () => {
  const { user } = useAuth();
  const { events, clubs, registerForEvent, unregisterFromEvent, eventLoading } = useClub();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<EventFilter>('all');

  const userClubIds = user?.joinedClubs || [];
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const tomorrow = addDays(today, 1);

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    switch (selectedFilter) {
      case 'my_clubs':
        matchesFilter = userClubIds.includes(event.clubId);
        break;
      case 'registered':
        matchesFilter = event.registeredAttendees.includes(user?.id || '') || 
                       event.waitlist.includes(user?.id || '');
        break;
      case 'upcoming':
        matchesFilter = isAfter(event.startDate, now);
        break;
      case 'today':
        matchesFilter = event.startDate >= today && event.startDate < tomorrow;
        break;
    }
    
    return matchesSearch && matchesFilter && event.status === 'published';
  }).sort((a, b) => a.startDate.getTime() - b.startDate.getTime());

  const getClubName = (clubId: string) => {
    const club = clubs.find(c => c.id === clubId);
    return club?.name || 'Unknown Club';
  };

  const getEventStatus = (event: Event) => {
    const userId = user?.id || '';
    
    if (event.registeredAttendees.includes(userId)) {
      return 'registered';
    }
    if (event.waitlist.includes(userId)) {
      return 'waitlisted';
    }
    if (isBefore(event.endDate, now)) {
      return 'completed';
    }
    if (event.registeredAttendees.length >= event.maxAttendees) {
      return 'full';
    }
    if (!userClubIds.includes(event.clubId) && !event.isPublic) {
      return 'restricted';
    }
    return 'available';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'registered':
        return <Badge variant="success" size="sm"><CheckCircle className="w-3 h-3 mr-1" />Registered</Badge>;
      case 'waitlisted':
        return <Badge variant="warning" size="sm"><Clock className="w-3 h-3 mr-1" />Waitlisted</Badge>;
      case 'completed':
        return <Badge variant="default" size="sm">Completed</Badge>;
      case 'full':
        return <Badge variant="danger" size="sm"><XCircle className="w-3 h-3 mr-1" />Full</Badge>;
      case 'restricted':
        return <Badge variant="warning" size="sm"><AlertCircle className="w-3 h-3 mr-1" />Members Only</Badge>;
      default:
        return <Badge variant="info" size="sm">Available</Badge>;
    }
  };

  const getActionButton = (event: Event, status: string) => {
    const userId = user?.id || '';
    
    switch (status) {
      case 'registered':
        return (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleUnregister(event.id)}
            loading={eventLoading}
          >
            Unregister
          </Button>
        );
      case 'waitlisted':
        return (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleUnregister(event.id)}
            loading={eventLoading}
          >
            Leave Waitlist
          </Button>
        );
      case 'available':
        return (
          <Button 
            size="sm"
            onClick={() => handleRegister(event.id)}
            loading={eventLoading}
          >
            <Plus className="w-4 h-4 mr-1" />
            Register
          </Button>
        );
      case 'full':
        return (
          <Button 
            size="sm"
            onClick={() => handleRegister(event.id)}
            loading={eventLoading}
          >
            Join Waitlist
          </Button>
        );
      default:
        return (
          <Button size="sm" disabled>
            {status === 'completed' ? 'Completed' : 'Unavailable'}
          </Button>
        );
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      await registerForEvent({ eventId });
    } catch (error) {
      // Error handled by toast in context
    }
  };

  const handleUnregister = async (eventId: string) => {
    try {
      await unregisterFromEvent(eventId);
    } catch (error) {
      // Error handled by toast in context
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events</h1>
          <p className="text-gray-600">
            Discover and register for exciting club events
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search events by title or description..."
              icon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {EVENT_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedFilter(filter.value)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedFilter === filter.value
                    ? 'bg-emu-100 text-emu-700 border border-emu-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Events List */}
      {filteredEvents.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
          <p className="text-gray-600">
            {selectedFilter === 'my_clubs' 
              ? "No events from your clubs. Join more clubs to see their events!"
              : selectedFilter === 'registered'
              ? "You haven't registered for any events yet."
              : "Try adjusting your search or filter criteria."
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredEvents.map((event, index) => {
            const status = getEventStatus(event);
            const clubName = getClubName(event.clubId);
            const isUpcoming = isAfter(event.startDate, now);
            const isToday = event.startDate >= today && event.startDate < tomorrow;
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card hover className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    {/* Event Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {event.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="font-medium text-emu-600">{clubName}</span>
                            {isToday && (
                              <Badge variant="warning" size="sm">Today</Badge>
                            )}
                            {getStatusBadge(status)}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {event.description}
                      </p>
                      
                      {/* Event Details */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{format(event.startDate, 'MMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          <span>
                            {format(event.startDate, 'HH:mm')} - {format(event.endDate, 'HH:mm')}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{event.location}</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>
                            {event.registeredAttendees.length}/{event.maxAttendees} registered
                            {event.waitlist.length > 0 && (
                              <span className="text-orange-600 ml-1">
                                (+{event.waitlist.length} waiting)
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                      
                      {/* Event Tags */}
                      {event.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {event.tags.map((tag) => (
                            <Badge key={tag} size="sm" variant="default">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-3">
                      {isUpcoming && getActionButton(event, status)}
                      <Button variant="ghost" size="sm">
                        View Details
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};