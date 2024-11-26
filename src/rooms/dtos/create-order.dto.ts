import { IsDateString, IsNumber, IsString } from "class-validator";

export class CreateOrderDto {
    @IsDateString() 
    checkIn: string;
  
    @IsDateString()  
    checkOut: string;
  
    @IsNumber()  
    roomsId: number;
  }