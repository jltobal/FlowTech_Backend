import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Usuario, UsuarioSchema } from '../usuario/schemas/usuario.schema';
import { UsuarioModule } from 'src/usuario/usuario.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import { InteraccionesModule } from 'src/interacciones/interacciones.module';
import { MatchesModule } from 'src/matches/matches.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    UsuarioModule,
    InteraccionesModule,
    MatchesModule,
    PassportModule,
    InteraccionesModule,
    JwtModule.register({
      secret: "UN_SECRETO_SEGURO",
      signOptions: { expiresIn: '7d' },
    })
  ],
  providers: [AuthService, UsuarioService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
