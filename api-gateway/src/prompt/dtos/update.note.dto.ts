
import { ApiProperty } from "@nestjs/swagger";

export class UpdateNoteDto {
    @ApiProperty({
        type: String,
        description: 'Text content of the note',
        required: false,
    })
    text?: string;

    @ApiProperty({
        type: String,
        description: 'Text color of the note',
        required: false,
    })
    textColor?: string;

    @ApiProperty({
        type: String,
        description: 'Background color of the note',
        required: false,
    })
    backgroundColor?: string;

    @ApiProperty({
        type: String,
        description: 'Font size of the note',
        required: false,
    })
    fontSize?: string;

    @ApiProperty({
        type: String,
        description: 'Font family of the note',
        required: false,
    })
    fontFamily?: string;

    @ApiProperty({
        type: String,
        description: 'Font weight of the note',
        required: false,
    })
    fontWeight?: string;

    @ApiProperty({
        type: String,
        description: 'Font style of the note',
        required: false,
    })
    fontStyle?: string;

    @ApiProperty({
        type: String,
        description: 'Font variant of the note',
        required: false,
    })
    fontVariant?: string;

    @ApiProperty({
        type: String,
        description: 'Text alignment of the note',
        required: false,
    })
    textAlign?: string;

    @ApiProperty({
        type: String,
        description: 'Text decoration of the note',
        required: false,
    })
    textDecoration?: string;

    @ApiProperty({
        type: String,
        description: 'Text transform of the note',
        required: false,
    })
    textTransform?: string;

    @ApiProperty({
        type: String,
        description: 'Text indent of the note',
        required: false,
    })
    textIndent?: string;

    @ApiProperty({
        type: String,
        description: 'Line height of the note',
        required: false,
    })
    lineHeight?: string;

    @ApiProperty({
        type: String,
        description: 'Letter spacing of the note',
        required: false,
    })
    letterSpacing?: string;

    @ApiProperty({
        type: String,
        description: 'Word spacing of the note',
        required: false,
    })
    wordSpacing?: string;

    @ApiProperty({
        type: String,
        description: 'White space handling of the note',
        required: false,
    })
    whiteSpace?: string;

    @ApiProperty({
        type: String,
        description: 'Text shadow of the note',
        required: false,
    })
    textShadow?: string;

    @ApiProperty({
        type: String,
        description: 'Text overflow handling of the note',
        required: false,
    })
    textOverflow?: string;
}
