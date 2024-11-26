import { IsEmail, IsString } from 'class-validator';

export class AssignPositionDto {
  @IsEmail()
  email: string;

  @IsString()
  positionName: string;
}
