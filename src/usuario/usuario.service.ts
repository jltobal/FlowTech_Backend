import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from './schemas/usuario.schema';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

@Injectable()
export class UsuarioService {

    constructor(@InjectModel(Usuario.name) private usuarioModel: Model<Usuario>) {};

    async crearUsuario(crearUsuarioDto: CrearUsuarioDto): Promise<Usuario> {
        const verificarExistencia = await this.usuarioModel.findOne({ mail: crearUsuarioDto.mail });

        //Si ya existe cuenta con ese mail, arroja error
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

    async findAll(): Promise<Usuario[]> {
        return this.usuarioModel.find().exec();
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
