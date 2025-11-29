import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { UsuarioModule } from './usuario/usuario.module';
import { InteraccionesModule } from './interacciones/interacciones.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/grietinder'),
    AuthModule,
    UsuarioModule,
    InteraccionesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
