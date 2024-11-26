import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Services } from 'src/entities/entities/Services';
import { ServicesOrder } from 'src/entities/entities/ServicesOrder';
import { Repository } from 'typeorm';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);

  constructor(
    @InjectRepository(Services)
    private readonly servicesRepo: Repository<Services>,
    @InjectRepository(ServicesOrder)
    private readonly servicesOrderRepo: Repository<ServicesOrder>,
  ) {}

  async findServiceById(id: number): Promise<Services> {
    this.logger.log(`Пошук сервісу за id: ${id}`);

    const service = await this.servicesRepo.findOneBy({ idservices: id });

    if (!service) {
      this.logger.error(`Сервіс з id ${id} не знайдений`);
      throw new NotFoundException(`Service with id ${id} not found`);
    }

    this.logger.log(`Знайдений сервіс: ${service.nameService}`);
    return service;
  }

  async createOrderForService(serviceId: number, userId: number) {
    this.logger.log(`Створення замовлення для сервісу з id: ${serviceId} користувачем з id: ${userId}`);
    
    const service = await this.findServiceById(serviceId);

    const totalPrice = service.price;
    this.logger.log(`Ціна сервісу: ${totalPrice}`);

    const order = this.servicesOrderRepo.create({
      servicesIdservices: serviceId,
      usersIdusers: userId,
      totalPrice,
      dateOfOrder: new Date().toISOString().split('T')[0],
    });

    this.logger.log(`Замовлення для сервісу ${service.nameService} успішно створене для користувача ${userId}`);
    return this.servicesOrderRepo.save(order);
  }

  async addService(nameService: string, description: string, price: number): Promise<Services> {
    this.logger.log(`Додавання нового сервісу: ${nameService}, ціна: ${price}`);

    const newService = this.servicesRepo.create({
      nameService,
      description,
      price,
    });

    const savedService = await this.servicesRepo.save(newService);
    this.logger.log(`Сервіс ${nameService} успішно додано з id: ${savedService.idservices}`);
    return savedService;
  }
}
