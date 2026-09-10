import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RequestEventEmitter } from '../../common/event-emitter/event-emitter.service';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MailerService } from '@nestjs-modules/mailer';
import { CONTACT_FORM_MAIL, CoreConfigService } from '../../common/config/core';
import { Contact } from '../entities/contact.entity';
import { CreateContactDto } from '../dto/create-contact.dto';
import { CONTACT_MAIL_SENT_SUCCESSFULLY, createApiResponse, SUCCESS_RESPONSE, VERIFICATION_MAIL_SENT_SUCCESSFULLY } from '../../common/constants';

@Injectable()
export class ContactService {

  constructor(
    @InjectModel(Contact.name) private readonly userModel: Model<Contact>,
    private readonly eventEmitter: RequestEventEmitter,
    private readonly mailService: MailerService,
    private readonly config: CoreConfigService,
  ) { }


  async createContactForm(createContactDto: CreateContactDto) {

    try{
      this.eventEmitter.emit('sendContactFormMail', createContactDto);

      const contact = new this.userModel(createContactDto);
      await contact.save();
  
      // const response_payload =
      //   await this.sendUserRegistrationVerificationCodeMail(createUserData);
  
      return createApiResponse(
        HttpStatus.OK,
        SUCCESS_RESPONSE,
        CONTACT_MAIL_SENT_SUCCESSFULLY,
        contact,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }


  async sendContactFormMail(createContactDto: CreateContactDto) {
    try {
      await this.mailService.sendMail({
        to: this.config.get(CONTACT_FORM_MAIL),
        subject: 'Contact Form Submission',
        text: `You have received a new contact submission:
        
        Full Name: ${createContactDto.fullName}
        Email: ${createContactDto.email}
        Subject: ${createContactDto.subject}
        Mobile Number: ${createContactDto.mobileNumber || 'N/A'}
        Message: ${createContactDto.message || 'No message provided.'}
        `,
        html: `
          <h3>New Contact Submission</h3>
          <p><strong>Full Name:</strong> ${createContactDto.fullName}</p>
          <p><strong>Email:</strong> ${createContactDto.email}</p>
          <p><strong>Subject:</strong> ${createContactDto.subject}</p>
          <p><strong>Mobile Number:</strong> ${createContactDto.mobileNumber || 'N/A'}</p>
          <p><strong>Message:</strong> ${createContactDto.message || 'No message provided.'}</p>
        `,
      });

      const response_payload = {
        email: createContactDto.email,
        message: 'Contact form mail sent successfully!',
      }
      return createApiResponse(
        HttpStatus.OK,
        SUCCESS_RESPONSE,
        CONTACT_MAIL_SENT_SUCCESSFULLY,
        response_payload,
      );
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
