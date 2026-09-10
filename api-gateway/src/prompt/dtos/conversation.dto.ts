import { ApiProperty } from "@nestjs/swagger";

export class ConversationRenameDto {
    @ApiProperty({
        type: String,
        description: 'Desired name of the conversation',
        required: true,
    })
    name: string;
}
