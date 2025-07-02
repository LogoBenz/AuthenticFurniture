import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Calendar, 
  Trophy, 
  TrendingUp, 
  Clock,
  AlertCircle,
  CheckCircle,
  DollarSign,
  Plus,
  ArrowRight,
  Star,
  Activity
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useClub } from '../contexts/ClubContext';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { studentDashboard, loading, joinClub, registerForEvent, joinLoading, eventLoading } = useClub();

  if (loading || !studentDashboard) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emu-600"></div>
      </div>
    );
  }

  const getDashboardStats = () => {
    switch (user?.role) {
      case 'super_admin':
        return [
          { label: 'Total Clubs', value: '5', change: '+2', icon: Trophy, color: 'text-emu-600' },
          { label: 'Active Members', value: '247', change: '+12%', icon: Users, color: 'text-green-600' },
          { label: 'Upcoming Events', value: '6', change: '+3', icon: Calendar, color: 'text-blue-600' },
          { label: 'Active Elections', value: '1', change: '0', icon: AlertCircle, color: 'text-orange-600' },
        ];
      case 'club_admin':
        return [
          { label: 'My Clubs', value: '3', change: '+1', icon: Trophy, color: 'text-emu-600' },
          { label: 'Total Members', value: '89', change: '+7', icon: Users, color: 'text-green-600' },
          { label: 'Events This Month', value: '5', change: '+2', icon: Calendar, color: 'text-blue-600' },
          { label: 'Pending Approvals', value: '3', change: '-1', icon: Clock, color: 'text-orange-600' },
        ];
      default:
        return [
          { label: 'My Clubs', value: studentDashboard.joinedClubs.length.toString(), change: '0', icon: Trophy, color: 'text-emu-600' },
          { label: 'Upcoming Events', value: studentDashboard.upcomingEvents.length.toString(), change: '+2', icon: Calendar, color: 'text-green-600' },
          { label: 'Available Clubs', value: studentDashboard.availableClubs.length.toString(), change: '0', icon: Users, color: 'text-blue-600' },
          { label: 'Unread Notifications', value: studentDashboard.notifications.filter(n => !n.isRead).length.toString(), change: '+1', icon: AlertCircle, color: 'text-orange-600' },
        ];
    }
  };

  const stats = getDashboardStats();

  const handleJoinClub = async (clubId: string) => {
    try {
      await joinClub({ clubId });
    } catch (error) {
      // Error is handled by toast in context
    }
  };

  const handleRegisterForEvent = async (eventId: string) => {
    try {
      await registerForEvent({ eventId });
    } catch (error) {
      // Error is handled by toast in context
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.firstName}!
          </h1>
          <p className="text-gray-600">
            {user?.role === 'member' 
              ? `You're a member of ${studentDashboard.joinedClubs.length} club${studentDashboard.joinedClubs.length !== 1 ? 's' : ''}`
              : 'Here\'s what\'s happening in your clubs'
            }
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Badge variant="success">
            <Activity className="w-3 h-3 mr-1" />
            Active
          </Badge>
          <p className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleString()}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card hover className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  <p className={`text-sm mt-1 ${
                    stat.change.startsWith('+') ? 'text-green-600' : 
                    stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'
                  }`}>
                    {stat.change !== '0' && `${stat.change} from last month`}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-gray-50">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Student-specific content */}
      {user?.role === 'member' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* My Clubs */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">My Clubs</h3>
              <Badge variant="info">
                {studentDashboard.joinedClubs.length}/3
              </Badge>
            </div>
            
            {studentDashboard.joinedClubs.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600 mb-4">You haven't joined any clubs yet</p>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Browse Clubs
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {studentDashboard.joinedClubs.map((club) => (
                  <div key={club.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl">{club.logo || '🏛️'}</div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{club.name}</h4>
                      <p className="text-sm text-gray-600">{club.memberIds.length} members</p>
                    </div>
                    <Badge variant="success" size="sm">Active</Badge>
                  </div>
                ))}
                
                {studentDashboard.canJoinMoreClubs && (
                  <div className="pt-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Join More Clubs
                    </Button>
                  </div>
                )}
              </div>
            )}
          </Card>

          {/* Upcoming Events */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Upcoming Events</h3>
              <Button variant="ghost" size="sm">
                View All
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            
            {studentDashboard.upcomingEvents.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No upcoming events</p>
              </div>
            ) : (
              <div className="space-y-3">
                {studentDashboard.upcomingEvents.slice(0, 3).map((event) => (
                  <div key={event.id} className="border-l-4 border-emu-500 pl-4 py-2">
                    <h4 className="font-medium text-gray-900">{event.title}</h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {format(event.startDate, 'MMM dd, yyyy')} at {format(event.startDate, 'HH:mm')}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">{event.location}</p>
                    <div className="flex items-center justify-between mt-2">
                      <Badge size="sm" variant="info">
                        {event.registeredAttendees.length}/{event.maxAttendees} registered
                      </Badge>
                      {!event.registeredAttendees.includes(user?.id || '') && (
                        <Button 
                          size="xs" 
                          onClick={() => handleRegisterForEvent(event.id)}
                          loading={eventLoading}
                        >
                          Register
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      )}

      {/* Available Clubs Section for Members */}
      {user?.role === 'member' && studentDashboard.canJoinMoreClubs && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Discover New Clubs</h3>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {studentDashboard.availableClubs.slice(0, 6).map((club) => (
              <motion.div
                key={club.id}
                whileHover={{ y: -2 }}
                className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <div className="text-2xl">{club.logo || '🏛️'}</div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 truncate">{club.name}</h4>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                      {club.description}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <Badge size="sm" variant="default">
                        {club.memberIds.length}/{club.maxMembers} members
                      </Badge>
                      <Button 
                        size="xs"
                        onClick={() => handleJoinClub(club.id)}
                        loading={joinLoading}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Join
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </Card>
      )}

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          {studentDashboard.recentActivity.length === 0 ? (
            <div className="text-center py-8">
              <Activity className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {studentDashboard.recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-emu-600 rounded-full" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">
                      {format(activity.timestamp, 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Notifications */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Recent Notifications</h3>
            <Button variant="ghost" size="sm">
              View All
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          {studentDashboard.notifications.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No notifications</p>
            </div>
          ) : (
            <div className="space-y-4">
              {studentDashboard.notifications.slice(0, 5).map((notification) => (
                <div 
                  key={notification.id} 
                  className={`p-3 rounded-lg border ${
                    notification.isRead ? 'bg-white border-gray-200' : 'bg-emu-50 border-emu-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {format(notification.createdAt, 'MMM dd, HH:mm')}
                      </p>
                    </div>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-emu-600 rounded-full ml-2 mt-2" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};