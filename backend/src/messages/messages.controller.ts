import { 
  Controller, 
  Get, 
  Post, 
  Delete,
  Body, 
  Param, 
  UseGuards, 
  Request,
  Query 
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SendMessageDto } from './dto/messages.dto';

@Controller('messages')
@UseGuards(JwtAuthGuard)
export class MessagesController {
  constructor(private messagesService: MessagesService) {}

  @Post('send')
  async sendMessage(@Request() req, @Body() sendMessageDto: SendMessageDto) {
    return this.messagesService.sendMessage(
      req.user.id, 
      sendMessageDto.matchId, 
      sendMessageDto.content
    );
  }

  @Get('match/:matchId')
  async getMatchMessages(
    @Request() req, 
    @Param('matchId') matchId: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string
  ) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 50;
    
    return this.messagesService.getMatchMessages(req.user.id, matchId, pageNum, limitNum);
  }

  @Get('unread-count')
  async getUnreadCount(@Request() req) {
    return this.messagesService.getUnreadCount(req.user.id);
  }

  @Post('read/:messageId')
  async markAsRead(@Request() req, @Param('messageId') messageId: string) {
    return this.messagesService.markMessageAsRead(req.user.id, messageId);
  }

  @Delete(':messageId')
  async deleteMessage(@Request() req, @Param('messageId') messageId: string) {
    return this.messagesService.deleteMessage(req.user.id, messageId);
  }
}