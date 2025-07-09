'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  AppBar, 
  Toolbar, 
  Grid, 
  Card, 
  CardContent,
  useTheme,
  Stack
} from '@mui/material';
import { 
  Favorite, 
  Security, 
  Psychology, 
  Groups, 
  Bolt 
} from '@mui/icons-material';

export default function Home() {
  const router = useRouter();
  const theme = useTheme();

  const features = [
    {
      icon: <Favorite sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Authentic Connections",
      description: "Real people, real conversations, real relationships"
    },
    {
      icon: <Security sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Safe & Secure",
      description: "Advanced verification and privacy protection"
    },
    {
      icon: <Psychology sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Smart Matching",
      description: "AI-powered compatibility matching system"
    },
    {
      icon: <Groups sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: "Diverse Community",
      description: "Connect with people from all walks of life"
    }
  ];

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: theme.custom.gradients.primary,
        position: 'relative'
      }}
    >
      <AppBar 
        position="static" 
        elevation={0}
        sx={{ 
          background: 'transparent',
          color: 'white'
        }}
      >
        <Toolbar>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Favorite sx={{ mr: 1, fontSize: 32 }} />
            <Typography variant="h4" component="div" sx={{ fontWeight: 'bold' }}>
              Bumble
            </Typography>
          </Box>
          <Button 
            color="inherit" 
            onClick={() => router.push('/login')}
            sx={{ 
              textTransform: 'none',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            Sign In
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography 
              variant="h1" 
              component="h1" 
              sx={{ 
                color: 'white',
                fontWeight: 'bold',
                mb: 3,
                textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                fontSize: { xs: '2.5rem', md: '4rem' }
              }}
            >
              Make the First Move
            </Typography>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography 
              variant="h5" 
              component="p" 
              sx={{ 
                color: 'white',
                mb: 6,
                maxWidth: 600,
                textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                fontSize: { xs: '1.2rem', md: '1.5rem' }
              }}
            >
              Start building valuable relationships, finding friends, and making empowered connections.
            </Typography>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Stack spacing={2} direction={{ xs: 'column', sm: 'row' }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => router.push('/register')}
                sx={{ 
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                  minWidth: 200,
                  py: 1.5,
                  fontSize: '1.1rem',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 6px 20px rgba(0,0,0,0.2)'
                  }
                }}
              >
                Join Bumble
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={() => router.push('/login')}
                sx={{ 
                  borderColor: 'white',
                  color: 'white',
                  minWidth: 200,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderWidth: 2,
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'white',
                    color: theme.palette.primary.main,
                    borderWidth: 2,
                    transform: 'translateY(-2px)'
                  }
                }}
              >
                Sign In
              </Button>
            </Stack>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <Grid container spacing={3} sx={{ mt: 8, maxWidth: 1000 }}>
              {features.map((feature, index) => (
                <Grid item xs={12} sm={6} md={3} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  >
                    <Card 
                      sx={{ 
                        textAlign: 'center',
                        height: '100%',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-5px)',
                          boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ mb: 2 }}>
                          {feature.icon}
                        </Box>
                        <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 'bold' }}>
                          {feature.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {feature.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Box>
      </Container>
    </Box>
  );
}