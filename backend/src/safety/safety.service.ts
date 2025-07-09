import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReportType, ReportStatus } from '@prisma/client';

@Injectable()
export class SafetyService {
  constructor(private prisma: PrismaService) {}

  async reportUser(reporterId: string, reportedUserId: string, reason: ReportType, description?: string) {
    if (reporterId === reportedUserId) {
      throw new BadRequestException('Cannot report yourself');
    }

    // Check if user has already reported this user
    const existingReport = await this.prisma.report.findFirst({
      where: {
        reporterId,
        reportedUserId,
        status: { not: 'RESOLVED' },
      },
    });

    if (existingReport) {
      throw new BadRequestException('You have already reported this user');
    }

    const report = await this.prisma.report.create({
      data: {
        reporterId,
        reportedUserId,
        reason,
        description,
        status: 'PENDING',
      },
      include: {
        reporter: {
          select: { id: true, name: true, email: true },
        },
        reportedUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // Auto-block user if they receive multiple reports
    const recentReports = await this.prisma.report.count({
      where: {
        reportedUserId,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, // Last 24 hours
      },
    });

    if (recentReports >= 3) {
      await this.prisma.user.update({
        where: { id: reportedUserId },
        data: { isBlocked: true },
      });
    }

    return report;
  }

  async blockUser(userId: string, blockedUserId: string) {
    if (userId === blockedUserId) {
      throw new BadRequestException('Cannot block yourself');
    }

    // Check if already blocked
    const existingBlock = await this.prisma.block.findUnique({
      where: {
        userId_blockedUserId: {
          userId,
          blockedUserId,
        },
      },
    });

    if (existingBlock) {
      throw new BadRequestException('User is already blocked');
    }

    const block = await this.prisma.block.create({
      data: {
        userId,
        blockedUserId,
      },
    });

    // Remove any existing matches
    await this.prisma.match.deleteMany({
      where: {
        OR: [
          { user1Id: userId, user2Id: blockedUserId },
          { user1Id: blockedUserId, user2Id: userId },
        ],
      },
    });

    // Remove any existing likes
    await this.prisma.like.deleteMany({
      where: {
        OR: [
          { userId, targetUserId: blockedUserId },
          { userId: blockedUserId, targetUserId: userId },
        ],
      },
    });

    return block;
  }

  async unblockUser(userId: string, blockedUserId: string) {
    const block = await this.prisma.block.findUnique({
      where: {
        userId_blockedUserId: {
          userId,
          blockedUserId,
        },
      },
    });

    if (!block) {
      throw new NotFoundException('User is not blocked');
    }

    await this.prisma.block.delete({
      where: {
        userId_blockedUserId: {
          userId,
          blockedUserId,
        },
      },
    });

    return { success: true };
  }

  async getBlockedUsers(userId: string) {
    return this.prisma.block.findMany({
      where: { userId },
      include: {
        blockedUser: {
          select: {
            id: true,
            name: true,
            photos: {
              where: { isPrimary: true },
              take: 1,
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async isUserBlocked(userId: string, targetUserId: string): Promise<boolean> {
    const block = await this.prisma.block.findFirst({
      where: {
        OR: [
          { userId, blockedUserId: targetUserId },
          { userId: targetUserId, blockedUserId: userId },
        ],
      },
    });

    return !!block;
  }

  async getReports(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const reports = await this.prisma.report.findMany({
      skip,
      take: limit,
      include: {
        reporter: {
          select: { id: true, name: true, email: true },
        },
        reportedUser: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = await this.prisma.report.count();

    return {
      reports,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async updateReportStatus(reportId: string, status: ReportStatus, adminNotes?: string) {
    const report = await this.prisma.report.findUnique({
      where: { id: reportId },
    });

    if (!report) {
      throw new NotFoundException('Report not found');
    }

    const updatedReport = await this.prisma.report.update({
      where: { id: reportId },
      data: {
        status,
        adminNotes,
        resolvedAt: status === 'RESOLVED' ? new Date() : null,
      },
      include: {
        reporter: {
          select: { id: true, name: true, email: true },
        },
        reportedUser: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    // If report is approved, take action on the reported user
    if (status === 'APPROVED') {
      await this.prisma.user.update({
        where: { id: report.reportedUserId },
        data: { isBlocked: true },
      });
    }

    return updatedReport;
  }

  async moderateUser(userId: string, action: 'BLOCK' | 'UNBLOCK' | 'WARN') {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    switch (action) {
      case 'BLOCK':
        await this.prisma.user.update({
          where: { id: userId },
          data: { isBlocked: true },
        });
        break;
      case 'UNBLOCK':
        await this.prisma.user.update({
          where: { id: userId },
          data: { isBlocked: false },
        });
        break;
      case 'WARN':
        // In a real app, you might send a warning email or notification
        break;
    }

    return { success: true };
  }

  async getFilteredUsers(userId: string, excludeBlocked: boolean = true) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let excludeUserIds = [userId];

    if (excludeBlocked) {
      // Get blocked users
      const blockedUsers = await this.prisma.block.findMany({
        where: {
          OR: [
            { userId },
            { blockedUserId: userId },
          ],
        },
        select: {
          userId: true,
          blockedUserId: true,
        },
      });

      const blockedUserIds = blockedUsers.flatMap(block => 
        block.userId === userId ? [block.blockedUserId] : [block.userId]
      );

      excludeUserIds = [...excludeUserIds, ...blockedUserIds];
    }

    return excludeUserIds;
  }
}