import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/entities/Users';
import { Services } from './entities/entities/Services';
import { ServicesOrder } from './entities/entities/ServicesOrder';
import { RoomsOrder } from './entities/entities/RoomsOrder';
import { Room } from './entities/entities/Room';
import { RoomPhoto } from './entities/entities/RoomPhoto';
import { Role } from './entities/entities/Role';
import { Position } from './entities/entities/Position';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { RoomsModule } from './rooms/rooms.module';
import { ServicesModule } from './services/services.module';
import { EmailSenderModule } from './email-sender/email-sender.module';
import { PositionModule } from './position/position.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: '',
      host: '',
      port: 3306,
      username: '',
      password: '',
      database: '',
      entities: [Users, Services, ServicesOrder, RoomsOrder,Room,RoomPhoto, Role, Position],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    RoomsModule,
    ServicesModule,
    EmailSenderModule,
    PositionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
