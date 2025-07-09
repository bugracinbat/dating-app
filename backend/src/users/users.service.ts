import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        photos: true,
        preferences: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateProfile(userId: string, data: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { id: userId },
      data,
      include: {
        photos: true,
        preferences: true,
      },
    });
  }

  async getDiscoveryQueue(userId: string, limit: number = 10) {
    const user = await this.findById(userId);
    
    // Get users that haven't been liked/disliked by current user
    const likedUserIds = await this.prisma.like.findMany({
      where: { userId },
      select: { targetUserId: true },
    });

    const excludedIds = [userId, ...likedUserIds.map(like => like.targetUserId)];

    // Calculate age range from user's preferences
    const ageRange = this.calculateAgeRange(user.preferences?.minAge || 18, user.preferences?.maxAge || 99);

    const potentialMatches = await this.prisma.user.findMany({
      where: {
        id: { notIn: excludedIds },
        gender: user.preferences?.interestedIn || undefined,
        dateOfBirth: {
          gte: ageRange.maxDate,
          lte: ageRange.minDate,
        },
        // Location-based filtering would go here
      },
      include: {
        photos: true,
      },
      take: limit,
      orderBy: {
        lastActive: 'desc',
      },
    });

    return potentialMatches;
  }

  async likeUser(userId: string, targetUserId: string, isSuper: boolean = false) {
    // Check if already liked
    const existingLike = await this.prisma.like.findUnique({
      where: {
        userId_targetUserId: {
          userId,
          targetUserId,
        },
      },
    });

    if (existingLike) {
      throw new BadRequestException('User already liked');
    }

    // Create like
    const like = await this.prisma.like.create({
      data: {
        userId,
        targetUserId,
        isSuper,
      },
    });

    // Check if target user has liked back (mutual like)
    const mutualLike = await this.prisma.like.findUnique({
      where: {
        userId_targetUserId: {
          userId: targetUserId,
          targetUserId: userId,
        },
      },
    });

    if (mutualLike) {
      // Create match
      await this.prisma.match.create({
        data: {
          user1Id: userId,
          user2Id: targetUserId,
        },
      });

      return { like, matched: true };
    }

    return { like, matched: false };
  }

  async dislikeUser(userId: string, targetUserId: string) {
    return this.prisma.like.create({
      data: {
        userId,
        targetUserId,
        isLike: false,
      },
    });
  }

  async getMatches(userId: string) {
    return this.prisma.match.findMany({
      where: {
        OR: [
          { user1Id: userId },
          { user2Id: userId },
        ],
      },
      include: {
        user1: {
          include: { photos: true },
        },
        user2: {
          include: { photos: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateLastActive(userId: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { lastActive: new Date() },
    });
  }

  private calculateAgeRange(minAge: number, maxAge: number) {
    const today = new Date();
    const minDate = new Date(today.getFullYear() - maxAge, today.getMonth(), today.getDate());
    const maxDate = new Date(today.getFullYear() - minAge, today.getMonth(), today.getDate());
    return { minDate, maxDate };
  }

  async updateLocation(userId: string, latitude: number, longitude: number) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        latitude,
        longitude,
        lastLocationUpdate: new Date(),
      },
    });
  }

  async findUsersNearby(userId: string, radiusKm: number = 50) {
    const user = await this.findById(userId);
    
    if (!user.latitude || !user.longitude) {
      return [];
    }

    // Simple distance calculation using Haversine formula
    // In production, use PostGIS or similar for better performance
    const earthRadius = 6371; // km
    const latRange = radiusKm / earthRadius;
    const lngRange = radiusKm / (earthRadius * Math.cos(user.latitude * Math.PI / 180));

    return this.prisma.user.findMany({
      where: {
        id: { not: userId },
        latitude: {
          gte: user.latitude - latRange,
          lte: user.latitude + latRange,
        },
        longitude: {
          gte: user.longitude - lngRange,
          lte: user.longitude + lngRange,
        },
      },
      include: {
        photos: true,
      },
    });
  }
}