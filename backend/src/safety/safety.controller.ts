import { 
  Controller, 
  Post, 
  Get, 
  Put,
  Body, 
  Param, 
  UseGuards, 
  Request,
  Query 
} from '@nestjs/common';
import { SafetyService } from './safety.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReportUserDto, BlockUserDto, UpdateReportDto, ModerateUserDto } from './dto/safety.dto';

@Controller('safety')
@UseGuards(JwtAuthGuard)
export class SafetyController {
  constructor(private safetyService: SafetyService) {}

  @Post('report')
  async reportUser(@Request() req, @Body() reportDto: ReportUserDto) {
    return this.safetyService.reportUser(
      req.user.id,
      reportDto.reportedUserId,
      reportDto.reason,
      reportDto.description
    );
  }

  @Post('block')
  async blockUser(@Request() req, @Body() blockDto: BlockUserDto) {
    return this.safetyService.blockUser(req.user.id, blockDto.blockedUserId);
  }

  @Post('unblock/:userId')
  async unblockUser(@Request() req, @Param('userId') userId: string) {
    return this.safetyService.unblockUser(req.user.id, userId);
  }

  @Get('blocked-users')
  async getBlockedUsers(@Request() req) {
    return this.safetyService.getBlockedUsers(req.user.id);
  }

  // Admin endpoints (would need admin guard in production)
  @Get('reports')
  async getReports(@Query('page') page?: string, @Query('limit') limit?: string) {
    const pageNum = page ? parseInt(page) : 1;
    const limitNum = limit ? parseInt(limit) : 20;
    return this.safetyService.getReports(pageNum, limitNum);
  }

  @Put('reports/:reportId')
  async updateReport(@Param('reportId') reportId: string, @Body() updateDto: UpdateReportDto) {
    return this.safetyService.updateReportStatus(reportId, updateDto.status, updateDto.adminNotes);
  }

  @Post('moderate')
  async moderateUser(@Body() moderateDto: ModerateUserDto) {
    return this.safetyService.moderateUser(moderateDto.userId, moderateDto.action);
  }
}