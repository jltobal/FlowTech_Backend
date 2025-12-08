import { Module, OnModuleInit } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsuarioModule } from './usuario/usuario.module';
import { AuthModule } from './auth/auth.module';
import { UsuarioService } from './usuario/usuario.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/GRIETINDER_DB'),
    UsuarioModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly usuarioService: UsuarioService) {}

  async onModuleInit() {
    console.log('--------------------------------------------------');
    console.log('🚀 Ejecutando prueba de conexión con findAll()');
    await this.usuarioService.findAll();
    console.log('✨ Prueba de conexión finalizada. Revise la consola arriba.');
    console.log('--------------------------------------------------');
  }
}

/* MongooseModule.forRoot('mongodb://localhost:27017/GRIETINDER_DB'), */
