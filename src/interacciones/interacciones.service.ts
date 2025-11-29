import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Interacciones } from "./schemas/interacciones.schema";
import { Model } from 'mongoose';

interface dataInteraccion {
    usuarioOrigen: string,
    usuarioDestino: string,
    tipo: string,
    razonDislike?: string,
    valorRechazado?: string
}

@Injectable()
export class InteraccionesService {
    constructor(
        @InjectModel(Interacciones.name) private interaccionesModel: Model<Interacciones>,
    ) { }

    async crearInteraccion(data: dataInteraccion): Promise<Interacciones> {
        const interaccion = new this.interaccionesModel({
            ...data,
            fecha: new Date()
        });

        return interaccion.save();
    }

    async obtenerInteraccionesUsuario(usuarioId: string): Promise<Interacciones[]> {
        return this.interaccionesModel
                    .find({usuarioOrigen: usuarioId})
                    .populate("usuarioDestino", "-password")
                    .sort({fecha: -1})
                    .exec();
    }

    //Si almacena las 2 opciones, es que ambos usuarios interactuaron con la tarjeta del otro
    async obtenerEntreUsuarios(usuario1Id: string, usuario2Id: string): Promise<Interacciones[]> {
        return this.interaccionesModel.find({
            // $or: filtra por cualquier objeto que cumpla alguna de todas las condiciones
            $or: [
                {usuarioOrigen: usuario1Id, usuarioDestino: usuario2Id},
                {usuarioOrigen: usuario2Id, usuarioDestino: usuario1Id}
            ]
        }).sort({fecha: -1}).exec();
    }

    async verificarInteraccion(usuarioOrigenId: string, usuarioDestinoId: string, tipoInteraccion?: string): Promise<boolean> {
        const consulta: any = {
            usuarioOrigen: usuarioOrigenId,
            usuarioDestino: usuarioDestinoId
        }

        if (tipoInteraccion) {
            consulta.interaccion= tipoInteraccion;
        }

        const interaccion = await this.interaccionesModel.findOne(consulta).exec();

        return !!interaccion; // doble ! para asegurarme que sea un boolean
    }

    async consultarLikes(usuarioId: string): Promise<Interacciones[]> {
        return this.interaccionesModel.find({
            usuarioOrigen: usuarioId,
            interaccion: {$in: ["Like"]}
        }).populate("usuarioDestino", "-password").sort({fecha: -1}).exec();
    }

    async consultarSuperlikes(usuarioId: string): Promise<Interacciones[]> {
        return this.interaccionesModel.find({
            usuarioOrigen: usuarioId,
            interaccion: {$in: ["Superlike"]}
        }).populate("usuarioDestino", "-password").sort({fecha: -1}).exec();
    }

    async consultarDislikes(usuarioId: string): Promise<Interacciones[]> {
        return this.interaccionesModel.find({
            usuarioOrigen: usuarioId,
            interaccion: {$in: ["Dislike"]}
        }).populate("usuarioDestino", "-password").sort({fecha: -1}).exec();
    }

    async consultarLikesRecibidos(usuarioId: string): Promise<Interacciones[]> {
        return this.interaccionesModel.find({
            usuarioDestino: usuarioId,
            interaccion: { $in: ["Like", "Superlike"]}
        }).populate("usuarioOrigen", "-password").sort({fecha: -1}).exec();
    }

    //Al dar de baja la cuenta, se eliminan las interacciones con el usuario
    async eliminarInteraccionesDeUsuario(usuarioId: string): Promise<any> {
        return this.interaccionesModel.deleteMany({
            $or: [
                {usuarioOrigen: usuarioId},
                {usuarioDestino: usuarioId}
            ]
        }).exec();
    }
}