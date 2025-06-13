import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEmailDto } from './dto/create-email.dto';
import * as nodemailer from 'nodemailer';
import { AppointmentDetails } from './interface/appointment-confirm';
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

  async sendStateChangeNotification(email: string) {
    const notification = {
      from: '"Municipalidad de San Juan de Lurigancho" <luriganchomunicipalidad@gmail.com>',
      to: email,
      subject: 'Revisar Estado de Su Trámite',
      text: `Estimado(a) administrado(a),\n\nHemos observado que su trámite requiere atención. Por favor, visite nuestra página web para revisar el estado de su trámite y realizar las correcciones necesarias.\n\n¡Gracias por su colaboración!\n\nSaludos,\nEl equipo de San Juan de Lurigancho`,
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #f4f4f4;">
          
          <!-- Encabezado -->
          <div style="background-color: #2b8cbe; padding: 20px; text-align: center; color: black;">
            <img src="https://web.munisjl.gob.pe/web/images/mdsjl-cambia-contigo.png" alt="Logo" style="max-height: 60px;">  
            <p style="font-size: 16px;">Atención a su Trámite</p>
          </div>
          
          <!-- Cuerpo del correo -->
          <div style="padding: 20px; background-color: #ffffff;">
            <h3 style="color: #333; font-size: 18px; margin-top: 0;">Acción Requerida</h3>
            <p>Estimado(a) administrado(a),</p>
            <p>
              Hemos observado que su trámite requiere atención. Le invitamos a revisar el estado de su trámite y realizar las correcciones necesarias.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL}" target="_blank" style="background-color: #ffcc00; color: white; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: bold; font-size: 16px;">
                Revisar Estado de Trámite
              </a>
            </div>
            <p>¡Gracias por su atención!</p>
            <p>Saludos cordiales,</p>
            <p><strong>El equipo de la Municipalidad de San Juan de Lurigancho</strong></p>
          </div>
          
          <!-- Pie de página -->
          <div style="background-color: #2b8cbe; padding: 10px; text-align: center; color: black;">
            <p style="font-size: 12px; margin: 0;">Municipalidad de San Juan de Lurigancho © 2024</p>
            <p style="font-size: 12px; margin: 0;">Todos los derechos reservados</p>
          </div>
          
        </div>
      </div>
      `,
    };

    return await this.sendEmail(notification);
  }

  async sendVerifiedNotification(email: string) {
    const notification = {
      from: '"Municipalidad de San Juan de Lurigancho" <luriganchomunicipalidad@gmail.com>',
      to: email,
      subject: 'Documentos Verificados',
      text: `Estimado(a) administrado(a),\n\nNos complace informarle que sus documentos han sido revisado con éxito. ahora puede sacar una cita.\n\n¡Gracias por su colaboración!\n\nSaludos,\nEl equipo de San Juan de Lurigancho`,
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #f4f4f4;">
          
          <!-- Encabezado -->
          <div style="background-color: #2b8cbe; padding: 20px; text-align: center; color: black;">
            <img src="https://web.munisjl.gob.pe/web/images/mdsjl-cambia-contigo.png" alt="Logo" style="max-height: 60px;">  
            <p style="font-size: 16px;">Documentos Verificados</p>
          </div>
          
          <!-- Cuerpo del correo -->
          <div style="padding: 20px; background-color: #ffffff;">
            <h3 style="color: #333; font-size: 18px; margin-top: 0;">Verificación Completa</h3>
            <p>Estimado(a) administrado(a),</p>
            <p>
              Nos complace informarle que sus documentos han sido verificados con éxito. Ahora puede sacar una cita.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL}" target="_blank" style="background-color: #28a745; color: white; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-weight: bold; font-size: 16px;">
                Ir a la página
              </a>
            </div>
            <p>¡Gracias por su colaboración!</p>
            <p>Saludos cordiales,</p>
            <p><strong>El equipo de la Municipalidad de San Juan de Lurigancho</strong></p>
          </div>
          
          <!-- Pie de página -->
          <div style="background-color: #2b8cbe; padding: 10px; text-align: center; color: black;">
            <p style="font-size: 12px; margin: 0;">Municipalidad de San Juan de Lurigancho © 2024</p>
            <p style="font-size: 12px; margin: 0;">Todos los derechos reservados</p>
          </div>
          
        </div>
      </div>
      `,
    };

    return await this.sendEmail(notification);
  }

  async sendAppointmentConfirmation(appointment: AppointmentDetails) {
    const {
      isFirstTime,
      email,
      appointmentDate,
      appointmentTime,
      person,
      service,
      recipientName,
    } = appointment;

    let subject = '';
    if (isFirstTime) {
      subject = 'Confirmación de Cita Reservada';
    } else {
      subject = 'Reprogramación de cita';
    }

    const appointmentConfirmation = {
      from: '"Municipalidad de San Juan de Lurigancho" <luriganchomunicipalidad@gmail.com>',
      to: email,
      subject: subject,
      text: `Estimado(a) administrado(a) ${recipientName},\n\nSu cita ha sido ${isFirstTime ? 'programada con éxito' : 'reprogramado'}. A continuación, encontrará los detalles de su cita:\n\n- Fecha: ${appointmentDate}\n- Hora: ${appointmentTime}\n- Persona de contacto: ${person}\n- Servicio: ${service}\n\nPor favor, asegúrese de llegar 10 minutos antes de la hora programada.\n\nGracias por confiar en nosotros.\n\nSaludos cordiales,\nEl equipo de la Municipalidad de San Juan de Lurigancho`,
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #ffffff;">
            
            <!-- Encabezado -->
            <div style="background-color: #00aaff; padding: 20px; text-align: center; color: white;">
              <img src="https://web.munisjl.gob.pe/web/images/mdsjl-cambia-contigo.png" alt="Logo" style="max-height: 60px;">  
              <p style="font-size: 18px;">${subject}</p>
            </div>
            
            <!-- Cuerpo del correo -->
            <div style="padding: 20px;">
              <h3 style="color: #00aaff; font-size: 20px; margin-top: 0;">Detalles de su Cita</h3>
              <p>Estimado(a) <strong>${recipientName}</strong>,</p>
              <p>Nos complace informarle que su cita ha sido ${isFirstTime ? 'reservada exitosamente.' : '<strong>reprogramada</strong>.'}  Aquí están los detalles importantes de su cita:</p>
              <ul style="list-style-type: none; padding: 0; font-size: 16px; color: #000;">
                <li><strong>📅 Fecha:</strong> ${appointmentDate}</li>
                <li><strong>⏰ Hora:</strong> ${appointmentTime}</li>
                <li><strong>👤 Persona de contacto:</strong> ${person}</li>
                <li><strong>💼 Servicio:</strong> ${service}</li>
              </ul>
              <p style="font-size: 16px; margin-top: 20px; background-color: #f1f9ff; padding: 10px; border-left: 4px solid #00aaff;">
                <strong>Recordatorio:</strong> Por favor, llegue al menos 10 minutos antes de la hora programada para evitar inconvenientes.
              </p>
              <p>Gracias por confiar en nuestros servicios. Si tiene alguna consulta adicional, no dude en ponerse en contacto con nosotros.</p>
              <p>Saludos cordiales,</p>
              <p><strong>El equipo de la Municipalidad de San Juan de Lurigancho</strong></p>
            </div>
            
            <!-- Pie de página -->
            <div style="background-color: #00aaff; padding: 10px; text-align: center; color: white;">
              <p style="font-size: 12px; margin: 0;">Municipalidad de San Juan de Lurigancho © 2024</p>
              <p style="font-size: 12px; margin: 0;">Todos los derechos reservados</p>
            </div>
            
          </div>
        </div>
      `,
    };

    return await this.sendEmail(appointmentConfirmation);
  }

  async sendSurvey(email: string) {
    const survey = {
      from: '"Municipalidad de San Juan de Lurigancho" <luriganchomunicipalidad@gmail.com>',
      to: email,
      subject: 'Encuesta de Satisfacción',
      text: `Estimado(a) administrado(a),\n\n¡Gracias por utilizar nuestros servicios! Tu opinión es muy importante para nosotros, ya que nos ayuda a mejorar continuamente. Te invitamos a completar nuestra breve encuesta de satisfacción ¡Agradecemos de antemano tu colaboración!\n\nAquí tienes el enlace: ${process.env.FORM_LINK}\n\n¡Gracias por tu tiempo!\n\nSaludos,\nEl equipo de San Juan de Lurigancho`,
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; background-color: #f4f4f4;">
          
          <!-- Encabezado -->
          <div style="background-color: #2b8cbe; padding: 20px; text-align: center; color: black;">
            <img src="https://web.munisjl.gob.pe/web/images/mdsjl-cambia-contigo.png" alt="Logo" style="max-height: 60px;">  
            <p style="font-size: 16px;">¡Gracias por utilizar nuestros servicios!</p>
          </div>
          
          <!-- Cuerpo del correo -->
          <div style="padding: 20px; background-color: #ffffff;">
            <h3 style="color: #333; font-size: 18px; margin-top: 0;">Queremos saber tu opinión</h3>
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
          <div style="background-color: #2b8cbe; padding: 10px; text-align: center; color: black;">
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
          
          <!-- Encabezado -->
          <header style="background-color: #5cb85c; text-align: center; padding: 20px; border-bottom: 1px solid #eee;">
             <img src="https://web.munisjl.gob.pe/web/images/mdsjl-cambia-contigo.png" alt="Logo" style="max-height: 60px;">
            <p style="font-size: 16px; color: white;">Verificación de correo electrónico</p>
          </header>
          
          <!-- Cuerpo del correo -->
          <main style="padding: 20px 0;">
            <p style="font-size: 16px; color: #333;">Estimado(a) ciudadano(a),</p>
            <p style="font-size: 16px; color: #333;">
              Gracias por registrarte en la Municipalidad de San Juan de Lurigancho. Para completar tu registro, por favor verifica tu correo electrónico haciendo clic en el siguiente botón:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" style="background-color: #5cb85c; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Verificar correo electrónico
              </a>
            </div>
          </main>
          
          <!-- Pie de página -->
          <footer style="background-color: #5cb85c; text-align: center; padding: 20px; font-size: 12px; color: white; border-top: 1px solid #eee;">
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

  async resetPassword(email: string, url: string) {
    const mailOptions = {
      from: '"Municipalidad de San Juan de Lurigancho" <luriganchomunicipalidad@gmail.com>',
      to: email,
      subject: 'Restablecer contraseña',
      html: `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);">
          
          <!-- Encabezado -->
          <header style="background-color: #5cb85c; text-align: center; padding: 20px; border-bottom: 1px solid #eee;">
            <img src="https://web.munisjl.gob.pe/web/images/mdsjl-cambia-contigo.png" alt="Logo" style="max-height: 60px;">
            <p style="font-size: 16px; color: white;">Restablecer Contraseña</p>
          </header>
          
          <!-- Cuerpo del correo -->
          <main style="padding: 20px 0;">
            <p style="font-size: 16px; color: #333;">Estimado(a) ciudadano(a),</p>
            <p style="font-size: 16px; color: #333;">
              Hemos recibido una solicitud para restablecer la contraseña de su cuenta en la Municipalidad de San Juan de Lurigancho. Para proceder, haga clic en el siguiente botón:
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" style="background-color: #5cb85c; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 16px;">
                Restablecer contraseña
              </a>
            </div>
            <p style="font-size: 16px; color: #333;">Si no solicitó este restablecimiento, puede ignorar este correo.</p>
          </main>
          
          <!-- Pie de página -->
          <footer style="background-color: #5cb85c; text-align: center; padding: 20px; font-size: 12px; color: white; border-top: 1px solid #eee;">
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
      console.log(error);
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
}
