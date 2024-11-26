import { IsInt, IsPositive, IsNumber, IsDateString } from 'class-validator';

export class CreateServiceOrderDto {
  @IsInt()
  @IsPositive()
  servicesIdservices: number; 

}