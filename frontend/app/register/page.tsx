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
  CircularProgress,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Favorite,
  ArrowBack,
  Visibility,
  VisibilityOff,
  Person,
  Email,
  CalendarMonth
} from '@mui/icons-material';

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  dateOfBirth: z.string().refine((date) => {
    const age = new Date().getFullYear() - new Date(date).getFullYear();
    return age >= 18;
  }, 'You must be at least 18 years old'),
  gender: z.enum(['MALE', 'FEMALE', 'OTHER']),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const theme = useTheme();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError('');
      const { confirmPassword, ...registerData } = data;
      await registerUser(registerData);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
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

      <Container maxWidth="md" sx={{ py: 4 }}>
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
                  <Person sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h4" component="h1" sx={{ fontWeight: 'bold', mb: 1 }}>
                  Create Account
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Join Bumble to start making connections
                </Typography>
              </Box>

              <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 3 }}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="First Name"
                      {...register('firstName')}
                      error={!!errors.firstName}
                      helperText={errors.firstName?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Last Name"
                      {...register('lastName')}
                      error={!!errors.lastName}
                      helperText={errors.lastName?.message}
                    />
                  </Grid>
                </Grid>

                <TextField
                  fullWidth
                  label="Email Address"
                  type="email"
                  {...register('email')}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  sx={{ mt: 3 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                />

                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('password')}
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
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
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Confirm Password"
                      type={showPassword ? 'text' : 'password'}
                      {...register('confirmPassword')}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                    />
                  </Grid>
                </Grid>

                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date of Birth"
                      type="date"
                      {...register('dateOfBirth')}
                      error={!!errors.dateOfBirth}
                      helperText={errors.dateOfBirth?.message}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <CalendarMonth color="action" />
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      select
                      label="Gender"
                      {...register('gender')}
                      error={!!errors.gender}
                      helperText={errors.gender?.message}
                      defaultValue=""
                    >
                      <MenuItem value="">Select gender</MenuItem>
                      <MenuItem value="MALE">Male</MenuItem>
                      <MenuItem value="FEMALE">Female</MenuItem>
                      <MenuItem value="OTHER">Other</MenuItem>
                    </TextField>
                  </Grid>
                </Grid>

                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Alert severity="error" sx={{ mt: 3 }}>
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
                    mt: 3,
                    mb: 2,
                    py: 1.5,
                    fontSize: '1.1rem'
                  }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    'Create Account'
                  )}
                </Button>

                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body2" color="text.secondary">
                    Already have an account?{' '}
                    <Link
                      component="button"
                      type="button"
                      onClick={() => router.push('/login')}
                      sx={{ 
                        color: theme.palette.primary.main,
                        fontWeight: 'bold',
                        textDecoration: 'none',
                        '&:hover': {
                          textDecoration: 'underline'
                        }
                      }}
                    >
                      Sign in
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