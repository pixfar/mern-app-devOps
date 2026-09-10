import { ApiProperty, OmitType, PartialType } from '@nestjs/swagger';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, [
    'email',
    'password',
    'role',
    'subscribedPlan',
    'signingBy',
    'termsAndCondition'
  ] as const),
) {

  @ApiProperty({ example: true, description: 'Whether the user is active', required : false })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({
    type: String,
    format: 'binary',
    required: false,
    description: "URL of the user's profile image",
  })
  profileImage: string;
}
