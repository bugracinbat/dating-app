import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import Stripe from 'stripe';

@Injectable()
export class SubscriptionService {
  private stripe: Stripe;

  constructor(private prisma: PrismaService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
      apiVersion: '2024-11-20.acacia',
    });
  }

  async createSubscription(userId: string, planId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { subscription: true },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.subscription && user.subscription.status === 'ACTIVE') {
      throw new BadRequestException('User already has an active subscription');
    }

    // Create Stripe customer if not exists
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId },
      });
      customerId = customer.id;

      await this.prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create subscription
    const subscription = await this.stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: planId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
    });

    // Save subscription to database
    await this.prisma.subscription.create({
      data: {
        userId,
        stripeSubscriptionId: subscription.id,
        planId,
        status: 'PENDING',
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    });

    return {
      subscriptionId: subscription.id,
      clientSecret: (subscription.latest_invoice as any)?.payment_intent?.client_secret,
    };
  }

  async cancelSubscription(userId: string) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { userId, status: 'ACTIVE' },
    });

    if (!subscription) {
      throw new NotFoundException('No active subscription found');
    }

    await this.stripe.subscriptions.update(subscription.stripeSubscriptionId, {
      cancel_at_period_end: true,
    });

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'CANCELLED' },
    });

    return { success: true };
  }

  async handleWebhook(signature: string, payload: Buffer) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || ''
      );
    } catch (error) {
      throw new BadRequestException('Invalid webhook signature');
    }

    switch (event.type) {
      case 'subscription.created':
      case 'subscription.updated':
        await this.handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;
      case 'subscription.deleted':
        await this.handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.payment_succeeded':
        await this.handlePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;
      case 'invoice.payment_failed':
        await this.handlePaymentFailed(event.data.object as Stripe.Invoice);
        break;
    }

    return { received: true };
  }

  private async handleSubscriptionUpdate(stripeSubscription: Stripe.Subscription) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (!subscription) return;

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: {
        status: stripeSubscription.status.toUpperCase() as any,
        currentPeriodStart: new Date(stripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(stripeSubscription.current_period_end * 1000),
      },
    });
  }

  private async handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: stripeSubscription.id },
    });

    if (!subscription) return;

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'CANCELLED' },
    });
  }

  private async handlePaymentSucceeded(invoice: Stripe.Invoice) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: invoice.subscription as string },
    });

    if (!subscription) return;

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'ACTIVE' },
    });
  }

  private async handlePaymentFailed(invoice: Stripe.Invoice) {
    const subscription = await this.prisma.subscription.findFirst({
      where: { stripeSubscriptionId: invoice.subscription as string },
    });

    if (!subscription) return;

    await this.prisma.subscription.update({
      where: { id: subscription.id },
      data: { status: 'PAST_DUE' },
    });
  }

  async getUserSubscription(userId: string) {
    return this.prisma.subscription.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async purchaseSuperLikes(userId: string, count: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const priceMap = {
      5: 199, // $1.99
      10: 299, // $2.99
      25: 599, // $5.99
    };

    const price = priceMap[count as keyof typeof priceMap];
    if (!price) {
      throw new BadRequestException('Invalid super like count');
    }

    // Create payment intent
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: price,
      currency: 'usd',
      customer: user.stripeCustomerId || undefined,
      metadata: {
        userId,
        type: 'super_likes',
        count: count.toString(),
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      amount: price,
    };
  }

  async purchaseBoost(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const paymentIntent = await this.stripe.paymentIntents.create({
      amount: 399, // $3.99
      currency: 'usd',
      customer: user.stripeCustomerId || undefined,
      metadata: {
        userId,
        type: 'boost',
      },
    });

    return {
      clientSecret: paymentIntent.client_secret,
      amount: 399,
    };
  }

  async isUserPremium(userId: string): Promise<boolean> {
    const subscription = await this.prisma.subscription.findFirst({
      where: { 
        userId,
        status: 'ACTIVE',
        currentPeriodEnd: { gte: new Date() },
      },
    });

    return !!subscription;
  }

  async getRemainingLikes(userId: string): Promise<number> {
    const isPremium = await this.isUserPremium(userId);
    if (isPremium) return -1; // Unlimited

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const likesToday = await this.prisma.like.count({
      where: {
        userId,
        createdAt: { gte: today },
        isLike: true,
      },
    });

    return Math.max(0, 10 - likesToday); // 10 likes per day for free users
  }

  async getRemaininguperLikes(userId: string): Promise<number> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { superLikesCount: true },
    });

    return user?.superLikesCount || 0;
  }
}