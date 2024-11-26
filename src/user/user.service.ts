import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomBytes , scrypt as _scrypt} from 'crypto';
import { Position } from './../entities/entities/Position';

import { Users } from './../entities/entities//Users';
import { Repository } from 'typeorm';
import { promisify } from 'util';
const scrypt = promisify(_scrypt);

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    @InjectRepository(Users) private usersRepo: Repository<Users>,
    @InjectRepository(Position) private readonly positionRepo: Repository<Position>,
  ) {}

  find(email: string) {
    this.logger.log(`Пошук користувача за email: ${email}`);
    return this.usersRepo.find({ where: { email } });
  }

  findOne(id: number) {
    this.logger.log(`Пошук користувача за id: ${id}`);
    return this.usersRepo.findOne({ where: { idusers: id } });
  }

  async getUserWithPosition(id: number) {
    this.logger.log(`Отримання користувача з id: ${id} та його посади`);
    const userWithPosition = await this.usersRepo.createQueryBuilder('u')
      .leftJoinAndSelect('u.positionIdposition2', 'po')
      .where('u.idusers = :id', { id })
      .getOne();

    if (!userWithPosition) {
      this.logger.error(`Користувач з id: ${id} не знайдений`);
      throw new NotFoundException(`User with id ${id} not found.`);
    }

    this.logger.log(`Знайдений користувач: ${userWithPosition.email}, позиція: ${userWithPosition.positionIdposition2?.position}`);
    return userWithPosition;
  }

  async assignPositionToUser(email: string, positionName: string) {
    this.logger.log(`Присвоєння посади ${positionName} користувачу з email: ${email}`);

    const user = await this.usersRepo.findOne({ where: { email } });
    if (!user) {
      this.logger.error(`Користувач з email: ${email} не знайдений`);
      throw new NotFoundException(`User with email ${email} not found.`);
    }

    const position = await this.positionRepo.findOne({ where: { position: positionName } });
    if (!position) {
      this.logger.error(`Посада з назвою ${positionName} не знайдена`);
      throw new NotFoundException(`Position with name ${positionName} not found.`);
    }

    user.positionIdposition = position.idposition;
    await this.usersRepo.save(user);

    this.logger.log(`Посада ${positionName} успішно присвоєна користувачу ${email}`);
    return user;
  }
}
