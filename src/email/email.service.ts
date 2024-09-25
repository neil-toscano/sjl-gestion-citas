import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import { UpdateEmailDto } from './dto/update-email.dto';
import * as nodemailer from 'nodemailer';
@Injectable()
export class EmailService {
  transporter: any;
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.KEY_EMAIL,
      },
    });
  }
  create(createEmailDto: CreateEmailDto) {
    return 'This action adds a new email';
  }

  async sendEmail(email: string) {
    try {
      const info = await this.transporter.sendMail({
        from: '"Municipalidad de San Juan de Lurigancho" <neil.toscano.f@uni.pe>', // sender address
        to: email,
        subject: "Encuesta de satisfacción",
        text: `Estimado(a) administrado(a),\n\n¡Gracias por utilizar nuestros servicios! Tu opinión es muy importante para nosotros, ya que nos ayuda a mejorar continuamente. Te invitamos a completar nuestra breve encuesta de satisfacción ¡Agradecemos de antemano tu colaboración!\n\nAquí tienes el enlace: ${process.env.FORM_LINK}\n\n¡Gracias por tu tiempo!\n\nSaludos,\nEl equipo de San Juan de Lurigancho`
      });

    } catch (error) {
      throw new BadRequestException(`Error al enviar el correo`);
    }

    return {
      ok: true,
      msg: "Correo enviado correctamente",
    };
  
  }
  findAll() {
    return `This action returns all email`;
  }

  findOne(id: number) {
    return `This action returns a #${id} email`;
  }

  update(id: number, updateEmailDto: UpdateEmailDto) {
    return `This action updates a #${id} email`;
  }

  remove(id: number) {
    return `This action removes a #${id} email`;
  }
}
