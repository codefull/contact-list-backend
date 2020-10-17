import { ContactEntity } from './model/contact.entity';

//TODO: Validate with class-validator annotations

export class Contact {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  avatar: string;

  from(c: Partial<Contact>) {
    const res = new Contact();
    res.id = c.id ? c.id : '';
    res.name = c.name ? c.name : '';
    res.address = c.address ? c.address : '';
    res.email = c.email ? c.email : '';
    res.phone = c.phone ? c.phone : '';
    res.avatar = c.avatar ? c.avatar : '';

    return res;
  }

  /**
   * @summary Convert a Contact Entity to its respective Data Transfer Object
   * @param e Contact Entity instance
   */
  fromEntity(e: ContactEntity) {
    return this.from({
      id: e.id,
      name: e.name,
      address: e.address,
      email: e.email,
      phone: e.phone,
      avatar: e.avatar
    });
  }
  
}
