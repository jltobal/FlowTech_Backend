import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { Usuario } from 'src/usuario/schemas/usuario.schema';

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
        console.log("usuario encontrado en la BD: ", usuario);

        console.log("******Datos para validar contraseña");
        console.log("Usuario existe? ", usuario ? "Existe" : "No existe");
        console.log("Constraseñas a comparar: " + password + " y " + usuario?.password);
        //Si existe el usuario y la contraseña introducida coincide con la de la DB, se permite el ingreso
        if (usuario && await bcrypt.compare(password, usuario.password)) {

            //Saco password del result mediante desestructuración y luego guardo lo que queda de result como un objeto
            const { password, ...result } = usuario.toObject();
            return result;
        }
        
        throw new UnauthorizedException("Datos incorrectos, por favor verifiquelos")
    }

    // Generar token JWT
    async login(usuario: LoginDto): Promise<any> {
        console.log("GENERANDO TOKEN DE USUARIO");
        const usuarioLogin = await this.usuarioService.findByMail(usuario.mail);

        if (usuarioLogin) {
            //Payload es la información del usuario que se transmite en el token
            //sub es el subject del token, y se representa por su id
            const payload = { username: usuarioLogin.username, sub: String(usuarioLogin._id) };
            console.log("PAYLOAD: ", payload);
            console.log("TOKEN: ", {
                token_type: 'Bearer',
                expire_in: 3600,
                access_token: await this.jwtService.signAsync(payload),
                usuario,
            })

            //Se devuelve al front el objeto con la información del usuario
            return {
                token_type: 'Bearer',
                expire_in: 3600,
                access_token: await this.jwtService.signAsync(payload),
                usuario,
            };
        }

        return new Error("Error al logearse");
    }
}


