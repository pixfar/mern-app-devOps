import { ApiProperty, PartialType } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber } from "class-validator";
import { CreateSubscriptionDto } from "./create-subscription.dto";

export class CreatePurchaseCreditDto extends PartialType(CreateSubscriptionDto) {
  // @ApiProperty({
  //   required: true,
  // })
  // @IsNotEmpty()
  // @IsNumber()
  // numberOfCredit: number;
}