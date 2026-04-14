import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './Schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { ForgetPasswordDto } from './dto/forgetPassword';
import { ResetPasswordDto } from './dto/resetPassword';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  // Registration with OTP
  async register(registerData: RegisterDto) {
    const { username, email, password } = registerData;
    const normalizedEmail  = email.trim().toLowerCase();

    const userExist = await this.userModel.findOne({ email: normalizedEmail });
    if (userExist) throw new BadRequestException('Email already exists');

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      username,
      email: normalizedEmail,
      password: hashedPassword,
      isVerified: false,
      loginAttempts: 0,
      blockedUntil: null,
    });

    await newUser.save();

    await this.emailService.sendOtp(normalizedEmail);

    return { message: 'Registration successful. OTP sent to email.' };
  }

  // Login with attempt limitation
  async login(loginData: LoginDto) {
    const { email, password } = loginData;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.userModel
      .findOne({ email: normalizedEmail })
      .select('+password +loginAttempts +blockedUntil');

    if (!user) throw new BadRequestException('Invalid email or password');

    if (user.blockedUntil && user.blockedUntil > new Date()) {
      const remainingHours = Math.ceil(
        (user.blockedUntil.getTime() - Date.now()) / (1000 * 60 * 60),
      );
      throw new BadRequestException(
        `Account blocked. Try again in ${remainingHours} hour(s)`,
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      user.loginAttempts = (user.loginAttempts || 0) + 1;

      if (user.loginAttempts >= 3) {
        user.blockedUntil = new Date(Date.now() + 24 * 60 * 60 * 1000);
        user.loginAttempts = 0;
      }

      await user.save();
      throw new BadRequestException('Invalid email or password');
    }

    user.loginAttempts = 0;
    user.blockedUntil = null;
    await user.save();

    if (!user.isVerified) {
      throw new BadRequestException('Please verify your email');
    }

    const token = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
    });

    return { message: 'Login successful', token };
  }

  // Forgot password
  async forgotPassword(forgotPass: ForgetPasswordDto) {
    const normalizedEmail = forgotPass.email.trim().toLowerCase();
    const user = await this.userModel.findOne({ email: normalizedEmail });

    if (!user) throw new BadRequestException('Email not found');

    await this.emailService.sendOtp(normalizedEmail);
    return { message: 'OTP sent to email' };
  }

  // Reset password
  async resetPassword(data: ResetPasswordDto) {
    const { email, otp, newPassword, confirmPassword } = data;
    const normalizedEmail = email.trim().toLowerCase();

    if (newPassword !== confirmPassword)
      throw new BadRequestException('Passwords do not match');

    await this.emailService.verifyOtp(normalizedEmail, otp);

    const user = await this.userModel.findOne({ email: normalizedEmail });
    if (!user) throw new BadRequestException('User not found');

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return { message: 'Password reset successful' };
  }
}
