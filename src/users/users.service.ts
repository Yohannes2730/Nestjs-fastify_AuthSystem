import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './Schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcryptjs';
import { randomInt } from 'node:crypto';
import { ForgetPasswordDto } from './dto/forgetPassword';
import { ResetPasswordDto } from './dto/resetPassword';
import { ResetToken, ResetTokenDocument } from './dto/resetToken';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private readonly userModel: Model<Users>,
    @InjectModel(ResetToken.name) private readonly resetTokenModel: Model<ResetTokenDocument>,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(registerData: RegisterDto) {
    const { username, email, password } = registerData;
    const userExist = await this.userModel.findOne({ email });
    if (userExist) {
      throw new BadRequestException(' this Email already found');
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new this.userModel({
      username,
      email,
      password: hashedPassword,
      isVerified: false,
    });
    await newUser.save();

    const token = this.jwtService.sign(
      { sub: newUser._id.toString() },
      { expiresIn: '1d' },
    );

    return {
      message: 'Registration successful',
    };
  }
  async login(loginData: LoginDto) {
    const { email, password } = loginData;

    const normalizedEmail = email.trim().toLowerCase();

    const user = await this.userModel
      .findOne({ email: normalizedEmail })
      .select('+password');

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Invalid email or password');
    }
    if (!user.isVerified) {
      throw new BadRequestException('Please verify your email');
    }
    const token = this.jwtService.sign({
      sub: user._id.toString(),
      email: user.email,
    });

    return {
      message: 'Login successful',
      token,
    };
  }
  async forgotPassword(forgotPass : ForgetPasswordDto) {
  const normalizedEmail = forgotPass.email.trim().toLowerCase();
  const user = await this.userModel.findOne({ email: normalizedEmail });

  if (!user) {
    throw new BadRequestException('Email not found');
  }
  const otp = randomInt(100000, 999999).toString();
  const hashedOtp = await bcrypt.hash(otp, 10);
  const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

  await this.resetTokenModel.create({
    userId: user._id,
    token: hashedOtp,
    expiresAt: otpExpiry,
    type: 'passwordReset',
  });

  await this.emailService.sendOtp(normalizedEmail, otp);

  return { message: 'OTP sent to email' };
}
  async resetPassword( data: ResetPasswordDto) {
  const { email, otp, newPassword } = data;

  const user = await this.userModel.findOne({ email });
  if (!user) throw new BadRequestException('Email not found');

  const otpRecord = await this.resetTokenModel.findOne({ userId: user._id, type: 'passwordReset' });
  if (!otpRecord) throw new BadRequestException('Invalid OTP');
  
  const isValidOtp = await bcrypt.compare(otp, otpRecord.token);

  if (!isValidOtp) throw new BadRequestException('Invalid OTP');
  if (otpRecord.expiresAt < new Date()) throw new BadRequestException('OTP expired');

  user.password = await bcrypt.hash(newPassword, 10);
  await user.save();

  await this.resetTokenModel.deleteOne({ _id: otpRecord._id });

  return { message: 'Password reset successful' };
}
}

