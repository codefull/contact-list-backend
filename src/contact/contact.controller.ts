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


// localhost:3000/contact
@Controller('contact')
export class ContactController {
  constructor(private readonly contactsService: ContactService) {}

  @Get()
  async getContacts(): Promise<Contact[]> {
    return this.contactsService.getAllContacts();
  }
// localhost:3000/contact/:id
  @Get(':id')
  async getContact(
    @Param('id') contactId: string,
    @Res() res: Response,
  ): Promise<Response<{ data: Contact; error: any }>> {
    try {
      const contact = await this.contactsService.getSingleContact(contactId);
      let response;
      if (!contact) {
        response = res.status(HttpStatus.NOT_FOUND).json({
          data: {},
          error: {
            message: 'Contact Not Found',
          },
        });
      } else {
        response = res.status(HttpStatus.OK).json({
          data: { ...contact },
        });
      }

      return response;
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        data: [],
        error: {
          message: error.message,
        },
      });
    }
  }

  @Post()
  async addContact(
    @Body('name') cname: string,
    @Body('address') caddress: string,
    @Body('email') cemail: string,
    @Body('phone') cphone: string,
    @Body('avatar') cavatar: string,
    @Res() res: Response,
  ): Promise<Response<{ data: { id: string }; error: any }>> {
    if (
      this.emptyFields('valid', cname, caddress, cemail, cphone, cavatar, false)
    )
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: { id: '' },
        error: {
          message:
            'All fields are required (name, address, email, phone, avatar)',
        },
      });

    try {
      const idObj = await this.contactsService.insertContact(
        cname,
        caddress,
        cemail,
        cphone,
        cavatar,
      );
      return res.status(HttpStatus.OK).json({ data: { ...idObj } });
    } catch (error) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: { id: '' },
        error: { message: `${error.message}` },
      });
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
    @Res() res: Response,
  ): Promise<Response<{ data: Contact; error: any }>> {
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
        data: { id: '' },
        error: { message: 'There must be at least one valid field' },
      });

    const c = await this.contactsService.updateContact(
      contactId,
      cname,
      caddress,
      cemail,
      cphone,
      cavatar,
    );
    return res.status(HttpStatus.OK).json({ data: { ...c } });
  }

  @Delete(':id')
  async deleteContact(
    @Param('id') contactId: string,
    @Res() res: Response,
  ): Promise<Response<{ data: Contact; error: any }>> {
    if (!contactId) {
      return res.status(HttpStatus.BAD_REQUEST).json({
        data: { id: '' },
        error: { message: 'Invalid field (id)' },
      });
    }
    const contact = await this.contactsService.deleteContact(contactId);
    return res.status(HttpStatus.OK).json({ data: { ...contact } });
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
