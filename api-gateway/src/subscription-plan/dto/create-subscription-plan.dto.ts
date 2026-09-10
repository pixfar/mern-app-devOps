import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsObject } from 'class-validator';
import { Currency } from '../../common/enum/enum-currency';
import { SubscribedPlan } from '../../common/enum/enum-subscription-plan';

export class CreateSubscriptionPlanDto {
    @ApiProperty({
        description: 'The name of the subscription plan',
        example: SubscribedPlan.TRIAL_PLAN,
        type: String,
    })
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        description: 'Description of the subscription plan',
        example: { benefits: 'Access to basic features', limitations: 'Limited storage' },
    })
    @IsObject()
    @IsNotEmpty()
    description: Object;

    @ApiProperty({
        description: 'Price of the subscription plan',
        example: 0,
    })
    @IsNumber()
    @IsNotEmpty()
    price: number;

    @ApiProperty({
        description: 'The name of the subscription plan',
        enum: Currency,
        example: Currency.EUR,
    })
    @IsEnum(Currency)
    @IsNotEmpty()
    currency: string;

    @ApiProperty({
        description: 'Discount percentage on the subscription plan',
        example: 0,
    })
    @IsNumber()
    @IsNotEmpty()
    discount: number;

    @ApiProperty({
        description: 'Duration of the subscription plan in days',
        example: 10,
    })
    @IsNumber()
    @IsNotEmpty()
    duration_days: number;

    @ApiProperty({
        description: 'Include Pdf downloads',
        example: 0,
    })
    @IsNumber()
    @IsNotEmpty()
    credit: number;

    @ApiProperty({
        description: 'Is the subscription plan is public',
        example: true,
    })
    @IsBoolean()
    @IsNotEmpty()
    isPublic: Boolean;


    finalPrice: number;
}
