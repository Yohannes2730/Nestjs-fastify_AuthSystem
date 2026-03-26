import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer/dist/mailer.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Users, userSchema } from 'src/users/Schema/user.schema';
import { MongooseModule } from '@nestjs/mongoose/dist/mongoose.module';
import { EmailOtp, EmailOtpSchema } from './Schema/email.schema';
@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeature([
      { name: EmailOtp.name, schema: EmailOtpSchema },
      { name: Users.name, schema: userSchema },
    ]),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.get<string>('MAIL_HOST'),
          port: Number(configService.get<number>('MAIL_PORT')),
          secure: false,
          auth: {
            user: configService.get<string>('MAIL_USER'),
            pass: configService.get<string>('MAIL_PASSWORD'),
          },
        },
      }),
    }),
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
