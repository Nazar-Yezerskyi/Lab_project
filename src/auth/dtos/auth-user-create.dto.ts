import { Expose } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class AuthUserDto{
    @IsString()
    email: string;
    @IsString()

    name: string;
    @IsString()

    lastName: string;
    @IsString()
    password_typed: string
}