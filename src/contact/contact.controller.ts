import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ContactService } from './contact.service';
import { Contact } from './contact.model';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactsService: ContactService) {}

  @Get()
  async getContacts(): Promise<Contact[]> {
    return this.contactsService.getAllContacts();
  }

  @Get(':id')
  async getContact(@Param('id') contactId: string): Promise<Contact> {
    const contact = this.contactsService.getSingleContact(contactId);
    return contact;
  }

  @Post()
  async addContact(
    @Body('name') cname: string,
    @Body('address') caddress: string,
    @Body('email') cemail: string,
    @Body('phone') cphone: string,
    @Body('avatar') cavatar: string,
    @Res() res: Response,
  ): Promise<Response<{ id: string }>> {
    if ( this.emptyFields('valid', cname, caddress, cemail, cphone, cavatar, false))
      return res.status(HttpStatus.BAD_REQUEST).json({
        id: 'All fields are required (name, address, email, phone, avatar)',
      });

    try {
      const idObj = await this.contactsService.insertContact(
        cname,
        caddress,
        cemail,
        cphone,
        cavatar,
      );
      return res.status(HttpStatus.OK).json({ ...idObj });
    } catch (error) {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .json({ id: `${error.message}` });
    }
  }

  @Patch(':id')
  async updateContact(
    @Param('id') contactId: string,
    @Body('name') cname: string,
    @Body('address') caddress: string,
    @Body('email') cemail: string,
    @Body('phone') cphone: string,
    @Body('avatar') cavatar: string,
    @Res() res: Response
  ): Promise<Response<Contact>> {
    if (
      this.emptyFields(
        contactId,
        cname,
        caddress,
        cemail,
        cphone,
        cavatar,
        true,
      )
    )
    return res.status(HttpStatus.BAD_REQUEST).json({
      id: 'There must be at least one valid field',
    });  
    
    const c = await this.contactsService.updateContact(
      contactId,
      cname,
      caddress,
      cemail,
      cphone,
      cavatar,
    );
    return res.status(HttpStatus.OK).json({ ...c });
  }

  @Delete(':id')
  async deleteContact(@Param('id') contactId: string, @Res() res: Response
  ): Promise<Response<Contact>> {
    if (!contactId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        id: 'Invalid field (id)',
      }); 
    }
    const contact = await this.contactsService.deleteContact(contactId);
    return res.status(HttpStatus.OK).json({ ...contact });
  }

  emptyFields(
    contactId: string,
    cname: string,
    caddress: string,
    cemail: string,
    cphone: string,
    cavatar: string,
    all = true,
  ) {
    return all
      ? !contactId && !cname && !caddress && !cemail && !cphone && !cavatar
      : !contactId || !cname || !caddress || !cemail || !cphone || !cavatar;
  }
}
