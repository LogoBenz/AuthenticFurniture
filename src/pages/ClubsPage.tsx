import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Search, 
  Filter, 
  Users, 
  Calendar, 
  MapPin, 
  Plus,
  Star,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { useClub } from '../contexts/ClubContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Club, ClubCategory } from '../types';
import { format } from 'date-fns';

const CATEGORY_FILTERS: { value: ClubCategory | 'all'; label: string; icon: string }[] = [
  { value: 'all', label: 'All Clubs', icon: '🏛️' },
  { value: 'academic', label: 'Academic', icon: '📚' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'cultural', label: 'Cultural', icon: '🎭' },
  { value: 'technology', label: 'Technology', icon: '💻' },
  { value: 'arts', label: 'Arts', icon: '🎨' },
  { value: 'entertainment', label: 'Entertainment', icon: '🎌' },
  { value: 'martial_arts', label: 'Martial Arts', icon: '🥊' },
  { value: 'other', label: 'Other', icon: '🔮' },
];

export const ClubsPage: React.FC = () => {
  const { user } = useAuth();
  const { clubs, studentDashboard, joinClub, leaveClub, joinLoading } = useClub();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ClubCategory | 'all'>('all');
  const [showMyClubs, setShowMyClubs] = useState(false);

  const userClubIds = user?.joinedClubs || [];
  const canJoinMoreClubs = userClubIds.length < 3;

  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         club.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || club.category === selectedCategory;
    const matchesFilter = showMyClubs ? userClubIds.includes(club.id) : true;
    
    return matchesSearch && matchesCategory && matchesFilter && club.status === 'approved';
  });

  const handleJoinClub = async (clubId: string) => {
    try {
      await joinClub({ clubId });
    } catch (error) {
      // Error handled by toast in context
    }
  };

  const handleLeaveClub = async (clubId: string) => {
    try {
      await leaveClub(clubId);
    } catch (error) {
      // Error handled by toast in context
    }
  };

  const getClubStatus = (club: Club) => {
    if (userClubIds.includes(club.id)) {
      return 'joined';
    }
    if (club.memberIds.length >= club.maxMembers) {
      return 'full';
    }
    if (!canJoinMoreClubs) {
      return 'limit_reached';
    }
    return 'available';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'joined':
        return <Badge variant="success" size="sm"><CheckCircle className="w-3 h-3 mr-1" />Joined</Badge>;
      case 'full':
        return <Badge variant="danger" size="sm"><XCircle className="w-3 h-3 mr-1" />Full</Badge>;
      case 'limit_reached':
        return <Badge variant="warning" size="sm">Limit Reached</Badge>;
      default:
        return <Badge variant="info" size="sm">Available</Badge>;
    }
  };

  const getActionButton = (club: Club, status: string) => {
    switch (status) {
      case 'joined':
        return (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => handleLeaveClub(club.id)}
            loading={joinLoading}
          >
            Leave Club
          </Button>
        );
      case 'available':
        return (
          <Button 
            size="sm"
            onClick={() => handleJoinClub(club.id)}
            loading={joinLoading}
          >
            <Plus className="w-4 h-4 mr-1" />
            Join Club
          </Button>
        );
      default:
        return (
          <Button size="sm" disabled>
            {status === 'full' ? 'Club Full' : 'Cannot Join'}
          </Button>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clubs</h1>
          <p className="text-gray-600">
            Discover and join clubs that match your interests
            {user?.role === 'member' && (
              <span className="ml-2">
                ({userClubIds.length}/3 clubs joined)
              </span>
            )}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button
            variant={showMyClubs ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setShowMyClubs(!showMyClubs)}
          >
            <Star className="w-4 h-4 mr-2" />
            My Clubs
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search clubs by name or description..."
              icon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {CATEGORY_FILTERS.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setSelectedCategory(filter.value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === filter.value
                    ? 'bg-emu-100 text-emu-700 border border-emu-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{filter.icon}</span>
                <span>{filter.label}</span>
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Clubs Grid */}
      {filteredClubs.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No clubs found</h3>
          <p className="text-gray-600">
            {showMyClubs 
              ? "You haven't joined any clubs yet. Browse available clubs below!"
              : "Try adjusting your search or filter criteria."
            }
          </p>
          {showMyClubs && (
            <Button 
              className="mt-4"
              onClick={() => setShowMyClubs(false)}
            >
              Browse All Clubs
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClubs.map((club, index) => {
            const status = getClubStatus(club);
            
            return (
              <motion.div
                key={club.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card hover className="h-full">
                  {/* Club Banner */}
                  <div className="relative h-48 bg-gradient-to-br from-emu-500 to-emu-600 rounded-t-xl overflow-hidden">
                    {club.bannerImage ? (
                      <img 
                        src={club.bannerImage} 
                        alt={club.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-6xl">{club.logo || '🏛️'}</div>
                      </div>
                    )}
                    <div className="absolute top-4 right-4">
                      {getStatusBadge(status)}
                    </div>
                  </div>

                  {/* Club Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {club.name}
                        </h3>
                        <Badge size="sm" variant="default">
                          {CATEGORY_FILTERS.find(f => f.value === club.category)?.label || club.category}
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                      {club.description}
                    </p>

                    {/* Club Stats */}
                    <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          <span>{club.memberIds.length}/{club.maxMembers}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          <span>{club.stats.upcomingEvents} events</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        <span>Founded {format(club.foundedDate, 'yyyy')}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      {getActionButton(club, status)}
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

      {/* Join Limit Warning */}
      {user?.role === 'member' && !canJoinMoreClubs && (
        <Card className="p-6 bg-orange-50 border-orange-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-orange-100 rounded-lg">
              <Star className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-orange-900">Club Limit Reached</h3>
              <p className="text-orange-700 text-sm">
                You've joined the maximum of 3 clubs. Leave a club to join a new one.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};