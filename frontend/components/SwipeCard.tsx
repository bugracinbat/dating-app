'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { User } from '@/types';
import { Heart, X, Star, MapPin } from 'lucide-react';
import Image from 'next/image';

interface SwipeCardProps {
  user: User;
  onSwipe: (direction: 'left' | 'right' | 'super') => void;
}

export default function SwipeCard({ user, onSwipe }: SwipeCardProps) {
  const motionValue = useMotionValue(0);
  const rotateValue = useTransform(motionValue, [-200, 200], [-25, 25]);
  const opacityValue = useTransform(motionValue, [-200, -100, 0, 100, 200], [0.5, 1, 1, 1, 0.5]);

  const primaryPhoto = user.photos?.find(p => p.isPrimary) || user.photos?.[0];
  const age = new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear();

  return (
    <motion.div
      className="absolute w-full h-full cursor-grab active:cursor-grabbing"
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      style={{ x: motionValue, rotate: rotateValue, opacity: opacityValue }}
      onDragEnd={(e, { offset, velocity }) => {
        if (Math.abs(velocity.x) >= 500) {
          onSwipe(velocity.x > 0 ? 'right' : 'left');
        } else if (Math.abs(offset.x) >= 100) {
          onSwipe(offset.x > 0 ? 'right' : 'left');
        }
      }}
    >
      <div className="relative h-full bg-white rounded-2xl shadow-xl overflow-hidden">
        {primaryPhoto ? (
          <div className="relative h-3/4">
            <Image
              src={primaryPhoto.url}
              alt={`${user.firstName} ${user.lastName}`}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        ) : (
          <div className="h-3/4 bg-gradient-to-br from-bumble-yellow to-bumble-orange flex items-center justify-center">
            <div className="text-white text-6xl font-bold">
              {user.firstName[0]}{user.lastName[0]}
            </div>
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2 className="text-3xl font-bold mb-2">
            {user.firstName}, {age}
          </h2>
          {user.location && (
            <div className="flex items-center gap-2 mb-3">
              <MapPin size={16} />
              <span className="text-sm">{user.location}</span>
            </div>
          )}
          {user.bio && (
            <p className="text-sm opacity-90 line-clamp-2">{user.bio}</p>
          )}
        </div>

        <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwipe('left');
            }}
            className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <X className="w-8 h-8 text-red-500" />
          </button>
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwipe('super');
            }}
            className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Star className="w-8 h-8 text-blue-500 fill-blue-500" />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onSwipe('right');
            }}
            className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Heart className="w-8 h-8 text-green-500 fill-green-500" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}