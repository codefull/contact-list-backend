import {
  Injectable,
  HttpException,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contact } from './contact.model';
import { ContactEntity } from './model/contact.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactEntity)
    private contactRepository: Repository<ContactEntity>,
  ) {}

  async getAllContacts(): Promise<Contact[]> {
    const db_contacts = await this.contactRepository.find();
    const result = db_contacts.map(c => new Contact().fromEntity(c));

    return result;
  }

  async getSingleContact(contactId: string): Promise<Contact> {
    const contact = await this.findContact(contactId);
    return new Contact().fromEntity(contact);
  }

  async findContact(contactId: string): Promise<ContactEntity> {
    const contact = await this.contactRepository.findOne({ id: contactId });
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    return contact;
  }

  async insertContact(
    name: string,
    address: string,
    email: string,
    phone: string,
    avatar: string,
  ) {
    const contact = await this.contactRepository.findOne({ email });
    if (contact) {
      throw new HttpException(
        'Contact given email already exists!',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newContact = new ContactEntity();
    newContact.name = name;
    newContact.address = address;
    newContact.email = email;
    newContact.phone = phone;
    newContact.avatar = avatar;

    const res = await this.contactRepository.save(newContact);

    return { id: res.id };
  }

  async updateContact(
    contactId: string,
    name: string,
    address: string,
    email: string,
    phone: string,
    avatar: string,
  ): Promise<Contact> {
    try {
      const contact = await this.findContact(contactId);

      if (name) {
        contact.name = name;
      }
      if (address) {
        contact.address = address;
      }
      if (email) {
        contact.address = address;
      }
      if (phone) {
        contact.phone = phone;
      }
      if (avatar) {
        contact.avatar = avatar;
      }

      const res = await this.contactRepository.save(contact);
      return new Contact().fromEntity(res);
    } catch (error) {
      
      console.log(JSON.stringify(error));
    }
  }

  async deleteContact(contactId: string): Promise<Contact> {
    const contact = await this.findContact(contactId);
    const result = await this.contactRepository.remove(contact);
    return new Contact().fromEntity(result);
  }
}
