'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardActionArea,
  Avatar,
  Typography,
  Box,
  Badge,
  useTheme,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio
} from '@mui/material';
import {
  MoreVert,
  Block,
  Report,
  Message,
  FiberManualRecord
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';

interface Match {
  id: string;
  user1: {
    id: string;
    name: string;
    photos: Array<{ url: string; isPrimary: boolean }>;
    lastActive: string;
  };
  user2: {
    id: string;
    name: string;
    photos: Array<{ url: string; isPrimary: boolean }>;
    lastActive: string;
  };
  messages: Array<{
    id: string;
    content: string;
    createdAt: string;
    senderId: string;
  }>;
  createdAt: string;
  lastMessageAt: string;
}

interface MatchCardProps {
  match: Match;
  currentUserId: string;
  onClick: () => void;
  onBlock: (userId: string) => void;
  onReport: (userId: string, reason: string, description?: string) => void;
}

export default function MatchCard({ match, currentUserId, onClick, onBlock, onReport }: MatchCardProps) {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDescription, setReportDescription] = useState('');

  const otherUser = match.user1.id === currentUserId ? match.user2 : match.user1;
  const primaryPhoto = otherUser.photos?.find(p => p.isPrimary) || otherUser.photos?.[0];
  const lastMessage = match.messages?.[0];
  const unreadCount = match.messages?.filter(m => m.senderId !== currentUserId).length || 0;

  const isOnline = (lastActive: string) => {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffMinutes = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60);
    return diffMinutes <= 5;
  };

  const getLastActiveText = (lastActive: string) => {
    const now = new Date();
    const lastActiveDate = new Date(lastActive);
    const diffMinutes = (now.getTime() - lastActiveDate.getTime()) / (1000 * 60);
    
    if (diffMinutes <= 5) return 'Online';
    if (diffMinutes <= 60) return `${Math.floor(diffMinutes)}m ago`;
    if (diffMinutes <= 1440) return `${Math.floor(diffMinutes / 60)}h ago`;
    return `${Math.floor(diffMinutes / 1440)}d ago`;
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleBlock = () => {
    onBlock(otherUser.id);
    handleMenuClose();
  };

  const handleReport = () => {
    setReportDialogOpen(true);
    handleMenuClose();
  };

  const handleReportSubmit = async () => {
    if (!reportReason) return;
    
    try {
      await onReport(otherUser.id, reportReason, reportDescription);
      setReportDialogOpen(false);
      setReportReason('');
      setReportDescription('');
    } catch (error) {
      console.error('Error reporting user:', error);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -2 }}
      >
        <Card
          sx={{
            borderRadius: 3,
            overflow: 'hidden',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)'
            }
          }}
        >
          <CardActionArea onClick={onClick} sx={{ p: 0 }}>
            <CardContent sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Badge
                  overlap="circular"
                  anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                  badgeContent={
                    isOnline(otherUser.lastActive) ? (
                      <FiberManualRecord
                        sx={{
                          color: '#4caf50',
                          fontSize: 12,
                          backgroundColor: 'white',
                          borderRadius: '50%',
                          p: 0.5
                        }}
                      />
                    ) : null
                  }
                >
                  <Avatar
                    src={primaryPhoto?.url}
                    alt={otherUser.name}
                    sx={{
                      width: 56,
                      height: 56,
                      border: '3px solid',
                      borderColor: theme.palette.primary.main
                    }}
                  >
                    {otherUser.name[0]}
                  </Avatar>
                </Badge>

                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" component="h3" sx={{ fontWeight: 'bold' }}>
                      {otherUser.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {unreadCount > 0 && (
                        <Badge
                          badgeContent={unreadCount}
                          color="primary"
                          sx={{
                            '& .MuiBadge-badge': {
                              fontSize: '0.75rem',
                              height: 20,
                              minWidth: 20
                            }
                          }}
                        >
                          <Message sx={{ fontSize: 20, color: theme.palette.primary.main }} />
                        </Badge>
                      )}
                      <IconButton
                        size="small"
                        onClick={handleMenuClick}
                        sx={{ color: 'text.secondary' }}
                      >
                        <MoreVert />
                      </IconButton>
                    </Box>
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {getLastActiveText(otherUser.lastActive)}
                  </Typography>

                  {lastMessage && (
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        lineHeight: 1.3,
                        fontWeight: lastMessage.senderId !== currentUserId && unreadCount > 0 ? 'bold' : 'normal'
                      }}
                    >
                      {lastMessage.senderId === currentUserId ? 'You: ' : ''}{lastMessage.content}
                    </Typography>
                  )}
                </Box>
              </Box>
            </CardContent>
          </CardActionArea>
        </Card>
      </motion.div>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleReport}>
          <Report sx={{ mr: 1 }} />
          Report
        </MenuItem>
        <MenuItem onClick={handleBlock}>
          <Block sx={{ mr: 1 }} />
          Block
        </MenuItem>
      </Menu>

      <Dialog
        open={reportDialogOpen}
        onClose={() => setReportDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Report {otherUser.name}</DialogTitle>
        <DialogContent>
          <FormControl component="fieldset" sx={{ mt: 2 }}>
            <FormLabel component="legend">Why are you reporting this user?</FormLabel>
            <RadioGroup
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              sx={{ mt: 1 }}
            >
              <FormControlLabel value="INAPPROPRIATE_CONTENT" control={<Radio />} label="Inappropriate content" />
              <FormControlLabel value="HARASSMENT" control={<Radio />} label="Harassment" />
              <FormControlLabel value="SPAM" control={<Radio />} label="Spam" />
              <FormControlLabel value="FAKE_PROFILE" control={<Radio />} label="Fake profile" />
              <FormControlLabel value="OTHER" control={<Radio />} label="Other" />
            </RadioGroup>
          </FormControl>

          <TextField
            multiline
            rows={4}
            fullWidth
            label="Additional details (optional)"
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleReportSubmit}
            variant="contained"
            color="error"
            disabled={!reportReason}
          >
            Report
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}