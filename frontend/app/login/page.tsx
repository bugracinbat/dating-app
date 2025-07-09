'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  InputAdornment,
  Alert,
  Link,
  useTheme,
  CircularProgress
} from '@mui/material';
import {
  Favorite,
  ArrowBack,
  Visibility,
  VisibilityOff,
  Lock,
  Email
} from '@mui/icons-material';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError('');
      await login(data.email, data.password);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: theme.palette.background.default }}>
      <AppBar position="static" elevation={0}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={() => router.push('/')}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Favorite sx={{ mr: 1, color: theme.palette.primary.main }} />
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
              Bumble
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ width: '100%' }}
          >
            <Paper 
              elevation={3} 
              sx={{ 
                p: 4, 
                borderRadius: 3,
                position: 'relative',
                background: 'linear-gradient(135deg, #fff 0%, #f8f9fa 100%)'
              }}
            >
              <Box sx={{ textAlign: 'center', mb: 4 }}>
                <Box 
                  sx={{ 
                    width: 80, 
                    height: 80, 
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mx: 'auto',
                    mb: 2
                  }}
                >
                  <Lock sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Welcome Back
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Sign in to continue your journey
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  error={!!errors.password}
                  helperText={errors.password?.message}
                  sx={{ mb: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Alert severity="error" sx={{ mb: 3 }}>
                      {error}
                    </Alert>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  sx={{ 
                    mb: 3,
                    py: 1.5,
                    fontSize: '1.1rem',
                    position: 'relative'
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Sign In'
                  )}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Don't have an account?{' '}
                    <Link
                      component="button"
                      type="button"
                      onClick={() => router.push('/register')}
                      sx={{ 
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Sign up
                    </Link>
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}