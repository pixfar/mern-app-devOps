import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Conversation extends Document {
    // Reference to the user who initiated the conversation
    @Prop({ type: String, ref: 'User', required: true, index: true })
    user: string;

    @Prop({ type: String, required: true })
    name: string;

    @Prop({ type: String, required: false })
    description: string;


    @Prop({ type: Boolean, required: false, default: false })
    streamCompleted: boolean;

    @Prop({
        type: [{
            _id: { type: String, default: () => new mongoose.Types.ObjectId().toString() },
            probableLine: String,
            probablePage: String,
            fullLine_String: String,
            match: String,
            section: { type: String, required: true },
            subsection: { type: String, required: false },
            sentence: { type: String, required: false },
            number: { type: String, required: false },
            alternative: { type: String, required: false },
            additionalParagraph: { type: String, required: false },
            law: { type: String, required: true },
            result: {
                sectionTitle: { type: String, required: false },
                documentTitle: { type: String, required: false },
                pdfName: { type: String, required: false },
                law: String,
                contents: [{
                    str: String,
                    dir: String,
                    width: Number,
                    height: Number,
                    transform: [Number],
                    fontName: String,
                    hasEOL: Boolean,
                    _id: String
                }],
                contents_string: String
            },
            note: { type: mongoose.Schema.Types.Mixed, required: false }
        }]
    })
    responses: Array<{
        _id: string;
        probableLine: string;
        probablePage: string;
        fullLine_String: string;
        match: string;
        section: string;
        subsection?: string;
        sentence?: string;
        number?: string;
        alternative?: string;
        additionalParagraph?: string;
        law: string;
        result: {
            sectionTitle?: string;
            documentTitle?: string;
            pdfName?: string;
            law: string;
            contents: Array<{
                str: string;
                dir: string;
                width: number;
                height: number;
                transform: number[];
                fontName: string;
                hasEOL: boolean;
                _id: string;
            }>;
            contents_string: string;
        };
        note?: any;
    }>;

}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);
