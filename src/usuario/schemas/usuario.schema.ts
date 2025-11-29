import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({timestamps: true})
export class Usuario {
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, minlength: 4, select: false })
  password: string;

  @Prop({ required: true, unique: true, match: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/ })
  mail: string;

  @Prop({default: false})
  perfilCompleto: boolean;

  //Propiedades a llenar en el segundo formulario de registro, por eso se agrega el "?" para que sean opcionales en principio
  @Prop()
  edad?: number;

  @Prop({
    type: String,
    enum: ["Hombre", "Mujer", "LGBTIQ+"]
  })
  genero?: string;

  @Prop()
  foto?: string; //Se deberia poner una url a una carpeta del servidor o backend

  @Prop()
  avatar?: string;

  @Prop()
  nacimiento?: Date;

  @Prop()
  localidad?: string;

  @Prop()
  inclinacion_politica: string;

  @Prop()
  gustos: string;

  @Prop()
  profesion?: string;

  @Prop()
  pasatiempo?: string;

  @Prop({default: false})
  vip?: boolean;

  @Prop({default: false})
  sugar: boolean

  @Prop({default: true})
  cuentaActiva: boolean;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);