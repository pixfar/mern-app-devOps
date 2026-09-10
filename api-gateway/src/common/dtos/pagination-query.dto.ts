import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { SortBy } from '../enum/enum-sort-by';

export class PaginationQueryDto {
    @ApiPropertyOptional({ description: 'Page number', example: 1 })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Number of items per page', example: 10 })
    @IsOptional()
    @IsInt()
    @Type(() => Number)
    @Min(1)
    limit?: number = 10;

    @ApiPropertyOptional({ description: 'Field to sort by', example: 'createdAt' })
    @IsOptional()
    @IsString()
    sort?: string = 'createdAt';

    @ApiPropertyOptional({ description: 'Order of sorting', example: SortBy.DESC })
    @IsOptional()
    @IsEnum(SortBy)
    order?: SortBy = SortBy.DESC;

    @ApiPropertyOptional({ description: 'Search term', example: 'John' })
    @IsOptional()
    @IsString()
    search?: string;

    @ApiPropertyOptional({ description: 'Start date for filtering', example: '2023-01-01' })
    @IsOptional()
    @Type(() => Date)
    startDate?: Date;

    @ApiPropertyOptional({ description: 'End date for filtering', example: '2023-12-31' })
    @IsOptional()
    @Type(() => Date)
    endDate?: Date;
}
