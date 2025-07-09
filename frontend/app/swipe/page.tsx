'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Card,
  CardContent,
  Stack,
  Chip,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  ArrowBack,
  Tune,
  Star,
  Favorite,
  Close,
  Refresh
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import SwipeCard from '@/components/SwipeCard';
import PremiumModal from '@/components/PremiumModal';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext';

interface User {
  id: string;
  name: string;
  dateOfBirth: string;
  bio?: string;
  location?: string;
  interests?: string[];
  photos: Array<{
    id: string;
    url: string;
    isPrimary: boolean;
  }>;
}

export default function SwipePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [discoveryQueue, setDiscoveryQueue] = useState<User[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);
  const [premiumFeature, setPremiumFeature] = useState<'general' | 'super_likes' | 'see_likes' | 'filters'>('general');
  const [subscriptionStatus, setSubscriptionStatus] = useState<any>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    loadDiscoveryQueue();
    loadSubscriptionStatus();
  }, []);

  const loadDiscoveryQueue = async () => {
    try {
      setLoading(true);
      const users = await api.getDiscoveryQueue(10);
      setDiscoveryQueue(users);
      setCurrentIndex(0);
    } catch (error) {
      console.error('Error loading discovery queue:', error);
      setSnackbar({ open: true, message: 'Failed to load profiles', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const loadSubscriptionStatus = async () => {
    try {
      const status = await api.getSubscriptionStatus();
      setSubscriptionStatus(status);
    } catch (error) {
      console.error('Error loading subscription status:', error);
    }
  };

  const handleSwipe = async (direction: 'left' | 'right' | 'super') => {
    if (currentIndex >= discoveryQueue.length) return;

    const currentUser = discoveryQueue[currentIndex];
    
    try {
      if (direction === 'left') {
        await api.dislikeUser(currentUser.id);
      } else if (direction === 'right') {
        const result = await api.likeUser(currentUser.id, false);
        if (result.matched) {
          setSnackbar({ open: true, message: `It's a match with ${currentUser.name}!`, severity: 'success' });
        }
      } else if (direction === 'super') {
        if (subscriptionStatus?.remainingSuperLikes <= 0 && !subscriptionStatus?.isPremium) {
          setPremiumFeature('super_likes');
          setPremiumModalOpen(true);
          return;
        }
        const result = await api.likeUser(currentUser.id, true);
        if (result.matched) {
          setSnackbar({ open: true, message: `Super match with ${currentUser.name}!`, severity: 'success' });
        }
      }

      setCurrentIndex(prev => prev + 1);

      // Load more profiles if running low
      if (currentIndex >= discoveryQueue.length - 2) {
        const moreUsers = await api.getDiscoveryQueue(10);
        setDiscoveryQueue(prev => [...prev, ...moreUsers]);
      }
    } catch (error: any) {
      console.error('Error swiping:', error);
      if (error.message?.includes('limit')) {
        setPremiumFeature('general');
        setPremiumModalOpen(true);
      } else {
        setSnackbar({ open: true, message: 'Something went wrong', severity: 'error' });
      }
    }
  };

  const handleRewind = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const currentUser = discoveryQueue[currentIndex];

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress size={64} />
      </Box>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2, minHeight: '100vh' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <IconButton onClick={() => router.back()}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h5" component="h1" sx={{ fontWeight: 'bold' }}>
          Discover
        </Typography>
        <IconButton onClick={() => setPremiumModalOpen(true)}>
          <Tune />
        </IconButton>
      </Box>

      {/* Subscription Status */}
      {subscriptionStatus && (
        <Box sx={{ mb: 3 }}>
          <Stack direction="row" spacing={1} justifyContent="center">
            <Chip
              icon={<Favorite />}
              label={subscriptionStatus.isPremium ? 'Unlimited' : `${subscriptionStatus.remainingLikes} likes left`}
              color={subscriptionStatus.isPremium ? 'primary' : 'default'}
              variant={subscriptionStatus.isPremium ? 'filled' : 'outlined'}
            />
            <Chip
              icon={<Star />}
              label={`${subscriptionStatus.remainingSuperLikes} Super Likes`}
              color="primary"
              variant="outlined"
            />
          </Stack>
        </Box>
      )}

      {/* Main Swipe Area */}
      <Box
        sx={{
          position: 'relative',
          height: '65vh',
          mb: 3,
          perspective: '1000px'
        }}
      >
        <AnimatePresence mode="wait">
          {currentUser ? (
            <SwipeCard
              key={currentUser.id}
              user={currentUser}
              onSwipe={handleSwipe}
            />
          ) : (
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 4,
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                color: 'white'
              }}
            >
              <CardContent sx={{ textAlign: 'center' }}>
                <Typography variant="h5" component="h2" sx={{ mb: 2, fontWeight: 'bold' }}>
                  You're all caught up!
                </Typography>
                <Typography variant="body1" sx={{ mb: 3, opacity: 0.9 }}>
                  Check back later for more profiles
                </Typography>
                <Button
                  variant="contained"
                  onClick={loadDiscoveryQueue}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)'
                    }
                  }}
                >
                  <Refresh sx={{ mr: 1 }} />
                  Refresh
                </Button>
              </CardContent>
            </Card>
          )}
        </AnimatePresence>
      </Box>

      {/* Action Buttons */}
      <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: 3 }}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <IconButton
            onClick={() => handleSwipe('left')}
            disabled={!currentUser}
            sx={{
              backgroundColor: 'rgba(244, 67, 54, 0.1)',
              border: '2px solid #f44336',
              width: 64,
              height: 64,
              '&:hover': {
                backgroundColor: 'rgba(244, 67, 54, 0.2)'
              }
            }}
          >
            <Close sx={{ color: '#f44336', fontSize: 32 }} />
          </IconButton>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <IconButton
            onClick={() => handleSwipe('super')}
            disabled={!currentUser}
            sx={{
              backgroundColor: 'rgba(33, 150, 243, 0.1)',
              border: '2px solid #2196f3',
              width: 64,
              height: 64,
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.2)'
              }
            }}
          >
            <Star sx={{ color: '#2196f3', fontSize: 32 }} />
          </IconButton>
        </motion.div>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <IconButton
            onClick={() => handleSwipe('right')}
            disabled={!currentUser}
            sx={{
              backgroundColor: 'rgba(76, 175, 80, 0.1)',
              border: '2px solid #4caf50',
              width: 64,
              height: 64,
              '&:hover': {
                backgroundColor: 'rgba(76, 175, 80, 0.2)'
              }
            }}
          >
            <Favorite sx={{ color: '#4caf50', fontSize: 32 }} />
          </IconButton>
        </motion.div>
      </Stack>

      {/* Rewind Button */}
      <Box sx={{ textAlign: 'center' }}>
        <Button
          variant="text"
          onClick={handleRewind}
          disabled={currentIndex === 0}
          sx={{ textTransform: 'none', opacity: currentIndex === 0 ? 0.5 : 1 }}
        >
          ↶ Rewind
        </Button>
      </Box>

      {/* Premium Modal */}
      <PremiumModal
        open={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
        feature={premiumFeature}
      />

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}