import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { AxiosAdapter } from 'src/common/adapters/axios-adapter';
import { LoginDocumentUserDto } from './dto/login-document.dto';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly http: AxiosAdapter,
  ) {}

  async create(createUserDto: CreateUserDto) {
    return await this.userService.register(createUserDto);
  }

  async login(loginUserDto: LoginUserDto) {
    const { documentNumber, password } = loginUserDto;
    const plataformaVirtualUrl = process.env.PLATAFORMA_VIRTUAL_API;
    const plataformaVirtualEmail = process.env.PLATAFORMA_VIRTUAL_EMAIL;
    const plataformaVirtualPassword = process.env.PLATAFORMA_VIRTUAL_PASSWORD;

    let userPlataforma: any;
    try {
      const response: any = await this.http.post(
        `${plataformaVirtualUrl}/login-acceso`,
        {
          email: plataformaVirtualEmail,
          password: plataformaVirtualPassword,
        },
      );

      const loginCredentials = {
        codigo: documentNumber,
        password: password,
      };

      const contentHeader = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${response.access_token}`,
      };

      userPlataforma = await this.http.post(
        `${plataformaVirtualUrl}/inicio-sesion`,
        loginCredentials,
        contentHeader,
      );

      if (userPlataforma.codigo === 401) {
        throw new Error('Ha ocurrido un error');
      }
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }

    const user = await this.userService.findByTerm(
      {
        field: 'documentNumber',
        value: documentNumber,
      },
      false,
    );

    if (!user) {
      const newUser = await this.userService.create({
        apellido_materno: userPlataforma.usuario.apellido_materno,
        apellido_paterno: userPlataforma.usuario.apellido_paterno,
        documentNumber: userPlataforma.usuario.numero_documento,
        email: userPlataforma.usuario.email,
        firstName: userPlataforma.usuario.nombres,
        isActive: true,
        password: 'P',
      });
      delete newUser.password;
      return {
        ...newUser,
        token: this.getJwtToken({ id: newUser.id }),
      };
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Cuenta desactivada');
    }

    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async loginDocument(loginDocumentUserDto: LoginDocumentUserDto) {
    const baseUrlCaptcha = process.env.URL_CAPTCHA_VERIFY;
    const secretKeyCaptcha = process.env.SECRET_KEY_CAPTCHA;

    const { documentNumber, captchaToken } = loginDocumentUserDto;

    try {
      const response = await axios.post(
        `${baseUrlCaptcha}/recaptcha/api/siteverify?secret=${secretKeyCaptcha}&response=${captchaToken}`,
      );

      const { success } = response.data;
      if (!success)
        throw new UnauthorizedException('Error al validar Captcha!!');
    } catch (error) {
      console.error('Error verificando CAPTCHA:', error);
      throw new UnauthorizedException('Error al validar Captcha!!');
    }

    const user = await this.userService.findByTerm(
      {
        field: 'documentNumber',
        value: documentNumber,
      },
      false,
    );

    if (!user) {
      const newUser = await this.userService.create({
        apellido_materno: null,
        apellido_paterno: null,
        documentNumber: documentNumber,
        email: null,
        firstName: null,
        isActive: true,
        password: 'P',
      });
      delete newUser.password;
      return {
        ...newUser,
        token: this.getJwtToken({ id: newUser.id }),
      };
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Cuenta desactivada');
    }

    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async verifyToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token);
      const user = await this.userService.findOne(decoded.id);
      if (user) {
        user.isVerified = true;
        return await this.userService.updateVerify(user);
      }
    } catch (error) {
      throw new UnauthorizedException('El token ha expirado, genere nuevo Url');
    }
  }

  async resetPassword(documentNumber: string) {
    const plataformaVirtualUrl = process.env.PLATAFORMA_VIRTUAL_API;
    const plataformaVirtualEmail = process.env.PLATAFORMA_VIRTUAL_EMAIL;
    const plataformaVirtualPassword = process.env.PLATAFORMA_VIRTUAL_PASSWORD;

    try {
      const response: any = await this.http.post(
        `${plataformaVirtualUrl}/login-acceso`,
        {
          email: plataformaVirtualEmail,
          password: plataformaVirtualPassword,
        },
      );

      const contentHeader = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${response.access_token}`,
      };

      const resetPassword: any = await this.http.post(
        `${plataformaVirtualUrl}/recuperar-credenciales?numero_documento=${documentNumber}`,
        null,
        contentHeader,
      );

      if (resetPassword.codigo === 401) {
        throw new Error('Ha ocurrido un error');
      }
      return resetPassword;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(error.message);
    }
  }

  async checkAuthStatus(user: User) {
    delete user.password;
    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private handleDBErrors(error: any): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
  }
}
