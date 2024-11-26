import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Room } from 'src/entities/entities/Room';
import { RoomsOrder } from 'src/entities/entities/RoomsOrder';
import { Repository } from 'typeorm';
import { CreateRoomDto } from './dtos/add-room.dto';
import { RoomPhoto } from 'src/entities/entities/RoomPhoto';

@Injectable()
export class RoomsService {
    private readonly logger = new Logger(RoomsService.name);

    constructor(
        @InjectRepository(Room) private roomsRepo: Repository<Room>,
        @InjectRepository(RoomsOrder) private roomsOrderRepo: Repository<RoomsOrder>,
        @InjectRepository(RoomPhoto) private roomPhotoRepo: Repository<RoomPhoto>,
    ) {}

    async findRooms(check_in_date: string, check_out_date: string, guests: number) {
        this.logger.log(`Запит на пошук доступних номерів з датами: ${check_in_date} до ${check_out_date}, кількість гостей: ${guests}`);

        const room = this.roomsRepo.createQueryBuilder()
            .select('ro.roomIdroom')
            .from(RoomsOrder, 'ro')
            .where('ro.check_in < :check_out_date', { check_out_date })
            .andWhere('ro.check_out > :check_in_date', { check_in_date });

        const availableRooms = await this.roomsRepo
            .createQueryBuilder('r')
            .where('r.numberOfGuests >= :guests', { guests })
            .andWhere(`r.idroom NOT IN (${room.getQuery()})`)
            .setParameters(room.getParameters())
            .getMany();

        this.logger.log(`Знайдено ${availableRooms.length} доступних номерів`);
        return availableRooms;
    }

    async findRoomById(idroom: number) {
        this.logger.log(`Пошук номера за id: ${idroom}`);
        const room = await this.roomsRepo.find({ where: { idroom } });
        this.logger.log(`Знайдений номер: ${room.length ? room[0].idroom : 'не знайдено'}`);
        return room;
    }

    async orderRoom(checkIn: string, checkOut: string, usersId: number, roomsId: number) {
        this.logger.log(`Спроба забронювати номер ${roomsId} для користувача ${usersId} з датою заїзду ${checkIn} і виїзду ${checkOut}`);
        
        const room = await this.findRoomById(roomsId);
        if (!room.length) {
            this.logger.error(`Номер з id ${roomsId} не знайдений`);
            throw new Error('Room not found');
        }

        this.logger.log(`Ціна за день: ${room[0].pricePerDay}`);

        const checkInDate = new Date(checkIn);
        const checkOutDate = new Date(checkOut);
        const nights = (checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 3600 * 24);
        const totalPrice = nights * room[0].pricePerDay;
        const dateOfOrder = new Date().toISOString().split('T')[0];

        const roomOrder = this.roomsOrderRepo.create({ checkIn, checkOut, usersIdusers: usersId, roomIdroom: roomsId, totalPrice, dateOfOrder });

        this.logger.log(`Загальна ціна бронювання: ${totalPrice}`);
        return this.roomsOrderRepo.save(roomOrder);
    }

    async createRoom(createRoomDto: CreateRoomDto): Promise<Room> {
        this.logger.log(`Створення нового номера: ${JSON.stringify(createRoomDto)}`);
        const newRoom = this.roomsRepo.create(createRoomDto);
        const savedRoom = await this.roomsRepo.save(newRoom);
        this.logger.log(`Номер з id ${savedRoom.idroom} успішно створений`);
        return savedRoom;
    }

    async addRoomPhotos(roomIdroom: number, photos: string[]): Promise<RoomPhoto[]> {
        this.logger.log(`Додавання фотографій для номера з id: ${roomIdroom}`);

        const newPhotos = photos.map((photo) =>
            this.roomPhotoRepo.create({
                roomIdroom,
                roomPhoto: photo,
            }),
        );

        const savedPhotos = await this.roomPhotoRepo.save(newPhotos);
        this.logger.log(`Додано ${savedPhotos.length} фотографій для номера ${roomIdroom}`);
        return savedPhotos;
    }
}
