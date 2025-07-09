'use client';

import { useAuth } from '@/contexts/AuthContext';
import BottomNav from '@/components/BottomNav';
import { MessageCircle, Clock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function MessagesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-bumble-gray-light flex items-center justify-center">
        <p className="text-gray-600">Loading messages...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bumble-gray-light pb-16">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center text-gray-800">Messages</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageCircle className="w-24 h-24 text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No messages yet
          </h3>
          <p className="text-gray-500 mb-4">
            Start swiping to make matches and chat!
          </p>
          {user.gender === 'FEMALE' && (
            <div className="bg-bumble-yellow/10 p-4 rounded-lg max-w-md">
              <p className="text-sm text-bumble-yellow-dark">
                💪 You make the first move! Message your matches to start the conversation.
              </p>
            </div>
          )}
          {user.gender === 'MALE' && (
            <div className="bg-blue-50 p-4 rounded-lg max-w-md">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <Clock size={16} />
                <span className="text-sm font-semibold">How messaging works</span>
              </div>
              <p className="text-sm text-blue-600">
                After you match, she has 24 hours to send the first message. Then you can reply!
              </p>
            </div>
          )}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}