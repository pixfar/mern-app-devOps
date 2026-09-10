import { IsString, IsArray, ValidateNested, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

class ContentDto {
  @IsString()
  str: string;

  @IsString()
  dir: string;

  @IsNumber()
  width: number;

  @IsNumber()
  height: number;

  @IsArray()
  @IsNumber({}, { each: true })
  transform: number[];

  @IsString()
  fontName: string;

  @IsBoolean()
  hasEOL: boolean;
}

export class CreateLawDto {
  @IsString()
  documentTitle: string;

  @IsString()
  sectionTitle: string;

  @IsString()
  law: string;

  @IsString()
  pdfName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentDto)
  contents: ContentDto[];
}
