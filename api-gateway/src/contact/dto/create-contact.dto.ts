import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty({
    description: 'Full name of the contact',
    example: 'John Doe',
    required: true
  })
  fullName: string;

  @ApiProperty({
    description: 'Email address of the contact',
    example: 'johndoe@example.com',
    required: true
  })
  email: string;

  @ApiProperty({
    description: 'Subject of the contact message',
    example: 'Inquiry about services',
  })
  subject: string;

  @ApiProperty({
    description: 'Mobile number of the contact',
    example: '+1234567890',
  })
  mobileNumber: string;

  @ApiProperty({
    description: 'Message content from the contact',
    example: 'I would like more information about your services.',
    required: true
  })
  message: string;
}
