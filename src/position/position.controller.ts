import { Body, Controller, Post, UseInterceptors } from '@nestjs/common';
import { PositionService } from './position.service';
import { CreatePositionDto } from './dtos/create-position.dto';
import { AuthAdminInterceptor } from 'src/interceptors/auth-admin.interceptor';

@Controller('position')
export class PositionController {
    constructor(private readonly positionService: PositionService) {}

    @Post('add')
    @UseInterceptors(AuthAdminInterceptor)
    async addPosition(@Body() createPositionDto: CreatePositionDto) {
        return await this.positionService.addPosition(
            createPositionDto.position,
            createPositionDto.salary,
            createPositionDto.dateOfEmploy,
        );
    } 
}
