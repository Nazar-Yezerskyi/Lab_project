import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Position } from 'src/entities/entities/Position';
import { Repository } from 'typeorm';

@Injectable()
export class PositionService {
    private readonly logger = new Logger(PositionService.name);

    constructor(
        @InjectRepository(Position)
        private positionRepo: Repository<Position>,
    ) {}

    async addPosition(position: string, salary: number, dateOfEmploy: string) {
        this.logger.log(`Спроба додати нову позицію: ${position}`);

        try {
            const newPosition = this.positionRepo.create({
                position,
                salary,
                dateOfEmploy,
            });

            const savedPosition = await this.positionRepo.save(newPosition);

            this.logger.log(`Позиція ${position} успішно додана`);
            return savedPosition;
        } catch (error) {
            this.logger.error(`Помилка при додаванні позиції ${position}:`, error);
            throw error; 
        }
    }
}
