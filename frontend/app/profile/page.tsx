'use client';

import { useAuth } from '@/contexts/AuthContext';
import BottomNav from '@/components/BottomNav';
import { Settings, Camera, Edit3, MapPin, Calendar, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-bumble-gray-light flex items-center justify-center">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  const age = new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear();

  return (
    <div className="min-h-screen bg-bumble-gray-light pb-16">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-800">Profile</h1>
            <button className="p-2">
              <Settings className="w-6 h-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="relative h-64 bg-gradient-to-br from-bumble-yellow to-bumble-orange">
            <button className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm p-3 rounded-full">
              <Camera className="w-6 h-6 text-white" />
            </button>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-bumble-yellow">
                {user.firstName[0]}{user.lastName[0]}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {user.firstName} {user.lastName}, {age}
              </h2>
              <p className="text-gray-600">{user.email}</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Age</span>
                </div>
                <span className="text-gray-600">{age} years old</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Location</span>
                </div>
                <span className="text-gray-600">{user.location || 'Not set'}</span>
              </div>

              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center gap-3">
                  <Edit3 className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-700">Bio</span>
                </div>
                <span className="text-gray-600 text-right max-w-[200px]">
                  {user.bio || 'Add a bio'}
                </span>
              </div>
            </div>

            <button className="w-full mt-6 bg-bumble-yellow hover:bg-bumble-yellow-dark text-white font-bold py-3 rounded-full transition-colors">
              Edit Profile
            </button>

            <button
              onClick={logout}
              className="w-full mt-3 flex items-center justify-center gap-2 text-red-500 font-semibold py-3"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}