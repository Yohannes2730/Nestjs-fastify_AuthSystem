import { Controller, Get, Post, Body, Patch, Param, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgetPasswordDto } from './dto/forgetPassword';
import { ResetPasswordDto } from './dto/resetPassword'; 

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(@Body() registerData: RegisterDto) {
    
    try {
      return await this.usersService.register(registerData); 
    } 
  catch(error){
   throw new BadRequestException('Registration failed',error.message);
  }

}
  @Post('login')
  async login(@Body() loginData: LoginDto) {
    try {
      return await this.usersService.login(loginData);
    } catch (error) {
      throw new BadRequestException('Login failed', error.message);
    }
  
}
@Post('password/forgot')
async forgotPassword(@Body() forgotPass : ForgetPasswordDto) {
  try {
    return await this.usersService.forgotPassword(forgotPass);
  } catch (error) {
    throw new BadRequestException(
      'Failed to initiate password reset',
      error.message,
    );
  }
}
@Post('password/reset')
async resetPassword(@Body() data: ResetPasswordDto) {
  try {    return await this.usersService.resetPassword(data);
  } catch (error) {   
     throw new BadRequestException('Failed to reset password', error.message);
  }

}
}