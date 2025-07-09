'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  useTheme,
  Stack,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip
} from '@mui/material';
import {
  Close,
  Star,
  Visibility,
  FilterList,
  Bolt,
  CheckCircle,
  Premium,
  AutoAwesome
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
  feature?: 'general' | 'super_likes' | 'see_likes' | 'filters';
}

export default function PremiumModal({ open, onClose, feature = 'general' }: PremiumModalProps) {
  const theme = useTheme();
  const [selectedPlan, setSelectedPlan] = useState<'premium' | 'vip'>('premium');
  const [loading, setLoading] = useState(false);

  const plans = {
    premium: {
      name: 'Premium',
      price: 9.99,
      period: '/month',
      features: [
        'Unlimited likes',
        'See who likes you',
        'Advanced filters',
        '5 Super Likes per week',
        'Rewind last swipe',
        'Premium badges'
      ],
      color: theme.palette.primary.main,
      icon: <Premium />
    },
    vip: {
      name: 'VIP',
      price: 19.99,
      period: '/month',
      features: [
        'All Premium features',
        'Profile boost weekly',
        'Read receipts',
        'Priority matching',
        'Unlimited Super Likes',
        'VIP badge',
        'Premium support'
      ],
      color: '#9c27b0',
      icon: <AutoAwesome />
    }
  };

  const handleSubscribe = async () => {
    setLoading(true);
    try {
      const planId = selectedPlan === 'premium' ? 'price_premium' : 'price_vip';
      const response = await api.createSubscription(planId);
      
      // Handle Stripe payment flow
      if (response.clientSecret) {
        // Initialize Stripe and handle payment
        window.location.href = `/payment?client_secret=${response.clientSecret}`;
      }
    } catch (error) {
      console.error('Subscription error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFeatureTitle = () => {
    switch (feature) {
      case 'super_likes':
        return 'Get Super Likes';
      case 'see_likes':
        return 'See Who Likes You';
      case 'filters':
        return 'Advanced Filters';
      default:
        return 'Go Premium';
    }
  };

  const getFeatureDescription = () => {
    switch (feature) {
      case 'super_likes':
        return 'Stand out with Super Likes to get 3x more matches';
      case 'see_likes':
        return 'Skip the guesswork and see who already likes you';
      case 'filters':
        return 'Find exactly what you\'re looking for with advanced filters';
      default:
        return 'Get the most out of your dating experience';
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              overflow: 'hidden',
              minHeight: '70vh'
            }
          }}
        >
          <DialogTitle sx={{ p: 0, position: 'relative' }}>
            <Box
              sx={{
                background: theme.custom.gradients.primary,
                color: 'white',
                p: 3,
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <IconButton
                onClick={onClose}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }
                }}
              >
                <Close />
              </IconButton>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Star sx={{ fontSize: 48, mb: 2 }} />
                <Typography variant="h4" component="h2" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {getFeatureTitle()}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, maxWidth: 400, mx: 'auto' }}>
                  {getFeatureDescription()}
                </Typography>
              </motion.div>
            </Box>
          </DialogTitle>

          <DialogContent sx={{ p: 3 }}>
            <Grid container spacing={3}>
              {Object.entries(plans).map(([key, plan]) => (
                <Grid item xs={12} md={6} key={key}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    <Card
                      sx={{
                        height: '100%',
                        border: selectedPlan === key ? `2px solid ${plan.color}` : '2px solid transparent',
                        borderRadius: 3,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        transform: selectedPlan === key ? 'scale(1.02)' : 'scale(1)',
                        '&:hover': {
                          transform: selectedPlan === key ? 'scale(1.02)' : 'scale(1.01)',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)'
                        }
                      }}
                      onClick={() => setSelectedPlan(key as 'premium' | 'vip')}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ textAlign: 'center', mb: 3 }}>
                          <Box sx={{ color: plan.color, mb: 1 }}>
                            {plan.icon}
                          </Box>
                          <Typography variant="h5" component="h3" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {plan.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'baseline', justifyContent: 'center', gap: 0.5 }}>
                            <Typography variant="h3" component="span" sx={{ fontWeight: 'bold', color: plan.color }}>
                              ${plan.price}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {plan.period}
                            </Typography>
                          </Box>
                          {key === 'vip' && (
                            <Chip
                              label="Most Popular"
                              size="small"
                              sx={{
                                mt: 1,
                                backgroundColor: plan.color,
                                color: 'white',
                                fontWeight: 'bold'
                              }}
                            />
                          )}
                        </Box>

                        <List dense sx={{ p: 0 }}>
                          {plan.features.map((feature, index) => (
                            <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                              <ListItemIcon sx={{ minWidth: 32 }}>
                                <CheckCircle sx={{ color: plan.color, fontSize: 20 }} />
                              </ListItemIcon>
                              <ListItemText
                                primary={feature}
                                primaryTypographyProps={{
                                  variant: 'body2',
                                  fontWeight: 500
                                }}
                              />
                            </ListItem>
                          ))}
                        </List>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>

            <Box sx={{ mt: 4, textAlign: 'center' }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubscribe}
                loading={loading}
                disabled={loading}
                sx={{
                  minWidth: 200,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  borderRadius: 3,
                  background: plans[selectedPlan].color,
                  '&:hover': {
                    background: plans[selectedPlan].color,
                    filter: 'brightness(1.1)'
                  }
                }}
              >
                {loading ? 'Processing...' : `Subscribe to ${plans[selectedPlan].name}`}
              </Button>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                Or get individual features:
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="center" sx={{ flexWrap: 'wrap', gap: 1 }}>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Star />}
                  onClick={() => {
                    // Handle super likes purchase
                  }}
                >
                  5 Super Likes - $1.99
                </Button>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<Bolt />}
                  onClick={() => {
                    // Handle boost purchase
                  }}
                >
                  Boost - $3.99
                </Button>
              </Stack>
            </Box>

            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', textAlign: 'center', mt: 2 }}>
              Cancel anytime. Auto-renewable. Terms apply.
            </Typography>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}