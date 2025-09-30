import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Usuario, UsuarioSchema } from '../usuario/schemas/usuario.schema';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    UsuarioModule,
    PassportModule,
    JwtModule.register({
      secret: "UN_SECRETO_SEGURO",
      signOptions: { expiresIn: '1h' },
    })
  ],
  providers: [AuthService, UsuarioService],
  controllers: [AuthController],
  exports: [AuthService]
})
export class AuthModule {}
