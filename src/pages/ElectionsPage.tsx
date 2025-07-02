import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Vote, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle,
  Calendar,
  Trophy,
  Search
} from 'lucide-react';
import { useClub } from '../contexts/ClubContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
import { Election } from '../types';
import { format, isAfter, isBefore } from 'date-fns';

type ElectionFilter = 'all' | 'active' | 'my_clubs' | 'voted' | 'completed';

const ELECTION_FILTERS: { value: ElectionFilter; label: string }[] = [
  { value: 'all', label: 'All Elections' },
  { value: 'active', label: 'Active' },
  { value: 'my_clubs', label: 'My Clubs' },
  { value: 'voted', label: 'Voted' },
  { value: 'completed', label: 'Completed' },
];

export const ElectionsPage: React.FC = () => {
  const { user } = useAuth();
  const { elections, clubs, voteInElection, voteLoading } = useClub();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<ElectionFilter>('all');

  const userClubIds = user?.joinedClubs || [];
  const now = new Date();

  const filteredElections = elections.filter(election => {
    const matchesSearch = election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         election.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesFilter = true;
    switch (selectedFilter) {
      case 'active':
        matchesFilter = election.isActive && isAfter(election.endDate, now);
        break;
      case 'my_clubs':
        matchesFilter = userClubIds.includes(election.clubId);
        break;
      case 'voted':
        matchesFilter = election.voterIds.includes(user?.id || '');
        break;
      case 'completed':
        matchesFilter = !election.isActive || isBefore(election.endDate, now);
        break;
    }
    
    return matchesSearch && matchesFilter;
  }).sort((a, b) => {
    // Sort by active status first, then by end date
    if (a.isActive && !b.isActive) return -1;
    if (!a.isActive && b.isActive) return 1;
    return a.endDate.getTime() - b.endDate.getTime();
  });

  const getClubName = (clubId: string) => {
    const club = clubs.find(c => c.id === clubId);
    return club?.name || 'Unknown Club';
  };

  const getElectionStatus = (election: Election) => {
    const userId = user?.id || '';
    
    if (election.voterIds.includes(userId)) {
      return 'voted';
    }
    if (!election.isActive || isBefore(election.endDate, now)) {
      return 'completed';
    }
    if (!userClubIds.includes(election.clubId)) {
      return 'restricted';
    }
    if (isBefore(now, election.startDate)) {
      return 'upcoming';
    }
    return 'active';
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'voted':
        return <Badge variant="success" size="sm"><CheckCircle className="w-3 h-3 mr-1" />Voted</Badge>;
      case 'active':
        return <Badge variant="info" size="sm"><Vote className="w-3 h-3 mr-1" />Active</Badge>;
      case 'upcoming':
        return <Badge variant="warning" size="sm"><Clock className="w-3 h-3 mr-1" />Upcoming</Badge>;
      case 'completed':
        return <Badge variant="default" size="sm">Completed</Badge>;
      case 'restricted':
        return <Badge variant="warning" size="sm"><AlertCircle className="w-3 h-3 mr-1" />Members Only</Badge>;
      default:
        return <Badge variant="default" size="sm">Unknown</Badge>;
    }
  };

  const getActionButton = (election: Election, status: string) => {
    switch (status) {
      case 'active':
        return (
          <Button size="sm">
            <Vote className="w-4 h-4 mr-1" />
            Vote Now
          </Button>
        );
      case 'voted':
        return (
          <Button variant="outline" size="sm" disabled>
            <CheckCircle className="w-4 h-4 mr-1" />
            Vote Cast
          </Button>
        );
      case 'completed':
        return (
          <Button variant="ghost" size="sm">
            <Trophy className="w-4 h-4 mr-1" />
            View Results
          </Button>
        );
      default:
        return (
          <Button size="sm" disabled>
            {status === 'upcoming' ? 'Not Started' : 'Unavailable'}
          </Button>
        );
    }
  };

  const getTotalVotes = (election: Election) => {
    return election.positions.reduce((total, position) => total + position.totalVotes, 0);
  };

  const getParticipationRate = (election: Election) => {
    const club = clubs.find(c => c.id === election.clubId);
    if (!club) return 0;
    
    const eligibleVoters = club.memberIds.length;
    const actualVoters = election.voterIds.length;
    
    return eligibleVoters > 0 ? Math.round((actualVoters / eligibleVoters) * 100) : 0;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Elections</h1>
          <p className="text-gray-600">
            Participate in club elections and make your voice heard
          </p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder="Search elections by title or description..."
              icon={<Search className="w-4 h-4" />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex flex-wrap gap-2">
            {ELECTION_FILTERS.map((filter) => (
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

      {/* Elections List */}
      {filteredElections.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="text-6xl mb-4">🗳️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No elections found</h3>
          <p className="text-gray-600">
            {selectedFilter === 'my_clubs' 
              ? "No elections in your clubs. Elections will appear here when clubs organize them."
              : selectedFilter === 'active'
              ? "No active elections at the moment."
              : "Try adjusting your search or filter criteria."
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredElections.map((election, index) => {
            const status = getElectionStatus(election);
            const clubName = getClubName(election.clubId);
            const totalVotes = getTotalVotes(election);
            const participationRate = getParticipationRate(election);
            
            return (
              <motion.div
                key={election.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card hover className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    {/* Election Info */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 mb-1">
                            {election.title}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-600">
                            <span className="font-medium text-emu-600">{clubName}</span>
                            {getStatusBadge(status)}
                          </div>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 text-sm mb-3">
                        {election.description}
                      </p>
                      
                      {/* Election Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          <div>
                            <div className="font-medium">Voting Period</div>
                            <div>{format(election.startDate, 'MMM dd')} - {format(election.endDate, 'MMM dd')}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-500">
                          <Trophy className="w-4 h-4 mr-2" />
                          <div>
                            <div className="font-medium">Positions</div>
                            <div>{election.positions.length} position{election.positions.length !== 1 ? 's' : ''}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-500">
                          <Users className="w-4 h-4 mr-2" />
                          <div>
                            <div className="font-medium">Participation</div>
                            <div>{election.voterIds.length} voters ({participationRate}%)</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center text-gray-500">
                          <Vote className="w-4 h-4 mr-2" />
                          <div>
                            <div className="font-medium">Total Votes</div>
                            <div>{totalVotes} vote{totalVotes !== 1 ? 's' : ''}</div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Positions Preview */}
                      <div className="mt-4">
                        <div className="text-sm font-medium text-gray-700 mb-2">Positions:</div>
                        <div className="flex flex-wrap gap-2">
                          {election.positions.map((position) => (
                            <Badge key={position.id} size="sm" variant="default">
                              {position.title} ({position.candidates.length} candidate{position.candidates.length !== 1 ? 's' : ''})
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end space-y-2">
                      {getActionButton(election, status)}
                      
                      {status === 'active' && (
                        <div className="text-xs text-gray-500 text-right">
                          Ends {format(election.endDate, 'MMM dd, HH:mm')}
                        </div>
                      )}
                      
                      {status === 'completed' && election.results && (
                        <div className="text-xs text-green-600 text-right">
                          Results available
                        </div>
                      )}
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