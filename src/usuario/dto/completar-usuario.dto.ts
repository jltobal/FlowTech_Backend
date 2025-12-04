import { IsBoolean, IsDate, IsEnum, IsNumber, IsOptional, IsString } from "class-validator";

export class UsuarioCompleto {
    @IsNumber()
    edad?: number;

    @IsEnum({
        type: String,
        enum: ["Hombre", "Mujer", "LGBTIQ+"]
    })
    genero?: string;

    @IsString()
    foto?: string; 
    
    @IsString()
    avatar?: string;

    @IsDate()
    nacimiento?: Date;

    @IsString()
    localidad?: string;

    @IsOptional()
    @IsString()
    profesion?: string;

    @IsOptional()
    @IsString()
    pasatiempo?: string;

    @IsBoolean()
    vip?: boolean;

    @IsBoolean()
    sugar: boolean

    @IsBoolean()
    cuentaActiva: boolean;
}