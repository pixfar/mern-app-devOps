import { forwardRef, Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/mail-connection/auth.module';
import { RequestEventEmitter } from './event-emitter.service';
import { MailEventListener } from './mail-event-listener.service';
import { ContactModule } from 'src/contact/contact.module';

@Module({
  imports: [forwardRef(() => AuthModule), forwardRef(() => ContactModule,)],
  providers: [RequestEventEmitter, MailEventListener],
  exports: [RequestEventEmitter,]
})
export class RequestEventEmitterModule { }
