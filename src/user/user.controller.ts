import { BadRequestException, Body, Controller, Patch, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AssignPositionDto } from './dtos/assing-position.dto';
import { AuthAdminInterceptor } from './../interceptors/auth-admin.interceptor';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Patch('assign-position')
    @UseInterceptors(AuthAdminInterceptor)
    async assignPosition(@Body() assignPositionDto: AssignPositionDto) {
        const { email, positionName } = assignPositionDto;
        return this.userService.assignPositionToUser(email, positionName);
    }
    
}
