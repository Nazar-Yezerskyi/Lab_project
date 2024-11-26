import { BadRequestException, Body, Controller, Post, Session, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthUserDto } from './dtos/auth-user-create.dto';
import { AuthUserSignInDto } from './dtos/auth-signin.dto';
import { AuthAdminInterceptor } from 'src/interceptors/auth-admin.interceptor';
import { AuthGuard } from 'src/guards/auth.guard';

@Controller('auth')
export class AuthController {

    constructor(private authService: AuthService){}

    @Post('/signup-user')
    async createUser(@Body() body: AuthUserDto, @Session() session: any){
        const user = await this.authService.createUsersAcc(body.email, body.password_typed, body.name, body.lastName)
        session.idusers = user.idusers
        session.roleId = user.roleIdrole
        return user;
    } 

    @Post('signin-user')
    async singinUser(@Body() body:AuthUserSignInDto, @Session() session: any){
        const user = await this.authService.signinUser(body.email, body.password_typed)
        session.idusers = user.idusers
        session.roleId = user.roleIdrole
        session.possitionId = user.positionIdposition
        return user;
    }

    @Post('singup-user-by-admin')
    @UseInterceptors(AuthAdminInterceptor)
    async singUserByAdmin(@Body() body:any, @Session() session: any){
        const user = await this.authService.createUserByAdmin(body.email, body.name, body.lastName)
        session.idusers = user.idusers
        session.roleId = user.roleIdrole
        return user;
    }

    @Post('create-staff')
    @UseInterceptors(AuthAdminInterceptor)
    async createStaffByAdmin(
    @Body() body: { email: string, name: string, lastName: string }
    ) {
        try {
            const { email, name, lastName } = body;
            return await this.authService.createStaffByAdmin(email, name, lastName);
        }
        catch (error) {
        throw new BadRequestException(error);
    }
  }
  @Post('signout')
  @UseGuards(AuthGuard)
  async signout(@Session() session: any) {
      await this.authService.signout(session);
      return { message: 'Signed out successfully' };
  }
}
