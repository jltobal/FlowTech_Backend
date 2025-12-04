import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UsuarioService } from "src/usuario/usuario.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private usuarioService: UsuarioService){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: "UN_SECRETO_SEGURO"
        });
    }

    async validate(payload: any) {
        const usuario = await this.usuarioService.findById(payload.sub);
        return {usuarioId: payload.sub, email: payload.email, usuario}
    }
}