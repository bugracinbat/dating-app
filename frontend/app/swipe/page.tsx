'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import SwipeCard from '@/components/SwipeCard';
import BottomNav from '@/components/BottomNav';
import { User } from '@/types';
import api from '@/lib/api';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SwipePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [potentialMatches, setPotentialMatches] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchPotentialMatches();
  }, []);

  const fetchPotentialMatches = async () => {
    try {
      // For now, we'll use mock data since the backend endpoint isn't implemented yet
      const mockUsers: User[] = [
        {
          id: '1',
          email: 'sarah@example.com',
          firstName: 'Sarah',
          lastName: 'Johnson',
          dateOfBirth: '1995-03-15',
          gender: 'FEMALE',
          bio: 'Love hiking, coffee, and good conversations',
          location: 'San Francisco, CA',
          interests: ['Hiking', 'Coffee', 'Travel'],
          photos: [],
        },
        {
          id: '2',
          email: 'emily@example.com',
          firstName: 'Emily',
          lastName: 'Davis',
          dateOfBirth: '1998-07-22',
          gender: 'FEMALE',
          bio: 'Yoga instructor | Dog lover | Foodie',
          location: 'Los Angeles, CA',
          interests: ['Yoga', 'Dogs', 'Food'],
          photos: [],
        },
        {
          id: '3',
          email: 'jessica@example.com',
          firstName: 'Jessica',
          lastName: 'Wilson',
          dateOfBirth: '1996-11-08',
          gender: 'FEMALE',
          bio: 'Artist and dreamer. Looking for someone who appreciates creativity',
          location: 'New York, NY',
          interests: ['Art', 'Music', 'Photography'],
          photos: [],
        },
      ];
      
      setPotentialMatches(mockUsers);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching matches:', error);
      setIsLoading(false);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right' | 'super') => {
    if (!potentialMatches[currentIndex]) return;

    try {
      if (direction === 'right' || direction === 'super') {
        // In a real app, we'd send this to the backend
        console.log(`Liked ${potentialMatches[currentIndex].firstName}${direction === 'super' ? ' with super like!' : ''}`);
      }
      
      setCurrentIndex(prev => prev + 1);
    } catch (error) {
      console.error('Error handling swipe:', error);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-bumble-gray-light flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-16 h-16 text-bumble-yellow animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading potential matches...</p>
        </div>
      </div>
    );
  }

  const currentMatch = potentialMatches[currentIndex];

  return (
    <div className="min-h-screen bg-bumble-gray-light pb-16">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-center">
            <Heart className="w-8 h-8 text-bumble-yellow fill-bumble-yellow mr-2" />
            <span className="text-2xl font-bold text-gray-800">Bumble</span>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-md">
        <div className="relative h-[600px]">
          {currentMatch ? (
            <SwipeCard
              key={currentMatch.id}
              user={currentMatch}
              onSwipe={handleSwipe}
            />
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Heart className="w-24 h-24 text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No more profiles
              </h3>
              <p className="text-gray-500">
                Check back later for more matches!
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}