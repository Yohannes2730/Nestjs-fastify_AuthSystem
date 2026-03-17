import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './Schema/user.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { EmailService } from '../email/email.service';
@Injectable()
export class UsersService {
  constructor(
    @InjectModel(Users.name) private userModel: Model<Users>,
    private jwtService: JwtService,
    private emailService: EmailService,
  ) {}
}
