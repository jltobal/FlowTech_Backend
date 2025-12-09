import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  Interacciones,
  InteraccionesSchema,
} from './schemas/interacciones.schema';
import { InteraccionesController } from './interacciones.controller';
import { InteraccionesService } from './interacciones.service';

const MongooseInteracciones = MongooseModule.forFeature([
  { name: Interacciones.name, schema: InteraccionesSchema },
]);
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Interacciones.name, schema: InteraccionesSchema },
    ]),
  ],
  controllers: [InteraccionesController],
  providers: [InteraccionesService],
  exports: [InteraccionesService],
})
export class InteraccionesModule {}
