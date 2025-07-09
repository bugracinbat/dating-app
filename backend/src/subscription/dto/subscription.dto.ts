import { IsString, IsNotEmpty, IsNumber, IsIn } from 'class-validator';

export class CreateSubscriptionDto {
  @IsString()
  @IsNotEmpty()
  planId: string;
}

export class PurchaseSuperLikesDto {
  @IsNumber()
  @IsIn([5, 10, 25])
  count: number;
}

export class PurchaseBoostDto {
  // No additional fields needed for boost purchase
}