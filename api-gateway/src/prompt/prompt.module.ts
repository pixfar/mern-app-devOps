import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { getRmqHost } from '../common/constants/rmq.connection';
import { PromptController } from './controller/prompt.controller';
import { Note, NoteSchema } from './entities/note.entity';
import { Conversation, ConversationSchema } from './entities/prompt.entity';
import { DocumentExportService } from './service/document-export.service';
import { PromptService } from './service/prompt.service';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'MODEL_SERVICE',
                transport: Transport.RMQ,
                options: {
                    urls: [`amqp://${getRmqHost()}:5672`],
                    queue: 'model-service',
                    queueOptions: {
                        durable: true,
                    },
                },
            },
        ]),
        MongooseModule.forFeature([{ name: Conversation.name, schema: ConversationSchema }]),
        MongooseModule.forFeature([{ name: Note.name, schema: NoteSchema }]),
        SubscriptionModule
    ],
    controllers: [PromptController],
    providers: [PromptService, DocumentExportService],
})
export class PromptModule { }
