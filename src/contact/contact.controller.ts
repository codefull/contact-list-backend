import { Controller, Post } from '@nestjs/common';

@Controller('contact')
export class ContactController {
  @Post()
  addContact(): any {
    return {};
  }
}
