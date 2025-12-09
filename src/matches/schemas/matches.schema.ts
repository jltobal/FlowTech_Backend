import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Types } from 'mongoose';

@Schema({ timestamps: true})
export class Match {
    @Prop({ type: [{ type: Types.ObjectId, ref: "Usuario" }], required: true})
    usuarios: Types.ObjectId[];

    @Prop({ required: true })
    fechaMatch: Date;

    @Prop({ default: true })
    estaActivo: boolean;
}

export const MatchSchema = SchemaFactory.createForClass(Match);