import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Usuario {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, minlength: 4 })
  password: string;

  @Prop({ required: true, unique: true, match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ })
  mail: string;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);