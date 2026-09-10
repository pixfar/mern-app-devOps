import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class PurchaseCreditPaymentDto {
    @ApiProperty({
        required: true,
    })
    @IsNotEmpty()
    @IsNumber()
    numberOfCredit: number;
}
