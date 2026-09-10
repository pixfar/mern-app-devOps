import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class ValidateAndUpdateExistingPasswordDto {
  @ApiProperty({ type: String, example: 'password123', required: true })
  @IsNotEmpty()
  currentPassword: string;

  @ApiProperty({ type: String, example: 'newPassword123', required: true })
  @IsNotEmpty()
  newPassword: string;
}
