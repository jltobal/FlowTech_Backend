import { Controller, Get, Query, Req } from "@nestjs/common";
import { InteraccionesService } from "./interacciones.service";

@Controller("interacciones")
export class InteraccionesController {
    constructor(private interaccionesService: InteraccionesService) {}

    // GET /interacciones
    @Get()
    async obtenerMisInteracciones(@Req() req) {
        return this.interaccionesService.obtenerInteraccionesUsuario(req.usuario.usuarioId)
    }

    // GET likes enviados ->  /interacciones/likes
    @Get("likes")
    async obtenerMisLikes(@Req() req) {
        return this.interaccionesService.consultarLikes(req.usuario.usuarioId);
    }

    // GET superlikes enviados ->  /interacciones/superlikes
    @Get("superlikes")
    async obtenerMisSuperikes(@Req() req) {
        return this.interaccionesService.consultarSuperlikes(req.usuario.usuarioId);
    }

    // GET dislikes enviados ->  /interacciones/dislikes
    @Get("dislikes")
    async obtenerMisDislikes(@Req() req) {
        return this.interaccionesService.consultarDislikes(req.usuario.usuarioId);
    }

    // GET likes recibidos ->  /interacciones/likes-recibidos
    @Get("likes-recibidos")
    async obtenerLikesRecibidos(@Req() req) {
        return this.interaccionesService.consultarLikesRecibidos(req.usuario.usuarioId);
    }

    //GET interaccion con otro usuario ->  /interacciones/con-otro-usuario
    @Get("con-otro-usuario")
    async obtenerInteraccionesConOtroUsuario(@Req() req, @Query("targetUsuarioId") targetUsuarioId: string) {
        return this.interaccionesService.obtenerEntreUsuarios(
            req.usuario.usuarioId, 
            targetUsuarioId
        );
    }
}