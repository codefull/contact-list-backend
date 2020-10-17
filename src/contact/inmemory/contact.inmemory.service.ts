import { Injectable, NotFoundException } from '@nestjs/common';
import { Contact } from '../contact.model';

@Injectable()
export class ContactService {
  contacts: Contact[] = [];

  getAllContacts(): Contact[] {
    return this.contacts;
  }

  getSingleContact(contactId: string): Contact {
    const contact = this.findContact(contactId)[0];
    return { ...contact };
  }

  findContact(contactId: string): [Contact, number] {
    const contactIndex = this.contacts.findIndex(c => c.id === contactId);
    const contact = this.contacts[contactIndex];
    if (!contact) {
      throw new NotFoundException('Contact not found');
    }
    return [contact, contactIndex];
  }

  insertContact(name: string, address: string, email: string, phone: string) {
    const newContact = new Contact(
      new Date().toString(),
      name,
      address,
      phone,
      email,
    );
    const generatedID = this.contacts.push(newContact);

    return { id: generatedID };
  }

  updateContact(
    contactId: string,
    name: string,
    address: string,
    email: string,
    phone: string,
  ): Contact {
    const [contact, index] = this.findContact(contactId);

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

    this.contacts[index] = contact;
    return contact;
  }

  deleteContact(contactId: string): Contact {
    const [, index] = this.findContact(contactId);
    const result = this.contacts.splice(index, 1);
    return result[0];
  }
}
