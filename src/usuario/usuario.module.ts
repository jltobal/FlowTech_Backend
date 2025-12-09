import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { Usuario, UsuarioSchema } from './schemas/usuario.schema';
import { Interacciones, InteraccionesSchema } from '../interacciones/schemas/interacciones.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }, {name: Interacciones.name, schema: InteraccionesSchema}])],
  providers: [UsuarioService],
  controllers: [UsuarioController],
  exports: [UsuarioService]
})
export class UsuarioModule {}
