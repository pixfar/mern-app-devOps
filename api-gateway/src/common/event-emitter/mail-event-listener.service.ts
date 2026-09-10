import { Injectable, OnModuleInit } from '@nestjs/common';
import { AuthService } from '../../auth/mail-connection/service/auth.service';
import { CreateUserDto } from '../../user/dto/create-user.dto';
import { RequestEventEmitter } from './event-emitter.service';

import { CreateContactDto } from '../../contact/dto/create-contact.dto';
import { ContactService } from '../../contact/service/contact.service';
;

@Injectable()
export class MailEventListener implements OnModuleInit {
    constructor(
        private readonly authService: AuthService,
        private readonly contactService: ContactService,
        private readonly eventEmitter: RequestEventEmitter,
    ) { }

    onModuleInit() {
        this.eventEmitter.on('sendVerificationMail', async (createUserData: CreateUserDto , currentHostUrl: string) => {
            console.log("Trigger mail sent")
            await this.authService.sendUserRegistrationVerificationCodeMail(createUserData , currentHostUrl);
        });

        this.eventEmitter.on('sendForgotPasswordMail', async (email: any, verificationCode: any) => {
            await this.authService.sendUserPasswordForgotVerificationCodeMail(
                email,
                verificationCode,
            );

        })

        this.eventEmitter.on('sendContactFormMail', async (createContactDto : CreateContactDto) => {
            await this.contactService.sendContactFormMail( createContactDto);

        })
    }
}
