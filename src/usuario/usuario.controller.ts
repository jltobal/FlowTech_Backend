import { Controller, Post, Body, Get, Delete, ValidationPipe, Param, Req, Query } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { Usuario } from './schemas/usuario.schema';

@Controller('usuario')
export class UsuarioController {

    constructor(private readonly usuarioService: UsuarioService) {}

    @Post('crear')
    async crearUsuario(@Body(new ValidationPipe()) crearUsuarioDto: CrearUsuarioDto): Promise<Usuario> {
        return this.usuarioService.crearUsuario(crearUsuarioDto);
    }

    @Get("/buscarPersonas")
    async buscarPersonas(
        @Req() req, 
        @Query("limit") limit: number = 10,
        @Query("genero") genero?: string,
        @Query("edadMinima") edadMinima?: number,
        @Query("edadMaxima") edadMaxima?: number,
        @Query("localidad") localidad?: string    
    ): Promise<Usuario[]> {
        return this.usuarioService.buscarPersonas(
            req.usuario._id,
            {limit,
            genero,
            edadMinima,
            edadMaxima,
            localidad}
        );
    }

    @Get(":id")
    async findById(@Param("id") id: string) {
        return this.usuarioService.findById(id);
    }

    @Get(":mail")
    async findByMail(@Param("mail") mail: string) {
        return this.usuarioService.findByMail(mail);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return this.usuarioService.delete(id);
    }
}
