import { 
  Controller, 
  Post, 
  Get, 
  Body, 
  UseGuards, 
  Request,
  Headers,
  RawBodyRequest,
  Req 
} from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { 
  CreateSubscriptionDto, 
  PurchaseSuperLikesDto, 
  PurchaseBoostDto 
} from './dto/subscription.dto';

@Controller('subscription')
export class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createSubscription(@Request() req, @Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.subscriptionService.createSubscription(req.user.id, createSubscriptionDto.planId);
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  async cancelSubscription(@Request() req) {
    return this.subscriptionService.cancelSubscription(req.user.id);
  }

  @Get('status')
  @UseGuards(JwtAuthGuard)
  async getSubscriptionStatus(@Request() req) {
    const subscription = await this.subscriptionService.getUserSubscription(req.user.id);
    const isPremium = await this.subscriptionService.isUserPremium(req.user.id);
    const remainingLikes = await this.subscriptionService.getRemainingLikes(req.user.id);
    const remainingSuperLikes = await this.subscriptionService.getRemaininguperLikes(req.user.id);

    return {
      subscription,
      isPremium,
      remainingLikes,
      remainingSuperLikes,
    };
  }

  @Post('purchase/super-likes')
  @UseGuards(JwtAuthGuard)
  async purchaseSuperLikes(@Request() req, @Body() purchaseDto: PurchaseSuperLikesDto) {
    return this.subscriptionService.purchaseSuperLikes(req.user.id, purchaseDto.count);
  }

  @Post('purchase/boost')
  @UseGuards(JwtAuthGuard)
  async purchaseBoost(@Request() req, @Body() purchaseDto: PurchaseBoostDto) {
    return this.subscriptionService.purchaseBoost(req.user.id);
  }

  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature: string
  ) {
    const payload = req.rawBody;
    return this.subscriptionService.handleWebhook(signature, payload);
  }
}