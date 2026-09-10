import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Note extends Document {
    // Reference to the user who initiated the conversation
    @Prop({ type: String, ref: 'User', required: true, description: 'The ID of the user who initiated the conversation', example: '507f1f77bcf86cd799439011', index: true })
    userId: string;

    @Prop({ type: String, required: true, description: 'The unique identifier for the conversation', example: 'conv123456', index: true })
    conversationId: string;

    @Prop({ type: String, required: true, description: 'The unique identifier for the response', example: 'resp789012', index: true })
    responseId: string;

    @Prop({ type: String, required: true, description: 'The content of the note', example: 'This is an important note about the project.' })
    text: string;

    @Prop({ type: String, required: false, description: 'The color of the text', example: '#000000' })
    textColor: string;

    @Prop({ type: String, required: false, description: 'The background color of the note', example: '#FFFFFF' })
    backgroundColor: string;

    @Prop({ type: String, required: false, description: 'The size of the font', example: '16px' })
    fontSize: string;

    @Prop({ type: String, required: false, description: 'The font family used for the text', example: 'Arial, sans-serif' })
    fontFamily: string;

    @Prop({ type: String, required: false, description: 'The weight of the font', example: 'bold' })
    fontWeight: string;

    @Prop({ type: String, required: false, description: 'The style of the font', example: 'italic' })
    fontStyle: string;

    @Prop({ type: String, required: false, description: 'The variant of the font', example: 'small-caps' })
    fontVariant: string;

    @Prop({ type: String, required: false, description: 'The alignment of the text', example: 'center' })
    textAlign: string;

    @Prop({ type: String, required: false, description: 'The decoration of the text', example: 'underline' })
    textDecoration: string;

    @Prop({ type: String, required: false, description: 'The text transformation', example: 'uppercase' })
    textTransform: string;

    @Prop({ type: String, required: false, description: 'The indentation of the text', example: '20px' })
    textIndent: string;

    @Prop({ type: String, required: false, description: 'The height of each line of text', example: '1.5' })
    lineHeight: string;

    @Prop({ type: String, required: false, description: 'The spacing between letters', example: '2px' })
    letterSpacing: string;

    @Prop({ type: String, required: false, description: 'The spacing between words', example: '4px' })
    wordSpacing: string;

    @Prop({ type: String, required: false, description: 'How white space inside the element is handled', example: 'nowrap' })
    whiteSpace: string;

    @Prop({ type: String, required: false, description: 'The shadow effect added to the text', example: '2px 2px 4px #000000' })
    textShadow: string;

    @Prop({ type: String, required: false, description: 'How overflowing content that is not displayed is signaled', example: 'ellipsis' })
    textOverflow: string;
}
export const NoteSchema = SchemaFactory.createForClass(Note);
