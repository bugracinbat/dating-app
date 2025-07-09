import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { MessagesModule } from './messages/messages.module';
import { PhotosModule } from './photos/photos.module';
import { SubscriptionModule } from './subscription/subscription.module';
import { SafetyModule } from './safety/safety.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, MessagesModule, PhotosModule, SubscriptionModule, SafetyModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}