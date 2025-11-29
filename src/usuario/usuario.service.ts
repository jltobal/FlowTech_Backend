import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from './schemas/usuario.schema';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';
import { Interacciones } from '../interacciones/schemas/interacciones.schema';

@Injectable()
export class UsuarioService {

    constructor(
        @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>, 
        @InjectModel(Interacciones.name) private interaccionesModel: Model<Interacciones>
    ) {};

    async crearUsuario(crearUsuarioDto: CrearUsuarioDto): Promise<Usuario> {
        const verificarExistencia = await this.usuarioModel.findOne({ mail: crearUsuarioDto.mail });

        if(verificarExistencia) {
            throw new ConflictException("Ese mail ya tiene una cuenta registrada");
        }

        //encriptación de la contraseña
        const hashedPassword = await bcrypt.hash(crearUsuarioDto.password, 10);

        //crear usuario con la contraseña codificada
        const nuevoUsuario = new this.usuarioModel({...crearUsuarioDto, password: hashedPassword})

        //Guardar el usuario en la DB
        return nuevoUsuario.save();
    }

    async completarUsuario(usuarioId: string, infoCuenta: any): Promise<Usuario> {
        const usuario = await this.usuarioModel.findByIdAndUpdate(usuarioId, {
            ...infoCuenta, 
            perfilCompleto: true,
        }, {new: true}).select("-password").exec();

        if(!usuario) {
            throw new NotFoundException("Usuario no encontrado");
        }

        return usuario;
    }

    async buscarPersonas(usuarioId: string, filtros: any): Promise<Usuario[]> {
        //Busco todas las interacciones para que no se vuelvan a ver
        const interacciones = await this.interaccionesModel.find({
            usuarioOrigen: usuarioId,
            interaccion: {
                $in: ["Like", "Dislike", "Superlike"]
            }
        }).exec();

        const usuariosInteractuados = interacciones.map(i => i.usuarioDestino.toString());
        console.log("Usuarios interactuados en UsuarioService: ", usuariosInteractuados);

        const query: any = {
            _id:{
                // $ne = not equal
                $ne: usuarioId,
                // $nin = not in
                $nin: usuariosInteractuados
            },
            cuentaActiva: true,
            perfilCompleto: true
        }

        //Aplica filtros si corresponde
        if (filtros.genero) {
            query.genero = filtros.genero;
        }

        if(filtros.edadMinima || filtros.edadMaxima) {
            query.edad = {};
            if (filtros.edadMinima) {
                // $gte = mayor o igual que
                query.edad.$gte = Number(filtros.edadMinima);
            }
            if (filtros.edadMaxima) {
                // $lte = menor o igual que
                query.edad.$lte = Number(filtros.edadMaxima);
            }
        }

        if (filtros.localidad) {
            query.localidad = filtros.localidad;
        }

        return this.usuarioModel.find(query).select("-password").exec();
    }

    async agregarLike(usuarioId: string, usuarioLikeadoId: string): Promise<void> {
        await this.interaccionesModel.findByIdAndUpdate(usuarioId, {
            $addToSet: {usuariosLikeados: usuarioLikeadoId}
        });
    }

    async agregarSuperLike(usuarioId: string, usuarioSuperLikeadoId: string): Promise<void> {
        await this.interaccionesModel.findByIdAndUpdate(usuarioId, {
            $addToSet: {usuariosSuperLike: usuarioSuperLikeadoId}
        });
    }

    async agregarDislike(usuarioId: string, usuarioNoGustaId: string): Promise<void> {
        await this.interaccionesModel.findByIdAndUpdate(usuarioId, {
            $addToSet: {usuariosNoGusta: usuarioNoGustaId}
        });
    }

    async hacerseVip(usuarioId: string, fechaFin: Date): Promise<Usuario | null> {
        return this.usuarioModel.findByIdAndUpdate(
            usuarioId, 
            {
                vip: true,
                vipExpiracion: fechaFin
            },
            {nuevo: true}
        ).select("-password").exec();
    }

    async findById(id: string) {
        return this.usuarioModel.findById(id).exec();
    }

    async findByMail(mail: string) {
        return this.usuarioModel.findOne({ mail }).exec();
    }

    async delete(id: string) {
        return this.usuarioModel.findByIdAndDelete(id).exec();
    }
}
