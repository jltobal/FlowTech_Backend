import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { InteraccionesModule } from './interacciones/interacciones.module';
import { MatchesModule } from './matches/matches.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://127.0.0.1:27017/grieTinder'),
    AuthModule,
    UsuarioModule,
    InteraccionesModule,
    MatchesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
