import { IsString, IsEnum, IsOptional, IsUUID } from 'class-validator';
import { ReportType, ReportStatus } from '@prisma/client';

export class ReportUserDto {
  @IsUUID()
  reportedUserId: string;

  @IsEnum(ReportType)
  reason: ReportType;

  @IsOptional()
  @IsString()
  description?: string;
}

export class BlockUserDto {
  @IsUUID()
  blockedUserId: string;
}

export class UpdateReportDto {
  @IsEnum(ReportStatus)
  status: ReportStatus;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}

export class ModerateUserDto {
  @IsUUID()
  userId: string;

  @IsEnum(['BLOCK', 'UNBLOCK', 'WARN'])
  action: 'BLOCK' | 'UNBLOCK' | 'WARN';
}