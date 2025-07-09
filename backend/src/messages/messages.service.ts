import { Injectable, BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) {}

  async sendMessage(senderId: string, matchId: string, content: string) {
    // Verify the match exists and user is part of it
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
      include: {
        user1: true,
        user2: true,
      },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (match.user1Id !== senderId && match.user2Id !== senderId) {
      throw new ForbiddenException('You are not part of this match');
    }

    // Check if match has expired (24 hours for women to message first)
    const twentyFourHours = 24 * 60 * 60 * 1000;
    const isExpired = Date.now() - match.createdAt.getTime() > twentyFourHours;

    if (isExpired) {
      const hasMessages = await this.prisma.message.findFirst({
        where: { matchId },
      });

      if (!hasMessages) {
        throw new BadRequestException('Match has expired');
      }
    }

    // For Bumble-style apps, check if woman should message first
    const existingMessages = await this.prisma.message.findFirst({
      where: { matchId },
    });

    if (!existingMessages) {
      // First message - check if sender is female (if implementing Bumble rules)
      const sender = senderId === match.user1Id ? match.user1 : match.user2;
      if (sender.gender === 'MALE') {
        throw new ForbiddenException('Women must message first');
      }
    }

    const message = await this.prisma.message.create({
      data: {
        content,
        senderId,
        matchId,
      },
      include: {
        sender: {
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
    });

    // Update match's last message timestamp
    await this.prisma.match.update({
      where: { id: matchId },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }

  async getMatchMessages(userId: string, matchId: string, page: number = 1, limit: number = 50) {
    // Verify user is part of the match
    const match = await this.prisma.match.findUnique({
      where: { id: matchId },
    });

    if (!match) {
      throw new NotFoundException('Match not found');
    }

    if (match.user1Id !== userId && match.user2Id !== userId) {
      throw new ForbiddenException('You are not part of this match');
    }

    const messages = await this.prisma.message.findMany({
      where: { matchId },
      include: {
        sender: {
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
      skip: (page - 1) * limit,
      take: limit,
    });

    // Mark messages as read
    await this.prisma.message.updateMany({
      where: {
        matchId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return messages.reverse(); // Return in chronological order
  }

  async getUnreadCount(userId: string) {
    return this.prisma.message.count({
      where: {
        match: {
          OR: [
            { user1Id: userId },
            { user2Id: userId },
          ],
        },
        senderId: { not: userId },
        isRead: false,
      },
    });
  }

  async markMessageAsRead(userId: string, messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: { match: true },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.match.user1Id !== userId && message.match.user2Id !== userId) {
      throw new ForbiddenException('You are not part of this match');
    }

    if (message.senderId === userId) {
      throw new BadRequestException('Cannot mark your own message as read');
    }

    return this.prisma.message.update({
      where: { id: messageId },
      data: { isRead: true },
    });
  }

  async deleteMessage(userId: string, messageId: string) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: { match: true },
    });

    if (!message) {
      throw new NotFoundException('Message not found');
    }

    if (message.senderId !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    return this.prisma.message.delete({
      where: { id: messageId },
    });
  }
}