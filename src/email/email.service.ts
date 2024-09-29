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

  async sendSurvey(email: string) {
    const survey = {
      from: '"Municipalidad de San Juan de Lurigancho" <luriganchomunicipalidad@gmail.com>',
      to: email,
      subject: "Encuesta de Satisfacción",
      text: `Estimado(a) administrado(a),\n\n¡Gracias por utilizar nuestros servicios! Tu opinión es muy importante para nosotros, ya que nos ayuda a mejorar continuamente. Te invitamos a completar nuestra breve encuesta de satisfacción ¡Agradecemos de antemano tu colaboración!\n\nAquí tienes el enlace: ${process.env.FORM_LINK}\n\n¡Gracias por tu tiempo!\n\nSaludos,\nEl equipo de San Juan de Lurigancho`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #f4f4f4;">
            
            <!-- Encabezado -->
            <div style="background-color: #2b8cbe; padding: 20px; text-align: center; color: white;">
              <h2 style="margin: 0;">Municipalidad de San Juan de Lurigancho</h2>
              <p style="font-size: 16px;">¡Gracias por utilizar nuestros servicios!</p>
            </div>
            
            <!-- Cuerpo del correo -->
            <div style="padding: 20px; background-color: #ffffff;">
              <h3 style="color: #2b8cbe; font-size: 18px; margin-top: 0;">Queremos saber tu opinión</h3>
              <p>Estimado(a) administrado(a),</p>
              <p>
                Tu opinión es muy importante para nosotros. Nos encantaría que nos ayudaras a mejorar
                completando una breve encuesta de satisfacción. ¡Agradecemos de antemano tu colaboración!
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.FORM_LINK}" target="_blank" style="background-color: #2b8cbe; color: white; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: bold; font-size: 16px;">
                  Completar Encuesta
                </a>
              </div>
              <p>¡Gracias por tu tiempo y por ayudarnos a mejorar continuamente!</p>
              <p>Saludos cordiales,</p>
              <p><strong>El equipo de la Municipalidad de San Juan de Lurigancho</strong></p>
            </div>
            
            <!-- Pie de página -->
            <div style="background-color: #2b8cbe; padding: 10px; text-align: center; color: white;">
              <p style="font-size: 12px; margin: 0;">Municipalidad de San Juan de Lurigancho © 2024</p>
              <p style="font-size: 12px; margin: 0;">Todos los derechos reservados</p>
            </div>
            
          </div>
        </div>
      `,
    };
  
    return await this.sendEmail(survey);
  }
  

  async sendVerificationEmail(email: string, url: string) {
    const mailOptions = {
      from: '"Municipalidad de San Juan de Lurigancho" <luriganchomunicipalidad@gmail.com>',
      to: email,
      subject: 'Verifica tu correo electrónico',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);">
            <header style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee;">
              <h1 style="color: #007bff; font-size: 24px;">Municipalidad de San Juan de Lurigancho</h1>
              <p style="font-size: 16px; color: #555;">Verificación de correo electrónico</p>
            </header>
            <main style="padding: 20px 0;">
              <p style="font-size: 16px; color: #333;">Estimado(a) ciudadano(a),</p>
              <p style="font-size: 16px; color: #333;">
                Gracias por registrarte en la Municipalidad de San Juan de Lurigancho. Para completar tu registro, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:
              </p>
              <div style="text-align: center; margin: 30px 0;">
                <a href="${url}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                  Verificar correo electrónico
                </a>
              </div>
            </main>
            <footer style="text-align: center; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #999;">
              <p>© 2024 Municipalidad de San Juan de Lurigancho</p>
              <p>
                Dirección: Av. Próceres de la Independencia 1564, San Juan de Lurigancho, Lima, Perú
              </p>
            </footer>
          </div>
        </div>
      `,
    };
  
    return await this.sendEmail(mailOptions);
  }
  

  async sendEmail(mailOptions: any) {

    try {
      await this.transporter.sendMail(mailOptions);
    } catch (error) {
      throw new BadRequestException(`Error al enviar el correo`);
    }
    return {
      statusCode: 201,
      message: 'Correo enviado correctamente',
      data: {
        emailSent: true,
      },
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
