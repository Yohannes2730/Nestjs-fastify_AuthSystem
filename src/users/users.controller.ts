import { Controller, Get, Post, Body, Patch, Param, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

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
}
