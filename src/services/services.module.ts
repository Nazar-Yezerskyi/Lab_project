import { Module } from '@nestjs/common';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Services } from 'src/entities/entities/Services';
import { ServicesOrder } from 'src/entities/entities/ServicesOrder';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Services, ServicesOrder]), UserModule],
  controllers: [ServicesController],
  providers: [ServicesService]
})
export class ServicesModule {}
