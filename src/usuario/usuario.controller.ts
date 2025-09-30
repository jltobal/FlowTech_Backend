import { Controller, Post, Body, Get, Delete, ValidationPipe, Param } from '@nestjs/common';
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

    @Get()
    async findAll(): Promise<Usuario[]> {
        return this.usuarioService.findAll();
    }

    @Get(":id")
    async findById(@Param("id") id: string) {
        return this.usuarioService.findById(id);
    }

    @Get(':mail')
    async findByMail(@Param("mail") mail: string) {
        return this.usuarioService.findByMail(mail);
    }

    @Delete(":id")
    async delete(@Param("id") id: string) {
        return this.usuarioService.delete(id);
    }
}
