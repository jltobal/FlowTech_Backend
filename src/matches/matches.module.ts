import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Interacciones, InteraccionesSchema } from "src/interacciones/schemas/interacciones.schema";
import { UsuarioModule } from "src/usuario/usuario.module";
import { MatchesService } from "./matches.service";
import { MatchesController } from "./matches.controller";
import { Match, MatchSchema } from "./schemas/matches.schema";

@Module({
    imports: [
        MongooseModule.forFeature([
            {name: Match.name, schema: MatchSchema},
            {name: Interacciones.name, schema: InteraccionesSchema}
        ]),
        UsuarioModule
    ],
    controllers: [MatchesController],
    providers: [MatchesService],
    exports: [MatchesService]
})
export class MatchesModule {}