import { Body, Controller, Get, Param, Post, Req } from "@nestjs/common";
import { MatchesService } from "./matches.service";
import { CrearInteraccionDto } from "src/interacciones/dtos/crearInteraccion.dto";

@Controller("matches")
export class MatchesController {
    constructor(private matchesService: MatchesService) {}

    @Post("interaccion")
    async crearInteraccion(@Req() req, @Body() interaccionDto: CrearInteraccionDto) {
        return this.matchesService.crearInteraccion(req.usuario.usuarioId, interaccionDto);
    }

    @Get()
    async getMatches(@Req() req) {
        return this.matchesService.getMatchesUsuario(req.usuario.usuarioId);
    }

    @Get(":matchId")
    async getMatch(@Param("matchId") matchId: string) {
        return this.matchesService.getMatchById(matchId);
    }
}