import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from '../../common/decorators';
import { UserRole } from '../../common/enum';
import { AuthGuard, RolesGuard } from '../../common/guard';
import { CreateContactDto } from '../dto/create-contact.dto';
import { ContactService } from '../service/contact.service';

@Controller('contact')
@ApiTags('Contact Form')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class ContactController {
  constructor(private readonly contactService: ContactService) { }

  @Post('form')
  @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  async createContactForm(@Body() createContactDto: CreateContactDto) {
    return await this.contactService.createContactForm(createContactDto);
  }
}
