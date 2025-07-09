'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import BottomNav from '@/components/BottomNav';
import { Match } from '@/types';
import { Heart, MessageCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function MatchesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    try {
      // Mock data for demonstration
      const mockMatches: Match[] = [
        {
          id: '1',
          user1Id: user?.id || '',
          user2Id: '2',
          user1: user!,
          user2: {
            id: '2',
            email: 'sarah@example.com',
            firstName: 'Sarah',
            lastName: 'Johnson',
            dateOfBirth: '1995-03-15',
            gender: 'FEMALE',
            bio: 'Love hiking and coffee',
            location: 'San Francisco, CA',
            interests: ['Hiking', 'Coffee'],
            photos: [],
          },
          canUser1Message: true,
          canUser2Message: user?.gender === 'FEMALE',
          createdAt: new Date().toISOString(),
        },
      ];
      
      setMatches(mockMatches);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setIsLoading(false);
    }
  };

  const getMatchedUser = (match: Match) => {
    return match.user1Id === user?.id ? match.user2 : match.user1;
  };

  const canMessage = (match: Match) => {
    if (user?.gender === 'FEMALE') {
      return true;
    }
    return match.user1Id === user?.id ? match.canUser1Message : match.canUser2Message;
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-bumble-gray-light flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-bumble-yellow animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading matches...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bumble-gray-light pb-16">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center text-gray-800">Matches</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        {matches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Heart className="w-24 h-24 text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No matches yet
            </h3>
            <p className="text-gray-500">
              Keep swiping to find your perfect match!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {matches.map((match) => {
              const matchedUser = getMatchedUser(match);
              const canSendMessage = canMessage(match);
              
              return (
                <div
                  key={match.id}
                  onClick={() => canSendMessage && router.push(`/messages/${match.id}`)}
                  className={`bg-white rounded-xl overflow-hidden shadow-sm ${
                    canSendMessage ? 'cursor-pointer hover:shadow-md' : 'opacity-75'
                  } transition-all`}
                >
                  <div className="aspect-[3/4] relative bg-gradient-to-br from-bumble-yellow to-bumble-orange">
                    <div className="absolute inset-0 flex items-center justify-center text-white text-4xl font-bold">
                      {matchedUser.firstName[0]}
                    </div>
                  </div>
                  
                  <div className="p-3">
                    <h3 className="font-semibold text-gray-800">
                      {matchedUser.firstName}
                    </h3>
                    
                    {!canSendMessage && user?.gender === 'MALE' && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                        <Clock size={12} />
                        <span>Waiting for her to message first</span>
                      </div>
                    )}
                    
                    {canSendMessage && (
                      <div className="flex items-center gap-1 mt-2 text-xs text-bumble-yellow">
                        <MessageCircle size={12} />
                        <span>Send a message</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}