import { forwardRef, Module } from '@nestjs/common';

import { RequestEventEmitterModule } from '../common/event-emitter/event-emitter.module';
import { ContactController } from './controller/contact.controller';
import { ContactService } from './service/contact.service';
import { JWTAuthModule } from '../common/module';
import { MongooseModule } from '@nestjs/mongoose';
import { Contact, ContactSchema } from './entities/contact.entity';

@Module({
  imports: [JWTAuthModule,
    MongooseModule.forFeature([{ name: Contact.name, schema: ContactSchema }]),
    forwardRef(() => RequestEventEmitterModule)],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [ContactService]
})
export class ContactModule {}
