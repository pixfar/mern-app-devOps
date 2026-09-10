import { ApiProperty } from '@nestjs/swagger';

export class ProcessDocumentDto {
    @ApiProperty({
        format: 'binary',
        description: 'Pdf Document',
        required: false,
    })
    document: string;
}

export class ResearchLawDto {
    @ApiProperty({
        format: 'binary',
        description: 'Pdf Document',
        required: false,
    })
    document: string;
}
