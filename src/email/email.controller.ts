import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { EmailService } from './email.service';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import { Auth } from 'src/auth/decorators';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post()
  create(@Body() createEmailDto: CreateEmailDto) {
    return this.emailService.create(createEmailDto);
  }
  
  @Post('send')
  @Auth()
  sendEmail(@Query('email') email: string) {
    return this.emailService.sendEmail(email);
  }



  @Get()
  findAll() {
    return this.emailService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.emailService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEmailDto: UpdateEmailDto) {
    return this.emailService.update(+id, updateEmailDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.emailService.remove(+id);
  }
}
