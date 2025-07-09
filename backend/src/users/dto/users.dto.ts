import { IsString, IsOptional, IsNumber, IsBoolean, IsArray, IsDateString, IsEnum, Min, Max } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsString()
  occupation?: string;

  @IsOptional()
  @IsString()
  education?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  interests?: string[];

  @IsOptional()
  @IsString()
  lookingFor?: string;

  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(99)
  minAge?: number;

  @IsOptional()
  @IsNumber()
  @Min(18)
  @Max(99)
  maxAge?: number;

  @IsOptional()
  @IsString()
  interestedIn?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(500)
  maxDistance?: number;
}

export class LikeUserDto {
  @IsOptional()
  @IsBoolean()
  isSuper?: boolean = false;
}

export class UpdateLocationDto {
  @IsNumber()
  @Min(-90)
  @Max(90)
  latitude: number;

  @IsNumber()
  @Min(-180)
  @Max(180)
  longitude: number;
}