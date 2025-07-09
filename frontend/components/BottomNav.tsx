'use client';

import { useRouter, usePathname } from 'next/navigation';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import { Home, Favorite, Chat, Person } from '@mui/icons-material';

const navItems = [
  { path: '/swipe', icon: Home, label: 'Discover' },
  { path: '/matches', icon: Favorite, label: 'Matches' },
  { path: '/messages', icon: Chat, label: 'Messages' },
  { path: '/profile', icon: Person, label: 'Profile' },
];

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const currentIndex = navItems.findIndex(item => item.path === pathname);

  return (
    <Paper 
      sx={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0,
        zIndex: 1000
      }} 
      elevation={3}
    >
      <BottomNavigation
        value={currentIndex}
        onChange={(event, newValue) => {
          router.push(navItems[newValue].path);
        }}
        showLabels
      >
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <BottomNavigationAction
              key={item.path}
              label={item.label}
              icon={<Icon />}
            />
          );
        })}
      </BottomNavigation>
    </Paper>
  );
}