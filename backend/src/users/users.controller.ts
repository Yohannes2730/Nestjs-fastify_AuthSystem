import {
  Controller,
  Post,
  Body,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgetPasswordDto } from './dto/forgetPassword';
import { ResetPasswordDto } from './dto/resetPassword';
import { EmailService } from '../email/email.service';  

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly emailService: EmailService) 
   {}

  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    try {
      return await this.usersService.register(registerData);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  @Post('verify-otp')
  async verifyOtp(
    @Body('email') email: string,
    @Body('otp') otp: string,
  ) {

    return this.emailService.verifyOtp(email, otp);
  }

  @Post('resend-otp')
  async resendOtp(@Body('email') email: string) {

    await this.emailService.resendOtp(email);

    return {
      message: 'OTP resent successfully'
    };
  }
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    try { 
      return await this.usersService.login(loginData);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  @Post('password/forgot')
  async forgotPassword(@Body() forgotPass: ForgetPasswordDto) {
    try {
      return await this.usersService.forgotPassword(forgotPass);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  @Post('password/reset')
  async resetPassword(@Body() data: ResetPasswordDto) {
    try {
      return await this.usersService.resetPassword(data);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
