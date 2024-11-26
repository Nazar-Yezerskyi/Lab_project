import { Module } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { RoomsController } from './rooms.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Room } from 'src/entities/entities/Room';
import { RoomsOrder } from 'src/entities/entities/RoomsOrder';
import { UserService } from 'src/user/user.service';
import { UserModule } from 'src/user/user.module';
import { RoomPhoto } from 'src/entities/entities/RoomPhoto';

@Module({
  imports: [TypeOrmModule.forFeature([Room,RoomsOrder, RoomPhoto]), UserModule],
  controllers: [RoomsController],
  providers: [RoomsService]
})
export class RoomsModule {}
