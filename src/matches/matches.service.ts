import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Match } from "./schemas/match.schema";
import { UsuarioService } from "src/usuario/usuario.service";
import { Model } from "mongoose";
import { MatchDto, RazonDislike, TipoInteraccion } from "./dto/matches.dto";
import { Interacciones } from "src/interacciones/schemas/interacciones.schema";

@Injectable()
export class MatchesService {
    constructor(
        @InjectModel(Match.name) private matchModel: Model<Match>,
        @InjectModel(Interacciones.name) private interaccionesModel: Model<Interacciones>,
        private usuarioService: UsuarioService
    ) {}

    async crearInteraccion(usuarioId: string, matchDto: MatchDto) {
        const { usuarioDestinoId, tipo, razonDislike, valorRechazado } = matchDto;

        const usuarioObjetivo = await this.usuarioService.findById(usuarioDestinoId);

        const interaccion = new this.interaccionesModel({
            usuarioOrigen: usuarioId, 
            usuarioDestino: usuarioDestinoId,
            interaccion: tipo,
            fecha: new Date()
        });

        if (tipo === TipoInteraccion.DISLIKE && razonDislike) {
            interaccion.razonDislike = razonDislike;

            switch (razonDislike) {
                case RazonDislike.EDAD:
                    interaccion.valorRechazado = usuarioObjetivo?.edad?.toString();
                    break;
                
                case RazonDislike.GENERO:
                    interaccion.valorRechazado = usuarioObjetivo?.genero;
                    break;
                case RazonDislike.INCLINACION_POLITICA:
                    interaccion.valorRechazado = usuarioObjetivo?.inclinacion_politica;
                    break;
                case RazonDislike.GUSTOS:
                    interaccion.valorRechazado = usuarioObjetivo?.gustos;
                    break;
                case RazonDislike.LOCALIDAD:
                    interaccion.valorRechazado = usuarioObjetivo?.localidad;
                    break;
                default:
                    interaccion.valorRechazado = usuarioObjetivo?.id;
                    break;
            }
        }

        await interaccion.save();

        //Si se da un dislike, el match queda descartado
        if (tipo === TipoInteraccion.DISLIKE) {
            return {
                matched: false, 
                mensaje: "Usuario descartado",
                razon: razonDislike || null
            }
        }

        //Si se da like o superlike, se verifica si es mutuo
        const targetUsuarioLike = await this.interaccionesModel.findOne({
            usuarioOrigen: usuarioDestinoId,
            usuarioDestino: usuarioId,
            interaccion: { $in: [TipoInteraccion.LIKE, TipoInteraccion.SUPERLIKE] }
        });

        if (targetUsuarioLike) {
            const match = await this.crearMatch(usuarioId, usuarioDestinoId);
            return {
                matched: true,
                mensaje: tipo === TipoInteraccion.SUPERLIKE ? "Es un SuperMatch!" : "Es un Match!",
                match
            }
        }

        return {
            matched: false,
            mensaje: tipo === TipoInteraccion.SUPERLIKE ? "SuperLike enviado" : "Like enviado"
        }
    }

    private async crearMatch(usuario1Id: string, usuario2Id: string): Promise<Match> {
        const match = new this.matchModel({
            usuarios: [usuario1Id, usuario2Id],
            fechaMatch: new Date()
        });
        return match.save();
    }

    async getMatchesUsuario(usuarioId: string): Promise<Match[]> {
        return this.matchModel
                .find({usuarios: usuarioId})
                .populate("usuarios", "-password")
                .sort({fechaMatch: -1})
                .exec();
    }

    async getMatchById(matchId: string): Promise<Match | null> {
        return this.matchModel
                .findById(matchId)
                .populate("usuarios", "-password")
                .exec();
    }

    async verificarMatch(usuario1Id: string, usuario2Id: string): Promise<Match | null> {
        return this.matchModel
                .findOne({
                    usuarios: { $all: [usuario1Id, usuario2Id] }
                }).exec();
    }
}