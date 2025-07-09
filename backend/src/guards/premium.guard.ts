import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { SubscriptionService } from '../subscription/subscription.service';

@Injectable()
export class PremiumGuard implements CanActivate {
  constructor(private subscriptionService: SubscriptionService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    const isPremium = await this.subscriptionService.isUserPremium(user.id);
    
    if (!isPremium) {
      throw new ForbiddenException('Premium subscription required');
    }

    return true;
  }
}