import { Controller, Get, Post, Body, Req, Query } from '@nestjs/common';

import { AuthService } from './auth.service';
import { GetUser, Auth } from './decorators';

import { CreateUserDto, LoginUserDto } from './dto';
import { User } from 'src/user/entities/user.entity';
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
    const ipAddress =
      request.ip || request.headers['x-forwarded-for'] || 'IP no disponible';
    console.log('IP del usuario:', ipAddress);
    return this.authService.login(loginUserDto);
  }

  @Post('verify-email')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  verifyEmail(@Query('token') token: string) {
    return this.authService.verifyToken(token);
  }

  @Post('reset-password')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  resetPassword(@Query('documentNumber') documentNumber: string) {
    return this.authService.resetPassword(documentNumber);
  }

  @Get('check-status')
  @Auth()
  checkAuthStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
