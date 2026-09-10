import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { SubscribedPlan } from 'src/common/enum/enum-subscription-plan';
import { UserSigningBy } from '../../common/enum/enum-signing-by-social-id';
import { UserRole } from '../../common/enum/enum-user-role';

export class SubscribedPlanDto {
  @ApiProperty({ enum: SubscribedPlan, default: SubscribedPlan.TRIAL_PLAN })
  @IsEnum(SubscribedPlan)
  @IsNotEmpty()
  planName: string;
}

export class CreateUserDto {
  @ApiProperty({ example: 'John', description: 'First name of the user' })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({ example: 'Doe', description: 'Last name of the user' })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'excel.azmin@gmail.com',
    description: 'Email address of the user',
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password123', description: 'Password for the user' })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    example: '1990-01-01',
    description: 'Date of birth of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  dateOfBirth: string;

  @ApiProperty({
    example: '1234567890',
    description: 'Mobile number of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  mobileNumber: string;

  @ApiProperty({
    example: '12345',
    description: 'Zip code of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  zipCode: string;

  @ApiProperty({
    example: '123 Main St, City',
    description: 'Address of the user',
    required: false,
  })
  @IsOptional()
  @IsString()
  address: string;



  @ApiProperty({
    example: true,
    description: 'Acceptance of terms and conditions',
  })
  @IsNotEmpty()
  @IsBoolean()
  termsAndCondition: boolean;

  @ApiProperty({
    enum: UserRole,
    example: UserRole.USER,
    description: 'Role assigned to the user',
  })
  @IsNotEmpty()
  @IsEnum(UserRole)
  role: string;

  @ApiProperty({ type: SubscribedPlanDto, required: false })
  @IsOptional()
  subscribedPlan: SubscribedPlanDto;

  @IsNotEmpty()
  @ApiProperty({
    enum: UserSigningBy,
    example: UserSigningBy.DEFAULT_CONNECTION,
    description: 'Methods used for user sign-in',
  })
  signingBy: UserSigningBy;
}
