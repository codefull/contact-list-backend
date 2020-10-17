import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ContactService } from './contact.service';
import { Contact } from './contact.model';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactsService: ContactService) {}

  @Get()
  getContacts(): Contact[] {
    return this.contactsService.getAllContacts();
  }

  @Get(':id')
  getContact(@Param('id') contactId: string): Contact {
    const contact = this.contactsService.getSingleContact(contactId);
    return { ...contact };
  }

  @Post()
  addContact(
    @Body('name') cname: string,
    @Body('address') caddress: string,
    @Body('email') cemail: string,
    @Body('phone') cphone: string,
  ): any {
    const generatedId = this.contactsService.insertContact(
      cname,
      caddress,
      cemail,
      cphone,
    );
    return { id: generatedId };
  }

  @Patch(':id')
  updateContact(
    @Param('id') contactId: string,
    @Body('name') cname: string,
    @Body('address') caddress: string,
    @Body('email') cemail: string,
    @Body('phone') cphone: string,
  ): Contact {
    const c = this.contactsService.updateContact(
      contactId,
      cname,
      caddress,
      cemail,
      cphone,
    );
    return { ...c };
  }

  @Delete(':id')
  deleteContact(@Param('id') contactId: string): Contact {
    const contact = this.contactsService.deleteContact(contactId);
    return { ...contact };
  }
}
