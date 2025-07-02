import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Vote, 
  Users, 
  Clock, 
  CheckCircle, 
  ArrowLeft,
  Trophy,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { useClub } from '../contexts/ClubContext';
import { useAuth } from '../contexts/AuthContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { getElectionById, getClubById } from '../data/mockData';
import { ElectionVote } from '../types';
import { format, isAfter, isBefore } from 'date-fns';
import toast from 'react-hot-toast';

export const ElectionDetailsPage: React.FC = () => {
  const { electionId } = useParams<{ electionId: string }>();
  const { user } = useAuth();
  const { voteInElection, voteLoading } = useClub();
  const [selectedVotes, setSelectedVotes] = useState<Record<string, string>>({});

  if (!electionId) {
    return <div>Election not found</div>;
  }

  const election = getElectionById(electionId);
  const club = election ? getClubById(election.clubId) : null;

  if (!election || !club) {
    return <div>Election not found</div>;
  }

  const userClubIds = user?.joinedClubs || [];
  const isMember = userClubIds.includes(election.clubId);
  const hasVoted = election.voterIds.includes(user?.id || '');
  const now = new Date();
  const isActive = election.isActive && isAfter(election.endDate, now) && !isBefore(now, election.startDate);
  const canVote = isMember && isActive && !hasVoted;

  const handleVoteSelection = (positionId: string, candidateId: string) => {
    setSelectedVotes(prev => ({
      ...prev,
      [positionId]: candidateId
    }));
  };

  const handleSubmitVotes = async () => {
    const votes = Object.entries(selectedVotes).map(([positionId, candidateId]) => ({
      positionId,
      candidateId
    }));

    if (votes.length !== election.positions.length) {
      toast.error('Please vote for all positions');
      return;
    }

    try {
      const voteData: ElectionVote = {
        electionId: election.id,
        votes
      };
      
      await voteInElection(voteData);
      setSelectedVotes({});
    } catch (error) {
      // Error handled by toast in context
    }
  };

  const getElectionStatus = () => {
    if (hasVoted) return 'voted';
    if (!election.isActive || isBefore(election.endDate, now)) return 'completed';
    if (isBefore(now, election.startDate)) return 'upcoming';
    return 'active';
  };

  const status = getElectionStatus();

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Elections
      </Button>

      {/* Election Header */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-900">{election.title}</h1>
              {status === 'voted' && (
                <Badge variant="success">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Voted
                </Badge>
              )}
              {status === 'active' && (
                <Badge variant="info">
                  <Vote className="w-3 h-3 mr-1" />
                  Active
                </Badge>
              )}
              {status === 'completed' && (
                <Badge variant="default">Completed</Badge>
              )}
            </div>
            
            <p className="text-emu-600 font-medium mb-2">{club.name}</p>
            <p className="text-gray-600 mb-4">{election.description}</p>
            
            {/* Election Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-900">{election.positions.length}</div>
                <div className="text-gray-500">Positions</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">{election.voterIds.length}</div>
                <div className="text-gray-500">Voters</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {Math.round((election.voterIds.length / club.memberIds.length) * 100)}%
                </div>
                <div className="text-gray-500">Participation</div>
              </div>
              <div>
                <div className="font-medium text-gray-900">
                  {election.positions.reduce((total, pos) => total + pos.totalVotes, 0)}
                </div>
                <div className="text-gray-500">Total Votes</div>
              </div>
            </div>
          </div>

          {/* Election Timeline */}
          <div className="bg-gray-50 rounded-lg p-4 min-w-0 lg:min-w-[250px]">
            <h3 className="font-medium text-gray-900 mb-3">Voting Period</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-600">
                  {format(election.startDate, 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
              <div className="text-center text-gray-400">to</div>
              <div className="flex items-center">
                <Clock className="w-4 h-4 mr-2 text-gray-400" />
                <span className="text-gray-600">
                  {format(election.endDate, 'MMM dd, yyyy HH:mm')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Voting Status Alert */}
      {!isMember && (
        <Card className="p-4 bg-orange-50 border-orange-200">
          <div className="flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            <div>
              <h3 className="font-medium text-orange-900">Members Only</h3>
              <p className="text-orange-700 text-sm">
                You must be a member of {club.name} to participate in this election.
              </p>
            </div>
          </div>
        </Card>
      )}

      {hasVoted && (
        <Card className="p-4 bg-green-50 border-green-200">
          <div className="flex items-center space-x-3">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <div>
              <h3 className="font-medium text-green-900">Vote Recorded</h3>
              <p className="text-green-700 text-sm">
                Your vote has been successfully recorded. Thank you for participating!
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Positions and Candidates */}
      <div className="space-y-6">
        {election.positions.map((position, index) => (
          <motion.div
            key={position.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Trophy className="w-5 h-5 text-emu-600" />
                <h2 className="text-lg font-semibold text-gray-900">{position.title}</h2>
                <Badge variant="info" size="sm">
                  {position.candidates.length} candidate{position.candidates.length !== 1 ? 's' : ''}
                </Badge>
              </div>
              
              <p className="text-gray-600 mb-6">{position.description}</p>
              
              {/* Candidates */}
              <div className="space-y-4">
                {position.candidates.map((candidate) => (
                  <div
                    key={candidate.id}
                    className={`border rounded-lg p-4 transition-all duration-200 ${
                      canVote
                        ? selectedVotes[position.id] === candidate.id
                          ? 'border-emu-500 bg-emu-50'
                          : 'border-gray-200 hover:border-gray-300 cursor-pointer'
                        : 'border-gray-200'
                    }`}
                    onClick={() => canVote && handleVoteSelection(position.id, candidate.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <Users className="w-5 h-5 text-gray-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">Candidate {candidate.id}</h3>
                            <p className="text-sm text-gray-500">Running for {position.title}</p>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 text-sm">{candidate.statement}</p>
                        
                        {status === 'completed' && (
                          <div className="mt-3 flex items-center space-x-2">
                            <Badge variant="info" size="sm">
                              {candidate.votes} vote{candidate.votes !== 1 ? 's' : ''}
                            </Badge>
                            {position.totalVotes > 0 && (
                              <span className="text-sm text-gray-500">
                                ({Math.round((candidate.votes / position.totalVotes) * 100)}%)
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                      
                      {canVote && (
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          selectedVotes[position.id] === candidate.id
                            ? 'border-emu-500 bg-emu-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedVotes[position.id] === candidate.id && (
                            <CheckCircle className="w-3 h-3 text-white" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Vote Submission */}
      {canVote && (
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">Ready to submit your vote?</h3>
              <p className="text-sm text-gray-600">
                You have selected {Object.keys(selectedVotes).length} of {election.positions.length} positions.
              </p>
            </div>
            <Button
              onClick={handleSubmitVotes}
              loading={voteLoading}
              disabled={Object.keys(selectedVotes).length !== election.positions.length}
            >
              <Vote className="w-4 h-4 mr-2" />
              Submit Vote
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};