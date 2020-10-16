import { Injectable } from '@nestjs/common';
import { Contact } from './contact.model';

@Injectable()
export class ContactService {
  contacts: Contact[] = [];
}
