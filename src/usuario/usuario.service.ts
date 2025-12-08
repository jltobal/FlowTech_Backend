import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { Usuario } from './schemas/usuario.schema';
import { CrearUsuarioDto } from './dto/crear-usuario.dto';

@Injectable()
export class UsuarioService {
  private readonly logger = new Logger(UsuarioService.name);

  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<Usuario>,
  ) {}

  async crearUsuario(crearUsuarioDto: CrearUsuarioDto): Promise<Usuario> {
    const verificarExistencia = await this.usuarioModel.findOne({
      mail: crearUsuarioDto.mail,
    });

    if (verificarExistencia) {
      throw new ConflictException('Ese mail ya tiene una cuenta registrada');
    }

    const hashedPassword = await bcrypt.hash(crearUsuarioDto.password, 10);

    const nuevoUsuario = new this.usuarioModel({
      ...crearUsuarioDto,
      password: hashedPassword,
    });

    return nuevoUsuario.save();
  }

  async findAll(): Promise<Usuario[]> {
    this.logger.log('--- INICIANDO PRUEBA DE findAll() EN VIVO ---');
    const usuarios = await this.usuarioModel.find().exec();
    this.logger.log(`Registros encontrados: ${usuarios.length}`);
    this.logger.debug(usuarios);
    return usuarios;
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
