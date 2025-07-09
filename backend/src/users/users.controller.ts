import { 
  Controller, 
  Get, 
  Post, 
  Put, 
  Body, 
  Param, 
  UseGuards, 
  Request,
  Query,
  BadRequestException 
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto, LikeUserDto, UpdateLocationDto } from './dto/users.dto';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('me')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.id);
  }

  @Put('me')
  async updateProfile(@Request() req, @Body() updateData: UpdateProfileDto) {
    return this.usersService.updateProfile(req.user.id, updateData);
  }

  @Get('discover')
  async getDiscoveryQueue(@Request() req, @Query('limit') limit?: string) {
    const limitNum = limit ? parseInt(limit) : 10;
    if (limitNum > 50) {
      throw new BadRequestException('Limit cannot exceed 50');
    }
    return this.usersService.getDiscoveryQueue(req.user.id, limitNum);
  }

  @Post('like/:targetUserId')
  async likeUser(@Request() req, @Param('targetUserId') targetUserId: string, @Body() body: LikeUserDto) {
    return this.usersService.likeUser(req.user.id, targetUserId, body.isSuper);
  }

  @Post('dislike/:targetUserId')
  async dislikeUser(@Request() req, @Param('targetUserId') targetUserId: string) {
    return this.usersService.dislikeUser(req.user.id, targetUserId);
  }

  @Get('matches')
  async getMatches(@Request() req) {
    return this.usersService.getMatches(req.user.id);
  }

  @Put('location')
  async updateLocation(@Request() req, @Body() locationData: UpdateLocationDto) {
    return this.usersService.updateLocation(
      req.user.id, 
      locationData.latitude, 
      locationData.longitude
    );
  }

  @Get('nearby')
  async findUsersNearby(@Request() req, @Query('radius') radius?: string) {
    const radiusKm = radius ? parseInt(radius) : 50;
    return this.usersService.findUsersNearby(req.user.id, radiusKm);
  }

  @Post('activity')
  async updateLastActive(@Request() req) {
    return this.usersService.updateLastActive(req.user.id);
  }
}