import { IsEnum, IsOptional, IsString } from "class-validator";

export enum TipoInteraccion {
    LIKE = "Like",
    SUPERLIKE = "Superlike",
    DISLIKE = "Dislike"
}

export enum RazonDislike {
    GENERO = "Genero",
    EDAD = "Edad",
    LOCALIDAD = "Localidad",
    INCLINACION_POLITICA = "Inclinacion politica",
    GUSTOS = "Gustos",
    PARTICULAR = "Particular"
}

export class MatchDto {
    @IsString()
    usuarioDestinoId: string;

    @IsEnum(TipoInteraccion)
    tipo: TipoInteraccion;

    @IsOptional()
    @IsEnum(RazonDislike)
    razonDislike?: RazonDislike;

    @IsOptional()
    @IsString()
    valorRechazado?: string;
}