'use client';

import { motion, useMotionValue, useTransform } from 'framer-motion';
import { User } from '@/types';
import Image from 'next/image';
import {
  Card,
  CardContent,
  Typography,
  Box,
  IconButton,
  Chip,
  Avatar,
  useTheme,
  Stack
} from '@mui/material';
import {
  Favorite,
  Close,
  Star,
  LocationOn,
  FiberManualRecord
} from '@mui/icons-material';

interface SwipeCardProps {
  user: User;
  onSwipe: (direction: 'left' | 'right' | 'super') => void;
}

export default function SwipeCard({ user, onSwipe }: SwipeCardProps) {
  const theme = useTheme();
  const motionValue = useMotionValue(0);
  const rotateValue = useTransform(motionValue, [-200, 200], [-15, 15]);
  const opacityValue = useTransform(motionValue, [-200, -100, 0, 100, 200], [0.6, 1, 1, 1, 0.6]);
  const scaleValue = useTransform(motionValue, [-200, -100, 0, 100, 200], [0.95, 1, 1, 1, 0.95]);

  const primaryPhoto = user.photos?.find(p => p.isPrimary) || user.photos?.[0];
  const age = new Date().getFullYear() - new Date(user.dateOfBirth).getFullYear();

  return (
    <motion.div
      style={{
        position: 'absolute',
        width: '100%',
        height: '100%',
        cursor: 'grab',
        x: motionValue,
        rotate: rotateValue,
        opacity: opacityValue,
        scale: scaleValue
      }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98, cursor: 'grabbing' }}
      onDragEnd={(e, { offset, velocity }) => {
        if (Math.abs(velocity.x) >= 500) {
          onSwipe(velocity.x > 0 ? 'right' : 'left');
        } else if (Math.abs(offset.x) >= 100) {
          onSwipe(offset.x > 0 ? 'right' : 'left');
        }
      }}
    >
      <Card
        sx={{
          height: '100%',
          borderRadius: 4,
          overflow: 'hidden',
          position: 'relative',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 12px 48px rgba(0, 0, 0, 0.15)',
          }
        }}
      >
        {primaryPhoto ? (
          <Box
            sx={{
              position: 'relative',
              height: '75%',
              overflow: 'hidden'
            }}
          >
            <Image
              src={primaryPhoto.url}
              alt={`${user.name}`}
              fill
              style={{ objectFit: 'cover' }}
            />
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, transparent 0%, transparent 60%, rgba(0,0,0,0.7) 100%)'
              }}
            />
            
            {/* Online status indicator */}
            <Box
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                borderRadius: 20,
                px: 2,
                py: 0.5,
                backdropFilter: 'blur(10px)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <FiberManualRecord sx={{ fontSize: 8, color: '#4caf50' }} />
                <Typography variant="caption" sx={{ fontWeight: 500 }}>
                  Online
                </Typography>
              </Box>
            </Box>
          </Box>
        ) : (
          <Box
            sx={{
              height: '75%',
              background: theme.custom.gradients.primary,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Avatar
              sx={{
                width: 120,
                height: 120,
                fontSize: '3rem',
                fontWeight: 'bold',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                color: 'white',
                zIndex: 2
              }}
            >
              {user.name[0]}
            </Avatar>
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 200,
                height: 200,
                borderRadius: '50%',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                filter: 'blur(20px)'
              }}
            />
          </Box>
        )}

        <CardContent
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            color: 'white',
            background: primaryPhoto ? 'transparent' : 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(10px)',
            p: 3
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
              {user.name}, {age}
            </Typography>
            
            {user.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <LocationOn sx={{ fontSize: 16, color: theme.palette.primary.main }} />
                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                  {user.location}
                </Typography>
              </Box>
            )}
            
            {user.bio && (
              <Typography
                variant="body2"
                sx={{
                  opacity: 0.9,
                  mb: 2,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.4
                }}
              >
                {user.bio}
              </Typography>
            )}
            
            {user.interests && user.interests.length > 0 && (
              <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
                {user.interests.slice(0, 3).map((interest, index) => (
                  <Chip
                    key={index}
                    label={interest}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      border: '1px solid rgba(255, 255, 255, 0.3)',
                      fontSize: '0.75rem'
                    }}
                  />
                ))}
              </Stack>
            )}
          </motion.div>
        </CardContent>

        {/* Action buttons */}
        <Box
          sx={{
            position: 'absolute',
            bottom: 120,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: 2,
            zIndex: 10
          }}
        >
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onSwipe('left');
              }}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                width: 56,
                height: 56,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  boxShadow: '0 4px 20px rgba(244, 67, 54, 0.3)'
                }
              }}
            >
              <Close sx={{ color: '#f44336', fontSize: 28 }} />
            </IconButton>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onSwipe('super');
              }}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                width: 56,
                height: 56,
                position: 'relative',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  boxShadow: '0 4px 20px rgba(33, 150, 243, 0.3)'
                }
              }}
            >
              <Star sx={{ color: '#2196f3', fontSize: 28 }} />
            </IconButton>
          </motion.div>

          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                onSwipe('right');
              }}
              sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                backdropFilter: 'blur(10px)',
                width: 56,
                height: 56,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 1)',
                  boxShadow: '0 4px 20px rgba(76, 175, 80, 0.3)'
                }
              }}
            >
              <Favorite sx={{ color: '#4caf50', fontSize: 28 }} />
            </IconButton>
          </motion.div>
        </Box>

        {/* Swipe indicators */}
        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            left: 32,
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(244, 67, 54, 0.9)',
            color: 'white',
            padding: '8px 24px',
            borderRadius: 8,
            fontWeight: 'bold',
            fontSize: '1.5rem',
            opacity: useTransform(motionValue, [-100, -50, 0], [1, 0.5, 0]),
            scale: useTransform(motionValue, [-100, -50, 0], [1, 0.8, 0.5])
          }}
        >
          NOPE
        </motion.div>

        <motion.div
          style={{
            position: 'absolute',
            top: '50%',
            right: 32,
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(76, 175, 80, 0.9)',
            color: 'white',
            padding: '8px 24px',
            borderRadius: 8,
            fontWeight: 'bold',
            fontSize: '1.5rem',
            opacity: useTransform(motionValue, [0, 50, 100], [0, 0.5, 1]),
            scale: useTransform(motionValue, [0, 50, 100], [0.5, 0.8, 1])
          }}
        >
          LIKE
        </motion.div>
      </Card>
    </motion.div>
  );
}