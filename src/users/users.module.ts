import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { EmailModule } from 'src/email/email.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Users, userSchema } from './Schema/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Users.name, schema: userSchema },
    ]),
    EmailModule,
  ],
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
