import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usuarioService: UsuarioService,
        private jwtService: JwtService
    ) { }

    // Verificar usuario y password
    async validarUsuario(mail: string, password: string): Promise<any> {

        //Busco al usuario que se quiere logear segun su mail
        const usuario = await this.usuarioService.findByMail(mail);
        
        //Si existe el usuario y la contraseña introducida coincide con la de la DB, se permite el ingreso
        if (usuario && await bcrypt.compare(password, usuario.password)) {

            //Saco password del result mediante desestructuración y luego guardo lo que queda de result como un objeto
            const { password, ...result } = usuario.toObject(); 
            return result;
        }
        return null;
    }

    // Generar token JWT
    async login(usuario: any) {

        //Payload es la información del usuario que se transmite en el token
        //sub es el subject del token, y se representa por su id
        const payload = { username: usuario.username, sub: String(usuario._id) };

        //Se devuelve al front el objeto con la información del usuario
        return {
            token_type: 'Bearer',
            expire_in: 3600,
            access_token: this.jwtService.signAsync(payload),
            usuario,
        };
    }
}

