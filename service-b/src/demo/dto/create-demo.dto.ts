import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class CreateDemoDto {
    @IsNotEmpty()
    @IsString()
    username: string;

    @IsNotEmpty()
    @IsString()
    @IsEmail()
    email: string;
}