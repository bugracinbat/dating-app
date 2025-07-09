import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PhotosService {
  private s3Client: S3Client;
  private bucketName = process.env.AWS_S3_BUCKET_NAME || 'dating-app-photos';

  constructor(private prisma: PrismaService) {
    this.s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });
  }

  async uploadPhoto(userId: string, file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      throw new BadRequestException('File size too large. Maximum 5MB allowed.');
    }

    // Check user photo count
    const existingPhotos = await this.prisma.photo.count({
      where: { userId },
    });

    if (existingPhotos >= 6) {
      throw new BadRequestException('Maximum 6 photos allowed per user');
    }

    // Generate unique filename
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${userId}/${uuidv4()}.${fileExtension}`;

    try {
      // Upload to S3
      const uploadCommand = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: fileName,
        Body: file.buffer,
        ContentType: file.mimetype,
        ACL: 'public-read',
      });

      await this.s3Client.send(uploadCommand);

      // Save to database
      const photo = await this.prisma.photo.create({
        data: {
          userId,
          url: `https://${this.bucketName}.s3.amazonaws.com/${fileName}`,
          fileName,
          isPrimary: existingPhotos === 0, // First photo is primary
        },
      });

      return photo;
    } catch (error) {
      console.error('Error uploading photo:', error);
      throw new BadRequestException('Failed to upload photo');
    }
  }

  async deletePhoto(userId: string, photoId: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    if (photo.userId !== userId) {
      throw new BadRequestException('You can only delete your own photos');
    }

    try {
      // Delete from S3
      const deleteCommand = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: photo.fileName,
      });

      await this.s3Client.send(deleteCommand);

      // Delete from database
      await this.prisma.photo.delete({
        where: { id: photoId },
      });

      // If this was the primary photo, make another photo primary
      if (photo.isPrimary) {
        const nextPhoto = await this.prisma.photo.findFirst({
          where: { userId },
          orderBy: { createdAt: 'asc' },
        });

        if (nextPhoto) {
          await this.prisma.photo.update({
            where: { id: nextPhoto.id },
            data: { isPrimary: true },
          });
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Error deleting photo:', error);
      throw new BadRequestException('Failed to delete photo');
    }
  }

  async setPrimaryPhoto(userId: string, photoId: string) {
    const photo = await this.prisma.photo.findUnique({
      where: { id: photoId },
    });

    if (!photo) {
      throw new NotFoundException('Photo not found');
    }

    if (photo.userId !== userId) {
      throw new BadRequestException('You can only modify your own photos');
    }

    // Remove primary flag from all user photos
    await this.prisma.photo.updateMany({
      where: { userId },
      data: { isPrimary: false },
    });

    // Set new primary photo
    return this.prisma.photo.update({
      where: { id: photoId },
      data: { isPrimary: true },
    });
  }

  async getUserPhotos(userId: string) {
    return this.prisma.photo.findMany({
      where: { userId },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'asc' },
      ],
    });
  }

  async reorderPhotos(userId: string, photoIds: string[]) {
    // Validate that all photos belong to the user
    const userPhotos = await this.prisma.photo.findMany({
      where: { userId },
      select: { id: true },
    });

    const userPhotoIds = userPhotos.map(p => p.id);
    const invalidIds = photoIds.filter(id => !userPhotoIds.includes(id));

    if (invalidIds.length > 0) {
      throw new BadRequestException('Invalid photo IDs provided');
    }

    // Update order for each photo
    const updatePromises = photoIds.map((photoId, index) =>
      this.prisma.photo.update({
        where: { id: photoId },
        data: { order: index },
      })
    );

    await Promise.all(updatePromises);

    return this.getUserPhotos(userId);
  }
}