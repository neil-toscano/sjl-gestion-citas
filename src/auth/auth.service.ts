import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { LoginUserDto, CreateUserDto } from './dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { EmailService } from 'src/email/email.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    delete user.password;
    const token = this.getJwtToken({ id: user.id });
    const verificationLink = `${process.env.APP_URL}/auth/verify-email?token=${token}`;

    await this.emailService.sendVerificationEmail(user.email, verificationLink);

    return {
      ...user,
      token,
    };
  }

  async login(loginUserDto: LoginUserDto) {
    const { firstName, documentNumber, email } = loginUserDto;

    const user = await this.userService.findByTerm({
      field: 'documentNumber',
      value: documentNumber,
    }, false);
   

    
    if (!user) {
      const newUser = await this.userService.create(loginUserDto);
      return {
        ...newUser,
        token: this.getJwtToken({ id: user.id }),
      }
    }

    return {
      ...user,
      token: this.getJwtToken({ id: user.id }),
    }

      // throw new UnauthorizedException('Credentials are not valid (dni)');
    // if (!bcrypt.compareSync(password, user.password))
    //   throw new UnauthorizedException('Credentials are not valid (password)');
    // if (!user.isVerified) {
    //   const token = this.getJwtToken({ id: user.id });
    //   const verificationLink = `${process.env.APP_URL}/auth/verify-email?token=${token}`;

    //   await this.emailService.sendVerificationEmail(
    //     user.email,
    //     verificationLink,
    //   );

    //   return {
    //     message:
    //       'Por favor, verifica tu correo electrónico antes de iniciar sesión.',
    //     emailVerified: false,
    //   };
    // }

    // return {
    //   ...user,
    //   password: ':P',
    //   token: this.getJwtToken({ id: user.id }),
    //   emailVerified: true,
    // };
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

  async resetPassword(email: string) {
    const user = await this.userService.findByTerm({
      field: 'email',
      value: email,
    });

    const token = this.getJwtToken({ id: user.id });
    const verificationLink = `${process.env.APP_URL}/auth/reset-password?token=${token}`;

    return await this.emailService.resetPassword(user.email, verificationLink);
  }

  async setPassword(token: string, password: string) {
    const decoded = this.jwtService.verify(token);
    const user = await this.userService.findOne(decoded.id);
    return await this.userService.updatePassword(user, password);
  }

  async checkAuthStatus(user: User) {
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
