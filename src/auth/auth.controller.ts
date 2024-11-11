import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Headers,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IncomingHttpHeaders } from 'http';

import { AuthService } from './auth.service';
import { RawHeaders, GetUser, Auth } from './decorators';
import { RoleProtected } from './decorators/role-protected.decorator';

import { CreateUserDto, LoginUserDto } from './dto';
import { UserRoleGuard } from './guards/user-role.guard';
import { ValidRoles } from './interfaces';
import { User } from 'src/user/entities/user.entity';
import { UpdatePassword } from 'src/common/dtos/password';
import { Throttle } from '@nestjs/throttler';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  @Throttle({ default: { limit: 3, ttl: 100000 } })
  loginUser(@Body() loginUserDto: LoginUserDto, @Req() request: Request) {
    const ipAddress = request.ip || request.headers['x-forwarded-for'] || 'IP no disponible';
    console.log('IP del usuario:', ipAddress);
    return this.authService.login(loginUserDto);
  }

  @Post('verify-email')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyToken(token);
  }

  // @Post('reset-password')
  // resetPassword(@Query('email') email: string) {
  //   return this.authService.resetPassword(email);
  // }
  @Post('reset-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  resetPassword(@Query('numero_documento') numero_documento: string) {
    return this.authService.resetPassword(numero_documento);
  }

  // @Post('set-password')
  // setPassword(
  //   @Query('token') token: string,
  //   @Body() updatePassword: UpdatePassword,
  // ) {
  //   return this.authService.setPassword(token, updatePassword.password);
  // }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }

  @Get('private')
  @UseGuards(AuthGuard())
  testingPrivateRoute(
    @Req() request: Express.Request,
    @GetUser() user: User,
    @GetUser('email') userEmail: string,

    @RawHeaders() rawHeaders: string[],
    @Headers() headers: IncomingHttpHeaders,
  ) {
    return {
      ok: true,
      message: 'Hola Mundo Private',
      user,
      userEmail,
      rawHeaders,
      headers,
    };
  }

  // @SetMetadata('roles', ['admin','super-user'])

  @Get('private2')
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)
  @UseGuards(AuthGuard(), UserRoleGuard)
  privateRoute2(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }

  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(@GetUser() user: User) {
    return {
      ok: true,
      user,
    };
  }
}
