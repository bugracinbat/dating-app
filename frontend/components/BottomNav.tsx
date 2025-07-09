'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Home, Heart, MessageCircle, User } from 'lucide-react';

const navItems = [
  { path: '/swipe', icon: Home, label: 'Swipe' },
  { path: '/matches', icon: Heart, label: 'Matches' },
  { path: '/messages', icon: MessageCircle, label: 'Messages' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => router.push(item.path)}
              className={`flex flex-col items-center justify-center w-full h-full ${
                isActive ? 'text-bumble-yellow' : 'text-gray-500'
              }`}
            >
              <Icon size={24} className={isActive ? 'fill-current' : ''} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}