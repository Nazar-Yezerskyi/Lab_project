import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/entities/Users';
import { Position } from 'src/entities/entities/Position';
import { UserModule } from 'src/user/user.module';
import { EmailSenderModule } from 'src/email-sender/email-sender.module';

@Module({
  imports: [TypeOrmModule.forFeature([Users,Position]), UserModule, EmailSenderModule],
  controllers: [AuthController],
  providers: [AuthService]

})
export class AuthModule {}
