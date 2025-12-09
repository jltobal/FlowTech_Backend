import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { RazonDislike } from '../dtos/crearInteraccion.dto';
import { Types } from 'mongoose';

@Schema({ timestamps: true })
export class Interacciones {
    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    })
    usuarioOrigen: Types.ObjectId;

    @Prop({
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
        required: true
    })
    usuarioDestino: Types.ObjectId;

    @Prop({
        type: String,
        enum: ["Superlike", "Like", "Dislike"],
        required: true
    })
    interaccion: string;

    @Prop({ type: String})
    usuariosLikeados: string[];

    @Prop({ type: String})
    usuariosSuperLike: string[];

    @Prop({ type: String})
    usuariosNoGusta: string[];

    @Prop({
        type: String,
        enum: RazonDislike
    })
    razonDislike?: string;

    @Prop({type: String})
    valorRechazado?: string;

    @Prop({default: Date.now})
    fecha: Date;
}

export const InteraccionesSchema = SchemaFactory.createForClass(Interacciones);