import { ApiProperty } from '@nestjs/swagger'
import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator'

export class CreateSettingDto {
  @ApiProperty({ example: 0.1, description: 'Price per credit' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  creditPrice: number

  @ApiProperty({ example: 20, description: 'Purchase tax percentage', default: 18 })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  purchaseTaxPercentage: number

  @ApiProperty(
    {
      type: String,
      format: 'binary',
      description: 'URL of the logo',
      required: false
    }
  )
  @IsOptional()
  @IsString()
  logo: string

  @ApiProperty({ example: 'My App', description: 'Name of the application', required: false })
  @IsOptional()
  @IsString()
  appName: string

  @ApiProperty({ example: '#FF0000', description: 'Primary color of the application', required: false })
  @IsOptional()
  @IsString()
  primaryColor: string

  @ApiProperty({ example: '#00FF00', description: 'Secondary color of the application', required: false })
  @IsOptional()
  @IsString()
  secondaryColor: string

  @ApiProperty({ example: false, description: 'Whether the application is in maintenance mode', default: false })
  @IsOptional()
  @IsBoolean()
  maintenanceMode: boolean

  @ApiProperty({ example: 'Privacy policy content...', description: 'Privacy policy text', required: false })
  @IsOptional()
  @IsString()
  privacyPolicy: string

  @ApiProperty({ example: 'Terms of service content...', description: 'Terms of service text', required: false })
  @IsOptional()
  @IsString()
  termsOfService: string

  @ApiProperty({ example: 10485760, description: 'Maximum upload size in bytes', default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxUploadSize: number

}
