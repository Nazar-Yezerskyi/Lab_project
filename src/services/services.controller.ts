import { Body, Controller, Get, Param, ParseIntPipe, Post, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { ServicesService } from './services.service';
import { Services } from 'src/entities/entities/Services';
import { CreateServiceOrderDto } from './dtos/create-service.dto';
import { AuthGuard } from 'src/guards/auth.guard';
import { CreateServiceDto } from './dtos/add-service.dto';
import { AuthAdminInterceptor } from 'src/interceptors/auth-admin.interceptor';

@Controller('services')
export class ServicesController {

    constructor(private readonly servicesService: ServicesService) {}

    @Get(':id')
    async getServiceById(@Param('id', ParseIntPipe) id: number): Promise<Services> {
      return this.servicesService.findServiceById(id);
    }
    
    @Post('order')
    @UseGuards(AuthGuard)
    async createServiceOrder(
      @Body() body: CreateServiceOrderDto,
      @Session() session: any,
    ) {
      return this.servicesService.createOrderForService(
        body.servicesIdservices,
        session.idusers,
      );
    }

    @Post('add-service')
    @UseInterceptors(AuthAdminInterceptor)
    async addService(@Body() createServiceDto: CreateServiceDto) {
        const { nameService, description, price } = createServiceDto;
        return await this.servicesService.addService(nameService, description, price);
    }
    

}
