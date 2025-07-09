import { 
  Controller, 
  Post, 
  Delete, 
  Put, 
  Get,
  Param, 
  UseGuards, 
  Request,
  UseInterceptors,
  UploadedFile,
  Body 
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PhotosService } from './photos.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ReorderPhotosDto } from './dto/photos.dto';

@Controller('photos')
@UseGuards(JwtAuthGuard)
export class PhotosController {
  constructor(private photosService: PhotosService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('photo'))
  async uploadPhoto(@Request() req, @UploadedFile() file: Express.Multer.File) {
    return this.photosService.uploadPhoto(req.user.id, file);
  }

  @Delete(':photoId')
  async deletePhoto(@Request() req, @Param('photoId') photoId: string) {
    return this.photosService.deletePhoto(req.user.id, photoId);
  }

  @Put(':photoId/primary')
  async setPrimaryPhoto(@Request() req, @Param('photoId') photoId: string) {
    return this.photosService.setPrimaryPhoto(req.user.id, photoId);
  }

  @Get()
  async getUserPhotos(@Request() req) {
    return this.photosService.getUserPhotos(req.user.id);
  }

  @Put('reorder')
  async reorderPhotos(@Request() req, @Body() reorderDto: ReorderPhotosDto) {
    return this.photosService.reorderPhotos(req.user.id, reorderDto.photoIds);
  }
}