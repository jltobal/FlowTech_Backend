import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {

    constructor(private readonly authService: AuthService){}

    @Post('login')
    async login(@Body() loginDto: LoginDto){
        console.log("Validando que este usuario exista: ", loginDto)
        const usuario = await this.authService.validarUsuario(loginDto.mail, loginDto.password);

        if(!usuario){
            throw new UnauthorizedException('Mail o contraseña incorrecto. Intente de nuevo.')
        }
        
        console.log("Usuario encontrado y logeando")
        return this.authService.login(usuario);
    }
}
