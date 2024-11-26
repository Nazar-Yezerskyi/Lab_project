import { Body, Controller, Get, Post, Query, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateOrderDto } from './dtos/create-order.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateRoomDto } from './dtos/add-room.dto';
import { AuthAdminInterceptor } from 'src/interceptors/auth-admin.interceptor';
import { AddRoomPhotosDto } from './dtos/add-room-photo.dto';

@Controller('rooms')
export class RoomsController {

    constructor(private roomsService: RoomsService){}

    @Get()
    async findRooms(@Query('check_in_date') checkInDate: string,
    @Query('check_out_date') checkOutDate: string,
    @Query('guests') guests: string, @Session() session: any){
        const rooms = await this.roomsService.findRooms(checkInDate, checkOutDate, parseInt(guests));
        console.log(rooms)
        console.log(session)
        return rooms;
    }
    @Post()
    @UseGuards(AuthGuard)
    createOrder(@Body() body:CreateOrderDto, @Session() session: any){
        console.log(session.idusers)
        return this.roomsService.orderRoom(body.checkIn, body.checkOut, session.idusers,body.roomsId)
    }

    @Post('add-room')
    @UseInterceptors(AuthAdminInterceptor)
    async createRoom(@Body() createRoomDto: CreateRoomDto) {
        return this.roomsService.createRoom(createRoomDto);
    }
    
    @Post('add-room-photo')
    @UseInterceptors(AuthAdminInterceptor)
    async addRoomPhotos(@Body() addRoomPhotosDto: AddRoomPhotosDto) {
        const { roomIdroom, photos } = addRoomPhotosDto;
        return await this.roomsService.addRoomPhotos(roomIdroom, photos);
  }

}
